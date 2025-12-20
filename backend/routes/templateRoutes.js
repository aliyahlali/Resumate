const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getAvailableTemplates } = require('../services/cvTemplates');

// @desc    Get list of available templates
// @route   GET /api/templates
// @access  Private
router.get('/', protect, (req, res) => {
  try {
    const templates = getAvailableTemplates();
    
    res.status(200).json({
      success: true,
      data: templates
    });
  } catch (error) {
    console.error('Error getting templates:', error);
    res.status(500).json({
      success: false,
      message: 'Error while fetching templates'
    });
  }
});

module.exports = router;

