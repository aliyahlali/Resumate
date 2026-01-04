const CVHistory = require('../models/CVHistory');
const { optimizeCV, analyzeKeywordMatch } = require('../services/openaiService');
const { generateCVHTML } = require('../services/htmlGeneratorService');

// @desc    Generate an optimized CV
// @route   POST /api/cv/generate
// @access  Private
exports.generateCV = async (req, res) => {
  console.log(`POST /api/cv/generate - CV generation (User ID: ${req.user.id})`);
  try {
    const { cvText, jobDescription, templateId } = req.body;
    console.log(`  CV text length: ${cvText?.length || 0} characters`);
    console.log(`  Job description length: ${jobDescription?.length || 0} characters`);
    console.log(`  Template ID: ${templateId || 'modern-professional (default)'}`);

    // Validate input
    if (!cvText || !jobDescription) {
      return res.status(400).json({
        success: false,
        message: 'Please provide the CV text and job description',
      });
    }

    if (cvText.trim().length < 50) {
      return res.status(400).json({
        success: false,
        message: 'CV text must contain at least 50 characters',
      });
    }

    if (jobDescription.trim().length < 20) {
      return res.status(400).json({
        success: false,
        message: 'Job description must contain at least 20 characters',
      });
    }

    // Optimize CV with OpenAI
    let optimizedCVText;
    console.log('  Calling OpenAI API to optimize the CV...');
    const startTime = Date.now();
    try {
      optimizedCVText = await optimizeCV(cvText, jobDescription);
      const duration = Date.now() - startTime;
      console.log(`  CV optimized successfully (${duration}ms)`);
      console.log(`  Optimized CV length: ${optimizedCVText.length} characters`);
    } catch (error) {
      const duration = Date.now() - startTime;
      console.log(`  Error while optimizing CV (${duration}ms): ${error.message}`);
      return res.status(500).json({
        success: false,
        message: 'Error while optimizing CV',
        error: error.message,
      });
    }

    // Generate the CV HTML with the selected template
    console.log('  Generating CV HTML...');
    const cvHTML = generateCVHTML(optimizedCVText, templateId || 'modern-professional');
    console.log(`  HTML generated: ${cvHTML.length} characters`);

    // Save to history
    console.log('  Saving CV in history...');
    const cvHistory = await CVHistory.create({
      user: req.user.id,
      originalCVText: cvText,
      jobDescription: jobDescription,
      optimizedCVText: optimizedCVText,
      cvHTML: cvHTML,
    });

    console.log(`CV generated and saved successfully (CV ID: ${cvHistory._id})`);

    res.status(200).json({
      success: true,
      data: {
        id: cvHistory._id,
        optimizedCVText: optimizedCVText,
        cvHTML: cvHTML,
        createdAt: cvHistory.createdAt,
      },
    });
  } catch (error) {
    console.error('Error generating CV:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while generating CV',
      error: error.message,
    });
  }
};

// @desc    Get generated CV history
// @route   GET /api/cv/history
// @access  Private
exports.getCVHistory = async (req, res) => {
  console.log(`GET /api/cv/history - Fetching history (User ID: ${req.user.id})`);
  try {
    const cvHistory = await CVHistory.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .select('_id optimizedCVText cvHTML createdAt jobDescription');

    console.log(`History fetched: ${cvHistory.length} CV(s) found`);

    res.status(200).json({
      success: true,
      count: cvHistory.length,
      data: cvHistory,
    });
  } catch (error) {
    console.error('Error fetching CV history:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching history',
      error: error.message,
    });
  }
};

// @desc    Get a specific CV by ID
// @route   GET /api/cv/:id
// @access  Private
exports.getCVById = async (req, res) => {
  console.log(`GET /api/cv/${req.params.id} - Fetching CV (User ID: ${req.user.id})`);
  try {
    const cv = await CVHistory.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!cv) {
      console.log(`  CV not found: ${req.params.id}`);
      return res.status(404).json({
        success: false,
        message: 'CV not found',
      });
    }

    console.log(`  CV found: ${req.params.id}`);

    res.status(200).json({
      success: true,
      data: {
        id: cv._id,
        originalCVText: cv.originalCVText,
        jobDescription: cv.jobDescription,
        optimizedCVText: cv.optimizedCVText,
        cvHTML: cv.cvHTML,
        createdAt: cv.createdAt,
      },
    });
  } catch (error) {
    console.error('Error fetching CV:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching CV',
      error: error.message,
    });
  }
};

// @desc    Create a CV from scratch using structured data
// @route   POST /api/cv/create-from-scratch
// @access  Private
exports.createFromScratch = async (req, res) => {
  console.log(`POST /api/cv/create-from-scratch - Create CV from scratch (User ID: ${req.user.id})`);
  try {
    const { cvData, templateId, jobDescription } = req.body;
    
    // Validate required data
    if (!cvData || !cvData.name) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least the name in the CV data',
      });
    }

    // Default structure for CV data
    const structuredData = {
      name: cvData.name || '',
      jobTitle: cvData.jobTitle || '',
      contact: {
        email: cvData.contact?.email || '',
        phone: cvData.contact?.phone || '',
        address: cvData.contact?.address || '',
        website: cvData.contact?.website || '',
      },
      profile: cvData.profile || '',
      experience: cvData.experience || [],
      projects: cvData.projects || [],
      education: cvData.education || [],
      skills: cvData.skills || [],
      languages: cvData.languages || [],
      certifications: cvData.certifications || [],
      references: cvData.references || [],
    };

    console.log(
      `  Data received: Name=${structuredData.name}, Experiences=${structuredData.experience.length}, Education=${structuredData.education.length}`
    );

    // Generate CV HTML using the selected template
    console.log('  Generating CV HTML...');
    const { generateCVHTMLFromData } = require('../services/htmlGeneratorService');
    const cvHTML = generateCVHTMLFromData(structuredData, templateId || 'modern-professional');
    console.log(`  HTML generated: ${cvHTML.length} characters`);

    // Create a CV text representation for history (optional, for compatibility)
    const cvText = generateCVTextFromData(structuredData);

    // Save in history
    console.log('  Saving CV in history...');
    const cvHistory = await CVHistory.create({
      user: req.user.id,
      originalCVText: cvText,
      jobDescription: jobDescription || '',
      optimizedCVText: cvText, // No optimization for CVs created from scratch
      cvHTML: cvHTML,
    });

    console.log(`CV created and saved successfully (CV ID: ${cvHistory._id})`);

    res.status(200).json({
      success: true,
      data: {
        id: cvHistory._id,
        cvHTML: cvHTML,
        createdAt: cvHistory.createdAt,
      },
    });
  } catch (error) {
    console.error('Error creating CV from scratch:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating CV',
      error: error.message,
    });
  }
};

/**
 * Generate a CV text representation from structured data 
 */
function generateCVTextFromData(cvData) {
  let text = `${cvData.name}\n`;
  if (cvData.jobTitle) text += `${cvData.jobTitle}\n`;
  text += '\n';
  
  if (cvData.contact.email) text += `Email: ${cvData.contact.email}\n`;
  if (cvData.contact.phone) text += `Phone: ${cvData.contact.phone}\n`;
  if (cvData.contact.address) text += `Address: ${cvData.contact.address}\n`;
  if (cvData.contact.website) text += `Website: ${cvData.contact.website}\n`;
  text += '\n';
  
  if (cvData.profile) {
    text += `PROFESSIONAL PROFILE\n${cvData.profile}\n\n`;
  }
  
  if (cvData.experience.length > 0) {
    text += 'PROFESSIONAL EXPERIENCE\n';
    cvData.experience.forEach(exp => {
      text += `${exp.position} | ${exp.company}${exp.location ? ', ' + exp.location : ''}\n`;
      if (exp.period) text += `${exp.period}\n`;
      if (exp.description) text += `${exp.description}\n`;
      text += '\n';
    });
  }
  
  if (cvData.education.length > 0) {
    text += 'EDUCATION\n';
    cvData.education.forEach(edu => {
      text += `${edu.institution}\n${edu.degree}\n${edu.period}\n\n`;
    });
  }
  
  if (cvData.skills.length > 0) {
    text += 'SKILLS\n';
    cvData.skills.forEach(skill => {
      text += `• ${skill}\n`;
    });
    text += '\n';
  }
  
  if (cvData.projects.length > 0) {
    text += 'PROJECTS\n';
    cvData.projects.forEach(proj => {
      text += `${proj.name}${proj.period ? ' | ' + proj.period : ''}\n`;
      if (proj.description) text += `${proj.description}\n`;
      text += '\n';
    });
  }
  
  return text;
}

// @desc    Analyze match between CV and job description
// @route   POST /api/cv/analyze-match
// @access  Private
exports.analyzeMatch = async (req, res) => {
  console.log(`POST /api/cv/analyze-match - Analyzing match (User ID: ${req.user.id})`);
  try {
    const { cvText, jobDescription } = req.body;

    // Validate input
    if (!cvText || !jobDescription) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both CV text and job description',
      });
    }

    if (cvText.trim().length < 50) {
      return res.status(400).json({
        success: false,
        message: 'CV text must contain at least 50 characters',
      });
    }

    if (jobDescription.trim().length < 20) {
      return res.status(400).json({
        success: false,
        message: 'Job description must contain at least 20 characters',
      });
    }

    // Analyze match using OpenAI
    console.log('  Analyzing keyword match...');
    const startTime = Date.now();
    try {
      const matchAnalysis = await analyzeKeywordMatch(cvText, jobDescription);
      const duration = Date.now() - startTime;
      console.log(`  Match analysis completed (${duration}ms)`);
      console.log(`  Match Score: ${matchAnalysis.score}%`);

      res.status(200).json({
        success: true,
        data: {
          matchScore: matchAnalysis.score,
          matchedKeywords: matchAnalysis.matchedKeywords,
          missingKeywords: matchAnalysis.missingKeywords,
          summary: matchAnalysis.summary,
        },
      });
    } catch (error) {
      const duration = Date.now() - startTime;
      console.log(`  Error during match analysis (${duration}ms): ${error.message}`);
      return res.status(500).json({
        success: false,
        message: 'Error during match analysis',
        error: error.message,
      });
    }
  } catch (error) {
    console.error('Error analyzing match:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while analyzing match',
      error: error.message,
    });
  }
};

