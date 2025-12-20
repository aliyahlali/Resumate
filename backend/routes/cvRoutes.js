const express = require('express');
const router = express.Router();
const {
  generateCV,
  getCVHistory,
  getCVById,
  createFromScratch,
} = require('../controllers/cvController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

router.post('/generate', generateCV);
router.post('/create-from-scratch', createFromScratch);
router.get('/history', getCVHistory);
router.get('/:id', getCVById);

module.exports = router;

