

import { createWorker } from 'tesseract.js';

export interface ParsedCVData {
  text: string;
  success: boolean;
  error?: string;
}

// Function to detect PDF artifacts and raw PDF code
function isPDFArtifact(text: string): boolean {
  if (!text || text.length < 10) return true;
  
  const pdfKeywords = [
    'endobj', 'xref', 'stream', 'endstream', 'startxref',
    'obj', 'TypeXRef', 'Root', 'Info', 'Filter', 'FlateDecode',
    'Length', 'trailer', 'Size', 'Prev', 'XRefStm', 'PDF',
    '0000000', '65535', 'n 000', 'f 000'
  ];
  
  // Count suspicious content more intelligently
  let suspiciousScore = 0;
  let totalLength = text.length;
  
  // Check for PDF keywords and weight them
  const foundKeywords = pdfKeywords.filter(keyword => 
    text.toLowerCase().includes(keyword.toLowerCase())
  );
  suspiciousScore += foundKeywords.length * 15; // Each keyword adds significant suspicion
  
  // Check for patterns typical of PDF raw data
  const pdfPatterns = [
    /\b\d{7,}\s+\d+\s+[nf]\b/g, // xref table pattern
    /\bendobj\s+\d+\s+\d+\s+obj\b/g, // object pattern
    /\bstream\s*\n[\s\S]*?endstream\b/g, // stream pattern
    /\b[0-9A-F]{32,}\b/gi, // Long hex strings
    /\b0000000\d+\b/g // PDF specific numbers
  ];
  
  for (const pattern of pdfPatterns) {
    const matches = text.match(pattern) || [];
    suspiciousScore += matches.length * 20;
  }
  
  // Look for meaningful CV content to offset suspicion
  const meaningfulPatterns = [
    /@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/, // Email
    /\+?[\d\s\-\(\)]{8,}/, // Phone number
    /\b(?:experience|education|skills|work|name|address|email|phone|university|company|job|position|degree|certificate|diploma|bachelor|master|phd|curriculum|vitae|resume)\b/i,
    /\b[A-Z][a-z]+\s+[A-Z][a-z]+\b/, // Names
    /\b(?:january|february|march|april|may|june|july|august|september|october|november|december|\d{4})\b/i // Dates
  ];
  
  let meaningfulScore = 0;
  for (const pattern of meaningfulPatterns) {
    if (pattern.test(text)) {
      meaningfulScore += 10;
    }
  }
  
  // Calculate final decision
  const suspiciousRatio = suspiciousScore / Math.max(totalLength, 100);
  const hasMeaningfulContent = meaningfulScore > 20;
  
  // Consider it artifacts if:
  // 1. High suspicious ratio (>0.3) and no meaningful content
  // 2. Very high suspicious ratio (>0.6) regardless
  // 3. Multiple PDF keywords (>4) regardless of other factors
  return (suspiciousRatio > 0.3 && !hasMeaningfulContent) || 
         suspiciousRatio > 0.6 || 
         foundKeywords.length > 4;
}

// Convert PDF page to image for OCR
async function convertPDFPageToImage(page: any): Promise<File> {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  
  const viewport = page.getViewport({ scale: 2.0 }); // Higher scale for better OCR
  canvas.height = viewport.height;
  canvas.width = viewport.width;
  
  await page.render({
    canvasContext: context,
    viewport: viewport
  }).promise;
  
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      const imageFile = new File([blob!], 'pdf-page.png', { type: 'image/png' });
      resolve(imageFile);
    }, 'image/png', 0.9);
  });
}

// Enhanced PDF parsing with OCR fallback for image-based PDFs
async function parsePDF(file: File): Promise<string> {
  try {
    console.log('PDF Parser: Starting enhanced PDF parsing...');
    console.log('PDF Parser: File size:', file.size, 'bytes');
    
    // For client-side PDF parsing, we'll use pdfjs-dist
    const pdfjs = await import('pdfjs-dist');
    
    // Use local worker file from public folder (most reliable)
    pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`;
    console.log('PDF Parser: PDF.js worker loaded from local file');
    
    const arrayBuffer = await file.arrayBuffer();
    console.log('PDF Parser: Array buffer created, size:', arrayBuffer.byteLength);
    
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    console.log('PDF Parser: PDF document loaded, pages:', pdf.numPages);
    
    let fullText = '';
    let hasTextContent = false;
    
    // Extract text from all pages
    for (let i = 1; i <= pdf.numPages; i++) {
      console.log(`PDF Parser: Processing page ${i}/${pdf.numPages}`);
      
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      
      console.log(`PDF Parser: Page ${i} text items:`, textContent.items.length);
      
      const pageText = textContent.items
        .filter((item: any) => item.str && item.str.trim())
        .map((item: any) => item.str)
        .join(' ');
        
      console.log(`PDF Parser: Page ${i} extracted text length:`, pageText.length);
      console.log(`PDF Parser: Page ${i} text preview:`, pageText.substring(0, 200));
      
      // Check if this page has meaningful text content
      if (pageText.trim().length > 20) {
        hasTextContent = true;
        fullText += pageText + '\n';
      } else {
        // If no text content, try OCR on this page
        console.log(`PDF Parser: Page ${i} appears to be image-based, trying OCR...`);
        try {
          const imageFile = await convertPDFPageToImage(page);
          const ocrText = await parseImage(imageFile);
          if (ocrText.trim().length > 10) {
            console.log(`PDF Parser: OCR successful for page ${i}`);
            fullText += ocrText + '\n';
            hasTextContent = true;
          }
        } catch (ocrError) {
          console.log(`PDF Parser: OCR failed for page ${i}:`, ocrError);
        }
      }
    }
    
    // Check if extracted text contains PDF artifacts
    if (fullText && isPDFArtifact(fullText)) {
      console.log('PDF artifacts detected in extracted text, trying OCR...');
      hasTextContent = false;
      fullText = ''; 
    }
    
    // If no meaningful text was extracted, try OCR on the entire document
    if (!hasTextContent || fullText.trim().length < 50) {
      console.log('PDF Parser: No text content found, trying full document OCR...');
      try {
        return await parsePDFWithOCR(pdf);
      } catch (ocrError) {
        console.log('PDF Parser: Full document OCR failed:', ocrError);
      }
    }
    
    return fullText.trim() || '';
  } catch (error) {
    console.error('PDF parsing error:', error);
    
    // Fallback: try OCR on the entire PDF
    try {
      console.log('PDF Parser: Trying OCR fallback...');
      const pdfjs = await import('pdfjs-dist');
      pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`;
      
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      
      return await parsePDFWithOCR(pdf);
    } catch (fallbackError) {
      console.log('PDF Parser: All methods failed');
      return ''; 
    }
  }
}

// OCR parsing for entire PDF document
async function parsePDFWithOCR(pdf: any): Promise<string> {
  let fullText = '';
  
  for (let i = 1; i <= Math.min(pdf.numPages, 3); i++) { // Limit to first 3 pages for performance
    console.log(`PDF OCR: Processing page ${i}/${pdf.numPages} with OCR...`);
    
    const page = await pdf.getPage(i);
    const imageFile = await convertPDFPageToImage(page);
    
    try {
      const ocrText = await parseImage(imageFile);
      fullText += ocrText + '\n\n';
      console.log(`PDF OCR: Page ${i} completed`);
    } catch (error) {
      console.log(`PDF OCR: Page ${i} failed:`, error);
    }
  }
  
  return fullText.trim();
}

// Parse Word documents using mammoth
async function parseWord(file: File): Promise<string> {
  try {
    const mammoth = await import('mammoth');
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  } catch (error) {
    console.error('Word parsing error:', error);
    throw new Error('Failed to parse Word document');
  }
}

// Advanced image preprocessing strategies
interface PreprocessingStrategy {
  name: string;
  process: (imageData: ImageData) => ImageData;
}

const preprocessingStrategies: PreprocessingStrategy[] = [
  {
    name: 'CV Optimized Binary',
    process: (imageData) => {
      const data = imageData.data;
      const width = imageData.width;
      const height = imageData.height;
      
      // First pass: enhance contrast specifically for text
      for (let i = 0; i < data.length; i += 4) {
        const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
        
        // CV-specific threshold: slightly lower to catch lighter text
        const enhanced = gray > 128 ? 255 : 0;
        data[i] = enhanced;
        data[i + 1] = enhanced;
        data[i + 2] = enhanced;
      }
      
      // Second pass: noise reduction for cleaner text
      const newData = new Uint8ClampedArray(data);
      for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
          const idx = (y * width + x) * 4;
          
          // Count surrounding black pixels
          let blackCount = 0;
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              const nIdx = ((y + dy) * width + (x + dx)) * 4;
              if (data[nIdx] === 0) blackCount++;
            }
          }
          
          // Remove isolated pixels (likely noise)
          if (blackCount < 3) {
            newData[idx] = 255;
            newData[idx + 1] = 255;
            newData[idx + 2] = 255;
          }
        }
      }
      
      for (let i = 0; i < data.length; i++) {
        data[i] = newData[i];
      }
      
      return imageData;
    }
  },
  {
    name: 'Adaptive Threshold',
    process: (imageData) => {
      const data = imageData.data;
      const width = imageData.width;
      const height = imageData.height;
      
      // Convert to grayscale first
      for (let i = 0; i < data.length; i += 4) {
        const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
        data[i] = gray;
        data[i + 1] = gray;
        data[i + 2] = gray;
      }
      
      // Apply adaptive thresholding
      const windowSize = 15;
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = (y * width + x) * 4;
          let sum = 0;
          let count = 0;
          
          // Calculate local average
          for (let wy = Math.max(0, y - windowSize); wy < Math.min(height, y + windowSize); wy++) {
            for (let wx = Math.max(0, x - windowSize); wx < Math.min(width, x + windowSize); wx++) {
              const widx = (wy * width + wx) * 4;
              sum += data[widx];
              count++;
            }
          }
          
          const localAvg = sum / count;
          const threshold = localAvg * 0.9; // Slightly below average
          const value = data[idx] > threshold ? 255 : 0;
          
          data[idx] = value;
          data[idx + 1] = value;
          data[idx + 2] = value;
        }
      }
      
      return imageData;
    }
  },
  {
    name: 'Enhanced Contrast',
    process: (imageData) => {
      const data = imageData.data;
      
      // First pass: find min and max values
      let min = 255, max = 0;
      for (let i = 0; i < data.length; i += 4) {
        const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
        min = Math.min(min, gray);
        max = Math.max(max, gray);
      }
      
      // Second pass: stretch contrast
      const range = max - min;
      if (range > 0) {
        for (let i = 0; i < data.length; i += 4) {
          const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
          const stretched = ((gray - min) / range) * 255;
          const enhanced = stretched > 127 ? 255 : 0;
          
          data[i] = enhanced;
          data[i + 1] = enhanced;
          data[i + 2] = enhanced;
        }
      }
      
      return imageData;
    }
  }
];

// Create multiple preprocessed versions of an image
async function createPreprocessedImages(file: File): Promise<File[]> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    
    img.onload = async () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      const originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const processedFiles: File[] = [];
      
      // Add original file
      processedFiles.push(file);
      
      // Create processed versions
      for (const strategy of preprocessingStrategies) {
        const imageDataCopy = new ImageData(
          new Uint8ClampedArray(originalImageData.data),
          originalImageData.width,
          originalImageData.height
        );
        
        const processedImageData = strategy.process(imageDataCopy);
        ctx.putImageData(processedImageData, 0, 0);
        
        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((blob) => resolve(blob!), 'image/png', 1.0);
        });
        
        const processedFile = new File([blob], `${strategy.name}-${file.name}`, { type: 'image/png' });
        processedFiles.push(processedFile);
      }
      
      resolve(processedFiles);
    };
    
    img.src = URL.createObjectURL(file);
  });
}

// OCR Configuration strategies
interface OCRStrategy {
  name: string;
  config: any;
}

const ocrStrategies: OCRStrategy[] = [
  {
    name: 'CV Document Mode',
    config: {
      tessedit_pageseg_mode: 1 as any, // Automatic page segmentation with OSD
      tessedit_ocr_engine_mode: 2 as any, // LSTM engine only
      tessedit_char_blacklist: '|`~#$%^*()+=[]{}\\<>?',
      preserve_interword_spaces: 1,
      tessedit_create_hocr: 0,
      tessedit_create_tsv: 0,
    }
  },
  {
    name: 'Block Text Mode',
    config: {
      tessedit_pageseg_mode: 6 as any, // Uniform block of text
      tessedit_ocr_engine_mode: 2 as any, // LSTM engine only
      tessedit_char_blacklist: '|`~#$%^*+=[]{}\\<>?',
      preserve_interword_spaces: 1,
      tessedit_create_hocr: 0,
      tessedit_create_tsv: 0,
    }
  },
  {
    name: 'Auto Segmentation',
    config: {
      tessedit_pageseg_mode: 3 as any, // Fully automatic page segmentation
      tessedit_ocr_engine_mode: 2 as any, // LSTM engine only
      tessedit_char_blacklist: '|`~#$%^*+=[]{}\\<>?',
      preserve_interword_spaces: 1,
    }
  },
  {
    name: 'Sparse Text Mode',
    config: {
      tessedit_pageseg_mode: 11 as any, // Sparse text
      tessedit_ocr_engine_mode: 2 as any, // LSTM engine only
      tessedit_char_blacklist: '|`~#$%^*+=[]{}\\<>?',
      preserve_interword_spaces: 1,
    }
  }
];

// Enhanced OCR result quality evaluation
function evaluateOCRResult(text: string, confidence: number): number {
  let score = confidence;
  
  // Basic length scoring
  if (text.length > 100) score += 15;
  if (text.length > 300) score += 25;
  if (text.length > 800) score += 35;
  
  // CV-specific content detection with higher weights
  const cvIndicators = [
    { pattern: /@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/, weight: 20, name: 'Email' },
    { pattern: /\+?[\d\s\-\(\)]{8,}/, weight: 15, name: 'Phone' },
    { pattern: /\b[A-Z][a-z]+\s+[A-Z][a-z]+\b/, weight: 18, name: 'Name Pattern' },
    { pattern: /\b(?:experience|education|skills|work|employment|job|career|professional)\b/gi, weight: 25, name: 'CV Keywords' },
    { pattern: /\b(?:university|college|degree|bachelor|master|phd|certification)\b/gi, weight: 20, name: 'Education Terms' },
    { pattern: /\b(?:company|corporation|inc|ltd|llc|technologies|solutions)\b/gi, weight: 15, name: 'Company Terms' },
    { pattern: /\b\d{4}\s*[-–]\s*(?:\d{4}|present|current)\b/gi, weight: 22, name: 'Date Ranges' },
    { pattern: /\b(?:javascript|python|java|react|angular|sql|aws|docker|git)\b/gi, weight: 18, name: 'Tech Skills' }
  ];
  
  let detectedIndicators = 0;
  cvIndicators.forEach(indicator => {
    const matches = text.match(indicator.pattern);
    if (matches) {
      score += indicator.weight;
      detectedIndicators++;
      console.log(`Found ${indicator.name}: ${matches.length} matches (+${indicator.weight})`);
    }
  });
  
  // Bonus for multiple CV indicators
  if (detectedIndicators >= 3) score += 20;
  if (detectedIndicators >= 5) score += 30;
  
  // Text structure quality
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  if (lines.length > 5) score += 10; // Good structure
  if (lines.length > 15) score += 15; // Rich content
  
  // Word quality assessment
  const words = text.split(/\s+/).filter(word => word.length > 1);
  const validWords = words.filter(word => /^[a-zA-Z@.-]+$/.test(word)).length;
  const wordRatio = validWords / Math.max(words.length, 1);
  score += wordRatio * 20; // Up to 20 points for clean words
  
  // Penalty for excessive artifacts
  const specialChars = (text.match(/[^a-zA-Z0-9\s@.,-:()\-+#&\n']/g) || []).length;
  const specialRatio = specialChars / Math.max(text.length, 1);
  if (specialRatio > 0.15) score -= 25; // Harsh penalty for artifacts
  if (specialRatio > 0.25) score -= 40; // Very harsh penalty
  
  // Penalty for very short results
  if (text.length < 30) score -= 40;
  if (text.length < 100) score -= 20;
  
  // Penalty for repetitive characters (OCR artifacts)
  const repeatedChars = text.match(/(.)\1{5,}/g);
  if (repeatedChars) score -= repeatedChars.length * 10;
  
  const finalScore = Math.max(0, Math.min(100, score));
  console.log(`OCR Quality Score: ${finalScore}/100 (confidence: ${confidence}%, indicators: ${detectedIndicators})`);
  
  return finalScore;
}

// Advanced multi-strategy OCR
async function parseImage(file: File): Promise<string> {
  try {
    console.log('Advanced OCR: Starting multi-strategy OCR...');
    console.log('File:', file.name, 'Size:', file.size, 'bytes');
    
    // Create multiple preprocessed versions
    console.log('OCR: Creating preprocessed image versions...');
    const processedImages = await createPreprocessedImages(file);
    console.log(`OCR: Created ${processedImages.length} image versions`);
    
    const results: Array<{text: string, confidence: number, score: number, strategy: string, image: string}> = [];
    
    // Smart OCR strategy execution with early termination
    let bestScore = 0;
    let attempts = 0;
    const maxAttempts = 6; // Limit total attempts
    
    for (let imgIndex = 0; imgIndex < Math.min(processedImages.length, 3) && attempts < maxAttempts; imgIndex++) {
      const imageFile = processedImages[imgIndex];
      const imageName = imgIndex === 0 ? 'Original' : preprocessingStrategies[imgIndex - 1].name;
      
      console.log(`OCR: Testing image version: ${imageName}`);
      
      for (let stratIndex = 0; stratIndex < ocrStrategies.length && attempts < maxAttempts; stratIndex++) {
        const strategy = ocrStrategies[stratIndex];
        attempts++;
        
        try {
          console.log(`OCR: Attempt ${attempts}/${maxAttempts} - ${strategy.name} on ${imageName}...`);
          
          const worker = await createWorker('eng');
          await worker.setParameters(strategy.config);
          
          const { data: { text, confidence } } = await worker.recognize(imageFile);
          await worker.terminate();
          
          const score = evaluateOCRResult(text.trim(), confidence);
          
          console.log(`OCR Result: ${strategy.name} + ${imageName}`);
          console.log(`   Confidence: ${confidence}%`);
          console.log(`   Quality Score: ${score}/100`);
          console.log(`   Text Length: ${text.length}`);
          console.log(`   Preview: ${text.substring(0, 100)}...`);
          
          results.push({
            text: text.trim(),
            confidence,
            score,
            strategy: strategy.name,
            image: imageName
          });
          
          // Track best score for early termination
          if (score > bestScore) {
            bestScore = score;
          }
          
          // Early termination if we get excellent results
          if (score >= 85) {
            console.log(`Excellent OCR result achieved (${score}/100), stopping early optimization`);
            break;
          }
          
        } catch (error) {
          console.log(`OCR: ${strategy.name} + ${imageName} failed:`, error);
        }
      }
      
      // Break outer loop if we found excellent results
      if (bestScore >= 85) break;
    }
    
    // Select best result
    if (results.length === 0) {
      throw new Error('All OCR attempts failed');
    }
    
    // Sort by quality score
    results.sort((a, b) => b.score - a.score);
    const bestResult = results[0];
    
    console.log('Best OCR Result:');
    console.log(`   Strategy: ${bestResult.strategy}`);
    console.log(`   Image: ${bestResult.image}`);
    console.log(`   Confidence: ${bestResult.confidence}%`);
    console.log(`   Quality Score: ${bestResult.score}/100`);
    console.log(`   Text Length: ${bestResult.text.length}`);
    
    // OCR Diagnostic Report
    console.log('\nOCR DIAGNOSTIC REPORT:');
    if (bestResult.score >= 80) {
      console.log('EXCELLENT - OCR quality is very high');
    } else if (bestResult.score >= 60) {
      console.log('GOOD - OCR quality is acceptable, minor issues may exist');
    } else if (bestResult.score >= 30) {
      console.log('POOR - OCR quality is low, significant text may be missing/incorrect');
      console.log('TIPS: Try scanning at higher resolution (300+ DPI), ensure good lighting, or use a different file format');
    } else {
      console.log('FAILED - OCR quality is very poor');
      console.log('TIPS: Document may be too blurry, skewed, or low resolution. Try:');
      console.log('   - Rescanning at 300+ DPI');
      console.log('   - Ensuring document is flat and well-lit');
      console.log('   - Using a PDF instead of image if possible');
      console.log('   - Checking if document is in a supported language');
    }
    
    console.log('='.repeat(60));
    console.log(bestResult.text);
    console.log('='.repeat(60));
    
    // If still poor quality, try one more advanced strategy
    if (bestResult.score < 40) {
      console.log('OCR: Quality still low, trying advanced fallback...');
      return await parseImageWithAdvancedFallback(file);
    }
    
    return bestResult.text;
    
  } catch (error) {
    console.error('Advanced OCR parsing error:', error);
    console.log('Trying simple fallback OCR method...');
    return await parseImageWithAdvancedFallback(file);
  }
}

// Advanced OCR text cleaning and correction for CVs
function cleanAndCorrectText(text: string): string {
  console.log('Advanced OCR text cleaning...');
  
  let cleaned = text;
  
  // Phase 1: Fix common OCR symbol misrecognitions
  const symbolCorrections = [
    [/\|\|/g, 'll'],                    // || -> ll
    [/\|(?=[a-z])/g, 'l'],             // | -> l (before lowercase)
    [/(?<=[a-z])\|/g, 'l'],            // | -> l (after lowercase)
    [/\|(?=\s)/g, 'I'],                // | -> I (before space, likely start of word)
    [/\[/g, 'I'],                      // [ -> I
    [/\]/g, 'l'],                      // ] -> l
    [/\{/g, '('],                      // { -> (
    [/\}/g, ')'],                      // } -> )
    [/`/g, "'"],                       // ` -> ' (apostrophe)
    [/"/g, '"'],                       // Smart quotes
    [/"/g, '"'],                       // Smart quotes
    [/'/g, "'"],                       // Smart apostrophe
    [/'/g, "'"],                       // Smart apostrophe
  ];
  
  symbolCorrections.forEach(([pattern, replacement]) => {
    cleaned = cleaned.replace(pattern, replacement);
  });
  
  // Phase 2: Context-aware character corrections
  const contextCorrections = [
    // Names and words
    [/\b([A-Z])0([a-z]{2,})\b/g, '$1O$2'],    // Capital + 0 + lowercase -> O
    [/\b([a-z]+)0([A-Z])\b/g, '$1o$2'],       // lowercase + 0 + Capital -> o
    [/\b([A-Z])1([a-z]{2,})\b/g, '$1I$2'],    // Capital + 1 + lowercase -> I
    [/\b([a-z]+)1([a-z]+)\b/g, '$1l$2'],      // lowercase + 1 + lowercase -> l
    
    // Email fixes
    [/([a-zA-Z0-9])0(@[a-zA-Z0-9.-]+)/g, '$1o$2'],  // 0 before @ -> o
    [/(@[a-zA-Z0-9.-]+)0([a-zA-Z])/g, '$1o$2'],     // 0 after @ -> o
    
    // Common word corrections
    [/\brn(?=[a-z])/g, 'm'],              // rn -> m
    [/\b1nformation\b/gi, 'Information'], // Common OCR error
    [/\b1nternet\b/gi, 'Internet'],       // Common OCR error
    [/\bcom1ng\b/gi, 'coming'],           // Common OCR error
    [/\bwork1ng\b/gi, 'working'],         // Common OCR error
    
    // Date and number formatting
    [/(\d)1(\d)/g, '$1l$2'],              // Numbers: 1 between digits might be l
    [/(\d)\s*-\s*(\d)/g, '$1-$2'],        // Clean up date ranges
    [/(\d{4})\s*-\s*(Present|present|PRESENT)/gi, '$1 - Present'], // Standardize
  ];
  
  contextCorrections.forEach(([pattern, replacement]) => {
    cleaned = cleaned.replace(pattern, replacement);
  });
  
  // Phase 3: Email and contact information cleanup
  cleaned = cleaned
    // Fix spaced emails
    .replace(/([a-zA-Z0-9._%+-]+)\s*@\s*([a-zA-Z0-9.-]+)\s*\.\s*([a-zA-Z]{2,})/g, '$1@$2.$3')
    // Fix phone numbers with excessive spaces
    .replace(/(\+?\d{1,4})\s*[-\s]\s*(\d{2,4})\s*[-\s]\s*(\d{2,4})\s*[-\s]?\s*(\d{2,4})?/g, 
      (match, p1, p2, p3, p4) => {
        if (p4) return `${p1}-${p2}-${p3}-${p4}`;
        return `${p1}-${p2}-${p3}`;
      });
  
  // Phase 4: Whitespace normalization while preserving structure
  cleaned = cleaned
    .replace(/[ \t]+/g, ' ')                    // Multiple spaces/tabs to single space
    .replace(/\n\s*\n\s*\n+/g, '\n\n')         // Multiple line breaks to double
    .replace(/\n\s+/g, '\n')                   // Remove spaces after line breaks
    .replace(/\s+$/gm, '')                     // Remove trailing spaces on lines
    .replace(/^\s+/gm, '');                    // Remove leading spaces on lines
  
  // Phase 5: CV-specific corrections
  const cvCorrections = [
    [/\bskil1s\b/gi, 'skills'],
    [/\bexper1ence\b/gi, 'experience'],
    [/\beducat1on\b/gi, 'education'],
    [/\buniver51ty\b/gi, 'university'],
    [/\bco11ege\b/gi, 'college'],
    [/\bcompan1es\b/gi, 'companies'],
    [/\btechno1ogy\b/gi, 'technology'],
    [/\btechno1ogies\b/gi, 'technologies'],
    [/\bdeve1oper\b/gi, 'developer'],
    [/\bdeve1opment\b/gi, 'development'],
    [/\bmanagement\b/gi, 'management'],
    [/\bcert1fication\b/gi, 'certification'],
  ];
  
  cvCorrections.forEach(([pattern, replacement]) => {
    cleaned = cleaned.replace(pattern, replacement);
  });
  
  // Phase 6: Final cleanup
  cleaned = cleaned
    .replace(/\s+/g, ' ')                      // Final space normalization
    .replace(/\n\s+/g, '\n')                   // Clean line starts
    .trim();                                   // Remove leading/trailing whitespace
  
  console.log('✅ Advanced OCR cleaning completed');
  console.log(`Text length: ${text.length} -> ${cleaned.length}`);
  
  return cleaned;
}

// Validate and analyze OCR text quality
function validateOCRQuality(text: string): { quality: 'excellent' | 'good' | 'poor' | 'failed', issues: string[], score: number } {
  if (!text || text.trim().length < 10) {
    return { quality: 'failed', issues: ['Text too short or empty'], score: 0 };
  }
  
  const issues: string[] = [];
  let score = 100;
  
  // Check for meaningful content
  const hasEmail = /@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text);
  const hasPhone = /\+?[\d\s\-\(\)]{8,}/.test(text);
  const hasName = /\b[A-Z][a-z]+\s+[A-Z][a-z]+\b/.test(text);
  const hasCVKeywords = /\b(?:experience|education|skills|work|university|company|job|position|degree)\b/i.test(text);
  
  if (!hasEmail) { issues.push('No email found'); score -= 15; }
  if (!hasPhone) { issues.push('No phone number found'); score -= 15; }
  if (!hasName) { issues.push('No name pattern found'); score -= 20; }
  if (!hasCVKeywords) { issues.push('No CV keywords found'); score -= 20; }
  
  // Check for OCR errors
  const commonOCRErrors = [
    { pattern: /\|/g, description: 'Pipe characters (|) detected - likely OCR confusion' },
    { pattern: /\b[0-9]{1}[a-z]+\b/g, description: 'Numbers mixed with letters' },
    { pattern: /\b[a-z]+[0-9]{1}\b/g, description: 'Letters followed by isolated numbers' },
    { pattern: /[^\w\s@.,;:()\-+#&\n'\"]/g, description: 'Unusual special characters' }
  ];
  
  for (const error of commonOCRErrors) {
    const matches = text.match(error.pattern) || [];
    if (matches.length > 0) {
      issues.push(`${error.description} (${matches.length} instances)`);
      score -= Math.min(matches.length * 2, 15);
    }
  }
  
  // Check text structure
  const words = text.split(/\s+/).filter(word => word.length > 2);
  const shortWords = words.filter(word => word.length < 3).length;
  const longWords = words.filter(word => word.length > 20).length;
  
  if (words.length < 10) {
    issues.push('Very few readable words');
    score -= 30;
  }
  
  if (shortWords > words.length * 0.3) {
    issues.push('Too many short/fragmented words');
    score -= 10;
  }
  
  if (longWords > words.length * 0.1) {
    issues.push('Too many unusually long words (possible OCR concatenation)');
    score -= 10;
  }
  
  // Determine quality level
  let quality: 'excellent' | 'good' | 'poor' | 'failed';
  if (score >= 85) quality = 'excellent';
  else if (score >= 65) quality = 'good';
  else if (score >= 30) quality = 'poor';
  else quality = 'failed';
  
  return { quality, issues, score };
}

// Advanced fallback with text cleaning
async function parseImageWithAdvancedFallback(file: File): Promise<string> {
  try {
    console.log('Advanced Fallback OCR: Starting final attempt...');
    
    const worker = await createWorker('eng');
    
    // Ultra-conservative parameters for maximum accuracy
    await worker.setParameters({
      tessedit_pageseg_mode: 3 as any, // Fully automatic page segmentation
      tessedit_ocr_engine_mode: 2 as any, // LSTM engine only
      tessedit_char_blacklist: '',
      tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,!?@#$%&*()[]{}:;-_=+/<> \n\t',
    });
    console.log('Advanced Fallback: Ultra-conservative parameters set');
    
    const { data: { text, confidence } } = await worker.recognize(file);
    console.log('Advanced Fallback: Recognition completed');
    console.log('Advanced Fallback: Confidence:', confidence);
    console.log('Advanced Fallback: Raw text length:', text.length);
    
    await worker.terminate();
    
    // Apply text cleaning and correction
    const cleanedText = cleanAndCorrectText(text);
    
    console.log('Advanced Fallback: Final cleaned text length:', cleanedText.length);
    console.log('Advanced Fallback: Final text preview:', cleanedText.substring(0, 200));
    
    return cleanedText;
  } catch (error) {
    console.error('❌ Advanced Fallback OCR also failed:', error);
    throw new Error('All OCR methods failed - image may be too poor quality or corrupted');
  }
}

// Legacy fallback for compatibility
async function parseImageWithFallback(file: File): Promise<string> {
  return await parseImageWithAdvancedFallback(file);
}

// Main parsing function that handles different file types
export async function parseCVFile(file: File): Promise<ParsedCVData> {
  try {
    let text = '';
    const fileType = file.type.toLowerCase();
    const fileName = file.name.toLowerCase();

    console.log('OCR: Processing file:', fileName, 'Type:', fileType);
    console.log('OCR: File size:', file.size, 'bytes');
    console.log('OCR: File object:', file);

    if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      console.log('OCR: Detected PDF file, starting PDF parser...');
      text = await parsePDF(file);
      console.log('OCR: PDF parser returned text length:', text.length);
      console.log('OCR: PDF parser returned text preview:', text.substring(0, 300));
    } else if (
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      fileType === 'application/msword' ||
      fileName.endsWith('.docx') ||
      fileName.endsWith('.doc')
    ) {
      console.log('OCR: Detected Word document, starting Word parser...');
      text = await parseWord(file);
      console.log('OCR: Word parser returned text length:', text.length);
      console.log('OCR: Word parser returned text preview:', text.substring(0, 300));
    } else if (
      fileType.startsWith('image/') ||
      fileName.match(/\.(jpg|jpeg|png|gif|bmp|tiff)$/i)
    ) {
      console.log('OCR: Detected image file, starting OCR with Tesseract...');
      text = await parseImage(file);
      console.log('OCR: Image parser returned text length:', text.length);
      console.log('OCR: Image parser returned text preview:', text.substring(0, 300));
    } else {
      console.log('❌ OCR: Unsupported file type!');
      console.log('❌ OCR: File type was:', fileType);
      console.log('❌ OCR: File name was:', fileName);
      throw new Error('Unsupported file type. Please upload PDF, Word document, or image file.');
    }

    console.log('OCR: Raw extracted text length:', text.length);
    
    // Validate OCR quality before cleaning
    if (text && text.trim().length > 10) {
      const qualityBefore = validateOCRQuality(text);
      console.log('OCR Quality Analysis (Before Cleaning):');
      console.log(`   Quality: ${qualityBefore.quality.toUpperCase()}`);
      console.log(`   Score: ${qualityBefore.score}/100`);
      if (qualityBefore.issues.length > 0) {
        console.log('   Issues found:');
        qualityBefore.issues.forEach(issue => console.log(`     - ${issue}`));
      }
      
      // Apply text cleaning
      const originalLength = text.length;
      text = cleanAndCorrectText(text);
      console.log(`OCR: Text cleaned - length changed from ${originalLength} to ${text.length}`);
      
      // Validate quality after cleaning
      const qualityAfter = validateOCRQuality(text);
      console.log('OCR Quality Analysis (After Cleaning):');
      console.log(`   Quality: ${qualityAfter.quality.toUpperCase()}`);
      console.log(`   Score: ${qualityAfter.score}/100`);
      console.log(`   Improvement: ${qualityAfter.score - qualityBefore.score > 0 ? '+' : ''}${qualityAfter.score - qualityBefore.score} points`);
      
      if (qualityAfter.issues.length > 0) {
        console.log('   Remaining issues:');
        qualityAfter.issues.forEach(issue => console.log(`     - ${issue}`));
      }
      
      // Provide recommendations based on quality
      if (qualityAfter.quality === 'failed' || qualityAfter.quality === 'poor') {
        console.log('⚠️ OCR RECOMMENDATIONS:');
        console.log('   - Try scanning the document at higher resolution (300+ DPI)');
        console.log('   - Ensure the document is well-lit and not skewed');
        console.log('   - If it\'s a PDF, try converting to high-quality image first');
        console.log('   - Consider using a different file format or re-scanning');
      }
    }
    
    console.log('OCR: Final text length:', text.length);
    console.log('OCR: First 500 characters:');
    console.log(text.substring(0, 500));
    console.log('OCR: FULL EXTRACTED TEXT:');
    console.log('='.repeat(100));
    console.log(text);
    console.log('='.repeat(100));
    
    // Check for PDF artifacts in the extracted text
    if (text && isPDFArtifact(text)) {
      console.log('PDF artifacts detected in extracted text, using fallback');
      text = ''; // Force fallback
    }

    // More detailed analysis of extraction results
    console.log('OCR Analysis:');
    console.log('  - Text length:', text.length);
    console.log('  - Word count:', text.split(/\s+/).filter(w => w.length > 0).length);
    console.log('  - Has email pattern:', /@/.test(text));
    console.log('  - Has phone pattern:', /\+?\d{3}/.test(text));
    console.log('  - Has typical CV words:', /(experience|education|skills|work|job)/i.test(text));
    
    // Check if we have actual text extracted
    if (!text || text.trim().length < 5) {
      console.log('❌ OCR: No text extracted from file');
      console.log('⚠️ OCR: Original text was:', text ? `"${text}"` : 'null/empty');
      console.log('OCR: This could be due to:');
      console.log('   - Poor image quality');
      console.log('   - Unsupported file format');
      console.log('   - Corrupted file');
      console.log('   - File contains only images with no text');
      
      // Return error instead of fake data
      return {
        text: '',
        success: false,
        error: 'No text could be extracted from the file. Please ensure your CV contains readable text and try uploading a higher quality file (PDF with text, not scanned images).'
      };
    }
    
    console.log('✅ OCR: Using actual extracted text from document');
    console.log(`OCR: Extracted text length: ${text.length} characters`);

    return {
      text: text.trim(),
      success: true
    };
  } catch (error) {
    console.error('❌❌❌ CV parsing error:', error);
    console.error('❌ Error type:', typeof error);
    console.error('❌ Error details:', error);
    if (error instanceof Error) {
      console.error('❌ Error message:', error.message);
      console.error('❌ Error stack:', error.stack);
    }
    return {
      text: '',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred while parsing the file'
    };
  }
}

// Validate extracted CV text
export function validateCVText(text: string): boolean {
  if (!text || text.length < 20) return false;
  
  // For testing purposes, be more lenient with validation
  // Check for common CV indicators
  const indicators = [
    /experience/i,
    /education/i,
    /skills/i,
    /work/i,
    /job/i,
    /university/i,
    /college/i,
    /degree/i,
    /email/i,
    /phone/i,
    /resume/i,
    /cv/i,
    /name/i,
    /contact/i,
    /profile/i,
    /summary/i,
    /career/i,
    /professional/i,
    /manager/i,
    /developer/i,
    /engineer/i,
    /analyst/i,
    /consultant/i,
    /director/i,
    /specialist/i
  ];
  
  const foundIndicators = indicators.filter(pattern => pattern.test(text));
  
  // If we have at least 1 indicator or the text is reasonably long, consider it valid
  return foundIndicators.length >= 1 || text.length >= 100;
}

// Clean and format extracted text
export function cleanCVText(text: string): string {
  return text
    .replace(/[ \t]+/g, ' ') // Replace multiple spaces/tabs with single space (but keep newlines!)
    .replace(/\n\s*\n\s*\n+/g, '\n\n') // Replace 3+ newlines with just 2
    .replace(/[^\w\s@.,;:()\-+#&\n\r]/g, '') // Remove special characters except common ones (keep newlines!)
    .trim();
}
