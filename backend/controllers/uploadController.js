const { extractTextFromFile, deleteFile } = require('../services/ocrService');
const path = require('path');

// @desc    Upload a CV file and extract text using OCR
// @route   POST /api/upload/extract
// @access  Private
exports.extractTextFromUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file provided',
      });
    }

    const filePath = req.file.path;
    const mimeType = req.file.mimetype;
    const fileName = req.file.originalname;

    console.log(`Processing file: ${fileName} (${mimeType})`);

    let extractedText;
    
    try {
      // Extract text from file
      extractedText = await extractTextFromFile(filePath, mimeType);
    } catch (extractError) {
      // Delete file on error
      deleteFile(filePath);
      
      return res.status(500).json({
        success: false,
        message: extractError.message || 'Error while extracting text from file',
        error: process.env.NODE_ENV === 'development' ? extractError.message : undefined,
      });
    }

    // Delete file after extraction
    deleteFile(filePath);

    res.status(200).json({
      success: true,
      data: {
        fileName: fileName,
        extractedText: extractedText,
        textLength: extractedText.length,
      },
    });
  } catch (error) {
    console.error('Error in extractTextFromUpload:', error);
    
    // Delete file on error
    if (req.file && req.file.path) {
      deleteFile(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: 'Server error while extracting text',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

