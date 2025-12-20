const { createWorker } = require('tesseract.js');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { 
  isPDFArtifact, 
  cleanAndCorrectText, 
  cleanPDFArtifacts, 
  validateOCRQuality,
  evaluateOCRResult
} = require('./textCleaner');

/**
 * Extract text from a PDF file
 * With artifact detection and OCR fallback if needed
 */
const extractTextFromPDF = async (filePath) => {
  try {
    console.log('Extracting PDF text...');
    
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    let text = data.text;
    
    console.log(`PDF text extracted: ${text.length} characters`);
    
    // Check if extracted text contains PDF artifacts
    if (text && isPDFArtifact(text)) {
      console.log('PDF artifacts detected in extracted text');
      text = cleanPDFArtifacts(text);
      console.log(`After cleaning: ${text.length} characters`);
    }
    
    // If text is too short or seems to be artefacts, throw error
    if (!text || text.trim().length < 20) {
      throw new Error('The PDF appears to be a scanned image. Please use an image file directly for OCR.');
    }
    
    return text;
  } catch (error) {
    console.error('Error while extracting PDF text:', error);
    throw new Error(`Error while extracting PDF text: ${error.message}`);
  }
};

/**
 * Extract text from a Word file (.docx)
 */
const extractTextFromWord = async (filePath) => {
  try {
    console.log('Extracting Word text...');
    
    const result = await mammoth.extractRawText({ path: filePath });
    let text = result.value;
    
    console.log(`Word text extracted: ${text.length} characters`);
    
    if (!text || text.trim().length < 10) {
      throw new Error('No text could be extracted from the Word document');
    }
    
    return text.trim();
  } catch (error) {
    console.error('Error while extracting Word text:', error);
    throw new Error(`Error while extracting Word text: ${error.message}`);
  }
};

/**
 * Advanced OCR with multiple strategies (based on frontend solution)
 */
const extractTextFromImageAdvanced = async (filePath) => {
  try {
    console.log('Advanced OCR: starting...');
    
    // OCR strategies (based on frontend solution)
    const ocrStrategies = [
      {
        name: 'CV Document Mode',
        config: {
          tessedit_pageseg_mode: '1', // Automatic page segmentation with OSD
          tessedit_ocr_engine_mode: '2', // LSTM engine only
          preserve_interword_spaces: '1',
        }
      },
      {
        name: 'Block Text Mode',
        config: {
          tessedit_pageseg_mode: '6', // Uniform block of text
          tessedit_ocr_engine_mode: '2',
          preserve_interword_spaces: '1',
        }
      },
      {
        name: 'Auto Segmentation',
        config: {
          tessedit_pageseg_mode: '3', // Fully automatic page segmentation
          tessedit_ocr_engine_mode: '2',
        }
      }
    ];
    
    // Create optimized versions of the image
    const optimizedPaths = await createOptimizedImages(filePath);
    
    const results = [];
    
    // Test different strategies with different image versions
    for (const imagePath of [filePath, ...optimizedPaths].slice(0, 2)) {
      for (const strategy of ocrStrategies.slice(0, 2)) {
        try {
          console.log(`OCR: ${strategy.name} on ${path.basename(imagePath)}`);
          
          const worker = await createWorker('fra+eng'); // French + English
          
          // Configure Tesseract parameters
          for (const [key, value] of Object.entries(strategy.config)) {
            await worker.setParameters({ [key]: value });
          }
          
          const { data: { text, confidence } } = await worker.recognize(imagePath, 'fra+eng', {
            logger: (m) => {
              if (m.status === 'recognizing text') {
                console.log(`  OCR progress: ${Math.round(m.progress * 100)}%`);
              }
            },
          });
          
          await worker.terminate();
          
          // Clean and correct text
          const cleanedText = cleanAndCorrectText(text);
          
          // Evaluate quality with evaluateOCRResult
          const score = evaluateOCRResult(cleanedText, confidence);
          
          // Validate to get detailed information
          const quality = validateOCRQuality(cleanedText);
          
          results.push({
            text: cleanedText,
            confidence,
            score: score,
            strategy: strategy.name,
            quality: quality.quality,
          });
          
          console.log(`  ${strategy.name}: Score ${score}/100, confidence ${confidence}%`);
          
          // Stop early if we already have an excellent result
          if (score >= 85) {
            console.log('Excellent result reached, stopping optimization');
            break;
          }
        } catch (error) {
          console.log(`  ${strategy.name} failed:`, error.message);
        }
      }
      
      if (results.length > 0 && results[results.length - 1].score >= 85) {
        break;
      }
    }
    
    // Clean optimized images
    optimizedPaths.forEach(p => {
      if (fs.existsSync(p) && p !== filePath) {
        fs.unlinkSync(p);
      }
    });
    
    if (results.length === 0) {
      throw new Error('All OCR attempts failed');
    }
    
    // Select best result
    results.sort((a, b) => b.score - a.score);
    const bestResult = results[0];
    
    console.log('Best OCR result:');
    console.log(`   Strategy: ${bestResult.strategy}`);
    console.log(`   Quality: ${bestResult.quality} (${bestResult.score}/100)`);
    console.log(`   Confidence: ${bestResult.confidence}%`);
    console.log(`   Text length: ${bestResult.text.length} characters`);
    
    return bestResult.text;
    
  } catch (error) {
    console.error('Error during advanced OCR:', error);
    throw error;
  }
};

/**
 * Create optimized image versions for OCR
 */
async function createOptimizedImages(filePath) {
  const optimizedPaths = [];
  const basePath = filePath.replace(path.extname(filePath), '');
  
  try {
    // Version 1: cleanup and higher contrast
    const optimized1 = `${basePath}_opt1.png`;
    await sharp(filePath)
      .resize(2000, null, { withoutEnlargement: true })
      .sharpen()
      .greyscale()
      .normalize()
      .toFile(optimized1);
    optimizedPaths.push(optimized1);
    
    // Version 2: adaptive binarization
    const optimized2 = `${basePath}_opt2.png`;
    await sharp(filePath)
      .resize(2000, null, { withoutEnlargement: true })
      .greyscale()
      .normalize()
      .threshold(128)
      .toFile(optimized2);
    optimizedPaths.push(optimized2);
    
    console.log(`${optimizedPaths.length} optimized image versions created`);
  } catch (error) {
    console.warn('Error while creating optimized images:', error.message);
  }
  
  return optimizedPaths;
}

/**
 * Detect file type and extract text using advanced logic
 */
exports.extractTextFromFile = async (filePath, mimeType) => {
  try {
    console.log(`\nExtracting text for: ${path.basename(filePath)} (type: ${mimeType})`);
    
    let extractedText = '';

    // PDF
    if (mimeType === 'application/pdf' || path.extname(filePath).toLowerCase() === '.pdf') {
      extractedText = await extractTextFromPDF(filePath);
    }
    // Word documents
    else if (
      mimeType === 'application/msword' ||
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      ['.doc', '.docx'].includes(path.extname(filePath).toLowerCase())
    ) {
      extractedText = await extractTextFromWord(filePath);
    }
    // Images (PNG, JPG, JPEG, GIF, WEBP) - use advanced OCR
    else if (mimeType.startsWith('image/')) {
      extractedText = await extractTextFromImageAdvanced(filePath);
    }
    else {
      throw new Error(`Unsupported file type: ${mimeType}`);
    }

    // Final validation
    if (!extractedText || extractedText.trim().length < 10) {
      throw new Error('No text could be extracted from the file. Make sure the file contains readable text.');
    }

    // Final cleanup and validation
    extractedText = cleanAndCorrectText(extractedText);
    const quality = validateOCRQuality(extractedText);
    
    console.log('\nQuality analysis:');
    console.log(`   Quality: ${quality.quality.toUpperCase()} (${quality.score}/100)`);
    if (quality.issues.length > 0) {
      console.log(`   Issues detected: ${quality.issues.join(', ')}`);
    }
    
    console.log(`Text extracted successfully: ${extractedText.length} characters\n`);

    return extractedText.trim();
  } catch (error) {
    console.error('Error in extractTextFromFile:', error);
    throw error;
  }
};

/**
 * Remove an uploaded file
 */
exports.deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`File deleted: ${path.basename(filePath)}`);
    }
  } catch (error) {
    console.error(`Error while deleting file ${filePath}:`, error);
  }
};
