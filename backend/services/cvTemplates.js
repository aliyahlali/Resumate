/**
 * CV templates service
 * Contains different CV designs that the user can choose from
 */

/**
 * Template 1: Modern Professional (AHMDD SAAH style)
 * Modern design with sidebar and timeline
 */
const modernProfessionalTemplate = (cvData) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CV - Modern Professional</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.4;
            color: #333;
            background: #fff;
        }
        .cv-container {
            display: flex;
            max-width: 210mm;
            height: 297mm;
            margin: 0 auto;
            background: #fff;
            overflow: hidden;
        }
        .sidebar {
            width: 35%;
            background: #f8f9fa;
            padding: 30px 20px;
            border-right: 3px solid #e0e0e0;
            overflow: hidden;
        }
        .main-content {
            width: 65%;
            padding: 30px 25px;
            position: relative;
            overflow: hidden;
        }
        .timeline {
            position: absolute;
            left: 0;
            top: 200px;
            bottom: 40px;
            width: 3px;
            background: #e0e0e0;
        }
        .timeline-dot {
            position: absolute;
            left: -6px;
            width: 15px;
            height: 15px;
            background: #333;
            border-radius: 50%;
            border: 3px solid #fff;
        }
        h1 {
            font-size: 28px;
            font-weight: bold;
            text-transform: uppercase;
            margin-bottom: 4px;
            letter-spacing: 2px;
            line-height: 1.1;
        }
        .job-title {
            font-size: 13px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 2px solid #333;
        }
        h2 {
            font-size: 13px;
            font-weight: bold;
            text-transform: uppercase;
            margin-bottom: 10px;
            margin-top: 12px;
            letter-spacing: 1px;
            border-bottom: 2px solid #333;
            padding-bottom: 5px;
        }
        h3 {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 8px;
            line-height: 1.3;
        }
        .section {
            margin-bottom: 12px;
        }
        .main-content .section {
            margin-bottom: 12px;
        }
        .contact-item {
            display: flex;
            align-items: center;
            margin-bottom: 6px;
            font-size: 12px;
            line-height: 1.3;
        }
        .contact-icon {
            width: 18px;
            margin-right: 8px;
            font-weight: bold;
            font-size: 14px;
        }
        .skills-list {
            list-style: none;
            padding: 0;
        }
        .skills-list li {
            margin-bottom: 5px;
            padding-left: 14px;
            position: relative;
            font-size: 12px;
            line-height: 1.3;
        }
        .skills-list li:before {
            content: "•";
            position: absolute;
            left: 0;
            font-weight: bold;
            font-size: 14px;
        }
        .experience-item {
            margin-bottom: 12px;
            padding-left: 20px;
            position: relative;
        }
        .company-name {
            font-weight: bold;
            font-size: 17px;
            margin-bottom: 5px;
            line-height: 1.3;
        }
        .job-position {
            font-size: 15px;
            color: #666;
            margin-bottom: 10px;
            line-height: 1.4;
        }
        .date-range {
            font-size: 14px;
            color: #999;
            font-style: italic;
            float: right;
        }
        .description {
            font-size: 13px;
            line-height: 1.6;
            color: #444;
        }
        .description ul {
            margin-left: 20px;
            margin-top: 8px;
            margin-bottom: 8px;
            padding-left: 0;
        }
        .description li {
            margin-bottom: 6px;
            line-height: 1.5;
            text-align: justify;
        }
        .description p {
            margin-bottom: 8px;
            line-height: 1.6;
            text-align: justify;
        }
        @media print {
            body {
                background: #fff;
            }
            .cv-container {
                box-shadow: none;
            }
        }
    </style>
</head>
<body>
    <div class="cv-container">
        <div class="sidebar">
            ${cvData.sidebar || ''}
        </div>
        <div class="main-content">
            <div class="timeline"></div>
            ${cvData.mainContent || ''}
        </div>
    </div>
</body>
</html>`;
};

/**
 * Template 2: Clean Minimal (Emma Ahearn style)
 * Clean and centered design
 */
const cleanMinimalTemplate = (cvData) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CV - Clean Minimal</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Georgia', serif;
            line-height: 1.4;
            color: #333;
            background: #fff;
            padding: 20px;
        }
        .cv-container {
            max-width: 800px;
            margin: 0 auto;
            background: #fff;
            height: 257mm;
            overflow: hidden;
        }
        h1 {
            font-size: 32px;
            text-align: center;
            margin-bottom: 3px;
            font-weight: normal;
            letter-spacing: 2px;
            line-height: 1.1;
        }
        .job-title {
            text-align: center;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #666;
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 2px solid #333;
        }
        h2 {
            font-size: 14px;
            font-weight: bold;
            text-transform: uppercase;
            color: #2c7a7b;
            margin-top: 10px;
            margin-bottom: 8px;
            letter-spacing: 1px;
        }
        h3 {
            font-size: 17px;
            font-weight: bold;
            margin-bottom: 6px;
            line-height: 1.3;
        }
        .contact-info {
            text-align: center;
            margin-bottom: 35px;
            font-size: 14px;
            color: #666;
            line-height: 1.6;
        }
        .contact-info span {
            margin: 0 18px;
        }
        .section {
            margin-bottom: 30px;
        }
        .summary {
            font-style: italic;
            font-size: 15px;
            line-height: 1.9;
            text-align: justify;
            margin-bottom: 35px;
            padding: 0 25px;
        }
        .experience-item, .education-item {
            margin-bottom: 25px;
        }
        .item-header {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            margin-bottom: 10px;
        }
        .item-title {
            font-weight: bold;
            font-size: 16px;
            line-height: 1.3;
        }
        .item-subtitle {
            font-style: italic;
            color: #666;
            font-size: 14px;
            line-height: 1.4;
        }
        .date-range {
            font-size: 14px;
            color: #999;
        }
        .description {
            font-size: 14px;
            line-height: 1.7;
        }
        .description ul {
            margin-left: 28px;
            margin-top: 10px;
        }
        .description li {
            margin-bottom: 8px;
            font-size: 14px;
            line-height: 1.6;
        }
        .description p {
            margin-bottom: 10px;
            line-height: 1.7;
        }
        .skills-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
        }
        .skills-list {
            list-style: none;
        }
        .skills-list li {
            margin-bottom: 8px;
            padding-left: 18px;
            position: relative;
            font-size: 14px;
            line-height: 1.5;
        }
        .skills-list li:before {
            content: "•";
            position: absolute;
            left: 0;
            color: #2c7a7b;
            font-size: 16px;
        }
        @media print {
            body {
                padding: 0;
            }
        }
    </style>
</head>
<body>
    <div class="cv-container">
        ${cvData.content || ''}
    </div>
</body>
</html>`;
};

/**
 * Template 3: Professional Classic (Connor Hamilton style)
 * Classic and professional design
 */
const professionalClassicTemplate = (cvData) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CV - Professional Classic</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.4;
            color: #333;
            background: #fff;
            padding: 20px;
        }
        .cv-container {
            max-width: 800px;
            margin: 0 auto;
            background: #fff;
            height: 257mm;
            overflow: hidden;
        }
        h1 {
            font-size: 26px;
            text-align: center;
            margin-bottom: 2px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 4px;
        }
        .job-title {
            text-align: center;
            font-size: 13px;
            margin-bottom: 12px;
            letter-spacing: 1px;
        }
        .contact-info {
            text-align: center;
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 2px solid #333;
            font-size: 11px;
        }
        .contact-info span {
            margin: 0 8px;
        }
        h2 {
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
            margin-top: 10px;
            margin-bottom: 8px;
            letter-spacing: 1px;
            border-bottom: 2px solid #333;
            padding-bottom: 5px;
        }
        h3 {
            font-size: 13px;
            font-weight: bold;
            margin-bottom: 3px;
        }
        .section {
            margin-bottom: 10px;
        }
        .two-column {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }
        .profile {
            font-size: 12px;
            line-height: 1.5;
            text-align: justify;
            margin-bottom: 25px;
        }
        .experience-item {
            margin-bottom: 20px;
        }
        .item-header {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            margin-bottom: 5px;
        }
        .company-name {
            font-weight: bold;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .job-position {
            font-size: 13px;
            color: #666;
            margin-bottom: 8px;
        }
        .date-range {
            font-size: 11px;
            color: #999;
            font-style: italic;
        }
        .description ul {
            margin-left: 20px;
            margin-top: 8px;
        }
        .description li {
            margin-bottom: 5px;
            font-size: 13px;
        }
        .skills-list {
            list-style: none;
            columns: 2;
            column-gap: 20px;
        }
        .skills-list li {
            margin-bottom: 8px;
            padding-left: 15px;
            position: relative;
            font-size: 13px;
            break-inside: avoid;
        }
        .skills-list li:before {
            content: "•";
            position: absolute;
            left: 0;
        }
        @media print {
            body {
                padding: 0;
            }
        }
    </style>
</head>
<body>
    <div class="cv-container">
        ${cvData.content || ''}
    </div>
</body>
</html>`;
};

/**
 * Template 4: Creative Modern (Olivia Wilson style)
 * Creative design with initials watermark
 */
const creativeModernTemplate = (cvData) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CV - Creative Modern</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.4;
            color: #333;
            background: #fff;
            padding: 20px;
        }
        .cv-container {
            max-width: 800px;
            margin: 0 auto;
            background: #fff;
            position: relative;
            height: 257mm;
            overflow: hidden;
        }
        .watermark {
            position: absolute;
            top: 30px;
            right: 30px;
            font-size: 100px;
            color: rgba(230, 230, 230, 0.3);
            font-weight: bold;
            font-style: italic;
            z-index: 0;
            pointer-events: none;
        }
        .content-wrapper {
            position: relative;
            z-index: 1;
        }
        h1 {
            font-size: 28px;
            text-align: center;
            margin-bottom: 2px;
            font-weight: 300;
            text-transform: uppercase;
            letter-spacing: 3px;
        }
        .job-title {
            text-align: center;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #666;
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 1px solid #ddd;
        }
        .layout {
            display: grid;
            grid-template-columns: 1fr 2fr;
            gap: 20px;
            margin-top: 12px;
        }
        h2 {
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
            margin-bottom: 8px;
            margin-top: 8px;
            letter-spacing: 1px;
            color: #555;
        }
        h3 {
            font-size: 13px;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .section {
            margin-bottom: 25px;
        }
        .contact-item {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            font-size: 11px;
        }
        .contact-icon {
            width: 18px;
            margin-right: 8px;
            font-weight: bold;
        }
        .profile-summary {
            font-size: 13px;
            line-height: 1.7;
            text-align: justify;
            margin-bottom: 25px;
            padding: 15px;
            background: #f9f9f9;
            border-left: 3px solid #666;
        }
        .experience-item {
            margin-bottom: 20px;
        }
        .item-header {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            margin-bottom: 5px;
        }
        .company-name {
            font-weight: bold;
            font-size: 14px;
        }
        .job-position {
            font-size: 13px;
            color: #666;
            margin-bottom: 8px;
        }
        .date-range {
            font-size: 11px;
            color: #999;
            font-weight: bold;
        }
        .description ul {
            margin-left: 20px;
            margin-top: 8px;
        }
        .description li {
            margin-bottom: 5px;
            font-size: 12px;
        }
        .skills-list {
            list-style: none;
        }
        .skills-list li {
            margin-bottom: 8px;
            padding-left: 15px;
            position: relative;
            font-size: 12px;
        }
        .skills-list li:before {
            content: "•";
            position: absolute;
            left: 0;
        }
        .education-year {
            font-size: 12px;
            color: #999;
            margin-bottom: 3px;
        }
        .education-degree {
            font-weight: bold;
            font-size: 13px;
            margin-bottom: 3px;
        }
        .education-school {
            font-size: 12px;
            color: #666;
        }
        @media print {
            body {
                padding: 0;
            }
        }
    </style>
</head>
<body>
    <div class="cv-container">
        <div class="watermark">${cvData.initials || 'CV'}</div>
        <div class="content-wrapper">
            ${cvData.content || ''}
        </div>
    </div>
</body>
</html>`;
};

/**
 * List of available templates with their metadata
 */
const templates = {
  'modern-professional': {
    id: 'modern-professional',
    name: 'Modern Professional',
    description: 'Modern design with sidebar and vertical timeline',
    thumbnail: '/templates/modern-professional.png',
    generator: modernProfessionalTemplate,
    features: ['Tech', 'Engineering', 'Marketing', 'Project Management']
  },
  'clean-minimal': {
    id: 'clean-minimal',
    name: 'Clean Minimal',
    description: 'Clean and centered academic-style design',
    thumbnail: '/templates/clean-minimal.png',
    generator: cleanMinimalTemplate,
    features: ['Academia', 'Research', 'Education', 'Publishing', 'Law']
  },
  'professional-classic': {
    id: 'professional-classic',
    name: 'Professional Classic',
    description: 'Classic and professional design',
    thumbnail: '/templates/professional-classic.png',
    generator: professionalClassicTemplate,
    features: ['Finance', 'Banking', 'Consulting', 'Corporate', 'HR']
  },
  'creative-modern': {
    id: 'creative-modern',
    name: 'Creative Modern',
    description: 'Creative design with initials watermark',
    thumbnail: '/templates/creative-modern.png',
    generator: creativeModernTemplate,
    features: ['Design', 'Marketing', 'Media', 'Advertising']
  }
};

/**
 * Get list of available templates
 */
exports.getAvailableTemplates = () => {
  return Object.values(templates).map(template => ({
    id: template.id,
    name: template.name,
    description: template.description,
    thumbnail: template.thumbnail,
    features: template.features
  }));
};

/**
 * Get a specific template
 */
exports.getTemplate = (templateId) => {
  return templates[templateId] || templates['modern-professional'];
};

/**
 * Generate CV HTML with a specific template
 */
exports.generateWithTemplate = (templateId, cvData) => {
  const template = templates[templateId] || templates['modern-professional'];
  return template.generator(cvData);
};

module.exports = {
  getAvailableTemplates: exports.getAvailableTemplates,
  getTemplate: exports.getTemplate,
  generateWithTemplate: exports.generateWithTemplate,
  templates
};

