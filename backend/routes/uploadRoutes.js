const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { extractTextFromUpload } = require('../controllers/uploadController');
const { protect } = require('../middleware/auth');

router.use(protect);

// Route to upload a file and extract text
router.post(
  '/extract',
  upload.single('cvFile'),
  extractTextFromUpload
);

module.exports = router;

