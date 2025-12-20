image.pngml2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export interface DownloadOptions {
  filename?: string;
  quality?: number;
  format?: 'a4' | 'letter';
}

export async function downloadCVAsPDF(
  elementId: string = 'cv-template',
  options: DownloadOptions = {}
): Promise<void> {
  try {
    const {
      filename = 'optimized-cv.pdf',
      quality = 2,
      format = 'a4'
    } = options;

    // Get the CV template element
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with ID "${elementId}" not found`);
    }

    console.log('Starting PDF generation...');

    // Clean the element of any unwanted content before capturing
    const cleanElement = cleanElementForPDF(element);

    // Configure canvas options for high quality
    const canvas = await html2canvas(cleanElement, {
      scale: quality,
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      width: cleanElement.scrollWidth,
      height: cleanElement.scrollHeight,
      scrollX: 0,
      scrollY: 0,
      logging: false, // Disable logging to prevent console spam
      removeContainer: true
    });

    console.log('Canvas captured successfully');

    // Calculate PDF dimensions
    const imgWidth = format === 'a4' ? 210 : 216;
    const imgHeight = format === 'a4' ? 297 : 279;
    
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    
    // Calculate scaling to fit page
    const scale = Math.min(imgWidth / (canvasWidth * 0.264583), imgHeight / (canvasHeight * 0.264583));
    const scaledWidth = (canvasWidth * 0.264583) * scale;
    const scaledHeight = (canvasHeight * 0.264583) * scale;

    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: format,
      compress: true
    });

    // Add image to PDF
    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    
    // Center the image on the page
    const x = (imgWidth - scaledWidth) / 2;
    const y = (imgHeight - scaledHeight) / 2;
    
    pdf.addImage(imgData, 'JPEG', x, y, scaledWidth, scaledHeight);

    console.log('PDF created successfully');

    // Download the PDF
    pdf.save(filename);
    
    console.log('PDF download initiated');

  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
}

// Clean element to prevent PDF raw code from appearing
function cleanElementForPDF(element: HTMLElement): HTMLElement {
  const clone = element.cloneNode(true) as HTMLElement;
  
  // Remove any script tags or problematic content
  const scripts = clone.querySelectorAll('script');
  scripts.forEach(script => script.remove());
  
  // Remove any elements with PDF-like content
  const textNodes = clone.querySelectorAll('*');
  textNodes.forEach(node => {
    if (node.textContent && node.textContent.includes('endobj')) {
      node.remove();
    }
    if (node.textContent && node.textContent.includes('xref')) {
      node.remove();
    }
    if (node.textContent && node.textContent.includes('stream')) {
      node.remove();
    }
  });
  
  return clone;
}

export async function downloadCVAsImage(
  elementId: string = 'cv-template',
  filename: string = 'optimized-cv.png'
): Promise<void> {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with ID "${elementId}" not found`);
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
    });

    // Create download link
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

  } catch (error) {
    console.error('Error generating image:', error);
    throw new Error('Failed to generate image. Please try again.');
  }
}

// Utility function to validate filename
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-z0-9.-]/gi, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^_+|_+$/g, '');
}

// Function to prepare element for PDF generation
export function prepareCVForDownload(elementId: string = 'cv-template'): void {
  const element = document.getElementById(elementId);
  if (!element) return;

  // Add print styles
  element.style.fontFamily = 'system-ui, -apple-system, sans-serif';
  element.style.fontSize = '11pt';
  element.style.lineHeight = '1.4';
  element.style.color = '#1f2937';
  element.style.backgroundColor = '#ffffff';
  
  // Ensure proper sizing
  element.style.width = '210mm';
  element.style.minHeight = '297mm';
  element.style.padding = '20mm';
  element.style.boxSizing = 'border-box';
}

// Function to show download progress
export function showDownloadProgress(message: string = 'Generating PDF...'): HTMLElement {
  const overlay = document.createElement('div');
  overlay.id = 'download-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    color: white;
    font-family: system-ui, sans-serif;
  `;
  
  overlay.innerHTML = `
    <div style="text-align: center; background: white; padding: 2rem; border-radius: 8px; color: black;">
      <div style="width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1rem;"></div>
      <p>${message}</p>
    </div>
    <style>
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>
  `;
  
  document.body.appendChild(overlay);
  return overlay;
}

export function hideDownloadProgress(): void {
  const overlay = document.getElementById('download-overlay');
  if (overlay) {
    document.body.removeChild(overlay);
  }
}

// Convert HTML string to PDF and download
export async function downloadHTMLAsPDF(
  htmlContent: string,
  filename: string = 'cv.pdf'
): Promise<void> {
  try {
    console.log('Converting HTML to PDF...');
    
    // Create a temporary container
    const container = document.createElement('div');
    container.style.cssText = `
      position: absolute;
      left: -9999px;
      top: 0;
      width: 210mm;
      background: white;
      padding: 0;
      margin: 0;
    `;
    container.innerHTML = htmlContent;
    document.body.appendChild(container);
    
    // Wait for content to render
    await new Promise(resolve => setTimeout(resolve, 500));
    // Convert to PDF
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      width: container.scrollWidth,
      height: container.scrollHeight,
      logging: false,
    });
    
    console.log('HTML Canvas captured');
    
    // Create PDF
    const imgWidth = 210; // A4 width in mm
    const imgHeight = 297; // A4 height in mm
    
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    
    // Calculate scaling to fit A4
    const scale = Math.min(imgWidth / (canvasWidth * 0.264583), imgHeight / (canvasHeight * 0.264583));
    const scaledWidth = (canvasWidth * 0.264583) * scale;
    const scaledHeight = (canvasHeight * 0.264583) * scale;
    
    const pdf = new jsPDF({
      orientation: scaledHeight > scaledWidth ? 'portrait' : 'landscape',
      unit: 'mm',
      format: 'a4',
      compress: true
    });
    
    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    
    // Center on page
    const x = (imgWidth - scaledWidth) / 2;
    const y = (imgHeight - scaledHeight) / 2;
    
    pdf.addImage(imgData, 'JPEG', x, y, scaledWidth, scaledHeight);
    
    console.log('PDF created from HTML');
    
    // Download
    pdf.save(filename);
    
    // Cleanup
    document.body.removeChild(container);
    
    console.log('✅ PDF download completed');
    
  } catch (error) {
    console.error('❌ Error converting HTML to PDF:', error);
    throw new Error('Failed to convert HTML to PDF. Please try again.');
  }
}
