const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads folder if it does not exist
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate a unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

// Filter accepted file types
const fileFilter = (req, file, cb) => {
  // Accept images 
  const imageTypes = /jpeg|jpg|png|gif|webp/;
  // Accept documents
  const docTypes = /pdf|doc|docx/;

  const extname = imageTypes.test(path.extname(file.originalname).toLowerCase()) ||
                  docTypes.test(path.extname(file.originalname).toLowerCase());

  const mimetype = imageTypes.test(file.mimetype) || 
                   file.mimetype === 'application/pdf' ||
                   file.mimetype === 'application/msword' ||
                   file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type. Allowed formats: PDF, DOC, DOCX, PNG, JPG, JPEG, GIF, WEBP'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, 
  },
  fileFilter: fileFilter,
});

module.exports = upload;

