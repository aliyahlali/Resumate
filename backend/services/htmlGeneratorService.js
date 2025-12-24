const { parseCVText } = require('./cvParser');
const { generateWithTemplate } = require('./cvTemplates');

/**
 * Limit text to a single paragraph (max 2 sentences)
 */
function limitSummaryToParagraph(text, maxChars = 300) {
  if (!text) return '';
  
  // Split by sentences
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  
  let summary = '';
  for (const sentence of sentences) {
    if ((summary + sentence).length > maxChars) {
      break;
    }
    summary += sentence;
  }
  
  return summary.trim() || text.substring(0, maxChars);
}

/**
 * Generate a CV in HTML format from optimized text
 * @param {string} cvText - Optimized CV text
 * @param {string} templateId - ID of the template to use 
 * @returns {string} - CV HTML
 */
exports.generateCVHTML = (cvText, templateId = 'modern-professional') => {
  // Parse text to extract structured data
  const cvData = parseCVText(cvText);
  
  // Limit the profile/summary to 1 paragraph
  if (cvData && cvData.profile) {
    cvData.profile = limitSummaryToParagraph(cvData.profile);
  }
  
  // If parsing was successful, use the selected template
  if (cvData && cvData.name) {
    return generateCVWithTemplate(cvData, templateId);
  }
  
  // Otherwise, use the simple generation (fallback)
  return generateSimpleHTML(cvText);
};

/**
 * Generate a CV in HTML format directly from structured data
 * @param {object} cvData - Structured CV data
 * @param {string} templateId - ID of the template to use (optional)
 * @returns {string} - CV HTML
 */
exports.generateCVHTMLFromData = (cvData, templateId = 'modern-professional') => {
  if (!cvData || !cvData.name) {
    throw new Error('CV data must contain at least a name');
  }
  
  // Limit the profile/summary to 1 paragraph
  if (cvData.profile) {
    cvData.profile = limitSummaryToParagraph(cvData.profile);
  }
  
  return generateCVWithTemplate(cvData, templateId);
};

/**
 * Generate HTML with a specific template
 */
function generateCVWithTemplate(cvData, templateId) {
  // Prepare data depending on template
  let templateData;
  
  if (templateId === 'modern-professional') {
    templateData = prepareModernProfessionalData(cvData);
  } else if (templateId === 'clean-minimal') {
    templateData = prepareCleanMinimalData(cvData);
  } else if (templateId === 'professional-classic') {
    templateData = prepareProfessionalClassicData(cvData);
  } else if (templateId === 'creative-modern') {
    templateData = prepareCreativeModernData(cvData);
  } else {
    templateData = prepareModernProfessionalData(cvData);
  }
  
  return generateWithTemplate(templateId, templateData);
}

/**
 * Prepare data for the Modern Professional template
 */
function prepareModernProfessionalData(cvData) {
  const sidebar = `
    <h1>${cvData.name}</h1>
    <div class="job-title">${cvData.jobTitle}</div>
    
    <div class="section">
      <h2>CONTACT</h2>
      ${cvData.contact.phone ? `<div class="contact-item"><span class="contact-icon">P</span> ${cvData.contact.phone}</div>` : ''}
      ${cvData.contact.email ? `<div class="contact-item"><span class="contact-icon">E</span> ${cvData.contact.email}</div>` : ''}
      ${cvData.contact.address ? `<div class="contact-item"><span class="contact-icon">A</span> ${cvData.contact.address}</div>` : ''}
    </div>
    
    ${cvData.skills.length > 0 ? `
    <div class="section">
      <h2>SKILLS</h2>
      <ul class="skills-list">
        ${cvData.skills.map(skill => `<li>${skill}</li>`).join('')}
      </ul>
    </div>
    ` : ''}
    
    ${cvData.languages.length > 0 ? `
    <div class="section">
      <h2>LANGUAGES</h2>
      <ul class="skills-list">
        ${cvData.languages.map(lang => `<li>${lang}</li>`).join('')}
      </ul>
    </div>
    ` : ''}
    
    ${cvData.references.length > 0 ? `
    <div class="section">
      <h2>REFERENCE</h2>
      ${cvData.references.map(ref => `
        <div style="margin-bottom: 15px;">
          <strong>${ref.name}</strong><br>
          <small>${ref.title}</small><br>
          <small>Phone: ${ref.phone}</small><br>
          <small>Email: ${ref.email}</small>
        </div>
      `).join('')}
    </div>
    ` : ''}
  `;
  
  const mainContent = `
    ${cvData.experience.length > 0 ? `
    <div class="section">
      <h2>PROFESSIONAL EXPERIENCE</h2>
      ${cvData.experience.map((exp, index) => `
        <div class="experience-item">
          <div class="timeline-dot" style="top: ${index * 140}px;"></div>
          <div class="company-name">${exp.position}</div>
          <div class="job-position">${exp.company} <span class="date-range">${exp.period}</span></div>
          <div class="description">
            ${formatDescription(exp.description)}
          </div>
        </div>
      `).join('')}
    </div>
    ` : ''}
    
    ${cvData.projects && cvData.projects.length > 0 ? `
    <div class="section">
      <h2>KEY PROJECTS</h2>
      ${cvData.projects.map(project => `
        <div class="experience-item">
          <div class="company-name">${project.name}</div>
          <div class="job-position">${project.period || ''}</div>
          <div class="description">
            ${formatDescription(project.description)}
          </div>
        </div>
      `).join('')}
    </div>
    ` : ''}
    
    ${cvData.education.length > 0 ? `
    <div class="section">
      <h2>EDUCATION</h2>
      ${cvData.education.map(edu => `
        <div class="experience-item">
          <div class="company-name">${edu.degree}</div>
          <div class="job-position">${edu.institution} <span class="date-range">${edu.period}</span></div>
        </div>
      `).join('')}
    </div>
    ` : ''}
  `;
  
  return { sidebar, mainContent };
}

/**
 * Prepare data for the Clean Minimal template
 */
function prepareCleanMinimalData(cvData) {
  const content = `
    <h1>${cvData.name}</h1>
    <div class="job-title">${cvData.jobTitle}</div>
    
    <div class="contact-info">
      ${cvData.contact.phone ? `<span>${cvData.contact.phone}</span>` : ''}
      ${cvData.contact.email ? `<span>${cvData.contact.email}</span>` : ''}
      ${cvData.contact.address ? `<span>${cvData.contact.address}</span>` : ''}
    </div>
    
    ${cvData.experience.length > 0 ? `
    <div class="section">
      <h2>PROFESSIONAL EXPERIENCE</h2>
      ${cvData.experience.map(exp => `
        <div class="experience-item">
          <div class="item-header">
            <div>
              <div class="item-title">${exp.position}</div>
              <div class="item-subtitle">${exp.company}</div>
            </div>
            <div class="date-range">${exp.period}</div>
          </div>
          <div class="description">
            ${formatDescription(exp.description)}
          </div>
        </div>
      `).join('')}
    </div>
    ` : ''}
    
    ${cvData.projects && cvData.projects.length > 0 ? `
    <div class="section">
      <h2>PROJECTS</h2>
      ${cvData.projects.map(project => `
        <div class="experience-item">
          <div class="item-header">
            <div>
              <div class="item-title">${project.name}</div>
            </div>
            <div class="date-range">${project.period || ''}</div>
          </div>
          <div class="description">
            ${formatDescription(project.description)}
          </div>
        </div>
      `).join('')}
    </div>
    ` : ''}
    
    ${cvData.education.length > 0 ? `
    <div class="section">
      <h2>EDUCATION</h2>
      ${cvData.education.map(edu => `
        <div class="education-item">
          <div class="item-header">
            <div>
              <div class="item-title">${edu.degree}</div>
              <div class="item-subtitle">${edu.institution}</div>
            </div>
            <div class="date-range">${edu.period}</div>
          </div>
        </div>
      `).join('')}
    </div>
    ` : ''}
    
    ${cvData.skills.length > 0 ? `
    <div class="section">
      <h2>SKILLS</h2>
      <div class="skills-grid">
        <ul class="skills-list">
          ${cvData.skills.slice(0, Math.ceil(cvData.skills.length / 2)).map(skill => `<li>${skill}</li>`).join('')}
        </ul>
        <ul class="skills-list">
          ${cvData.skills.slice(Math.ceil(cvData.skills.length / 2)).map(skill => `<li>${skill}</li>`).join('')}
        </ul>
      </div>
    </div>
    ` : ''}
  `;
  
  return { content };
}

/**
 * Prepare data for the Professional Classic template
 */
function prepareProfessionalClassicData(cvData) {
  const content = `
    <h1>${cvData.name}</h1>
    <div class="job-title">${cvData.jobTitle}</div>
    
    <div class="contact-info">
      ${cvData.contact.phone ? `<span>${cvData.contact.phone}</span>` : ''}
      ${cvData.contact.email ? `<span>${cvData.contact.email}</span>` : ''}
    </div>
    
    ${cvData.profile ? `
    <div class="section">
      <h2>PROFILE</h2>
      <div class="profile">${cvData.profile}</div>
    </div>
    ` : ''}
    
    ${cvData.experience.length > 0 ? `
    <div class="section">
      <h2>WORK EXPERIENCE</h2>
      ${cvData.experience.map(exp => `
        <div class="experience-item">
          <div class="item-header">
            <div class="company-name">${exp.company}</div>
            <div class="date-range">${exp.period}</div>
          </div>
          <div class="job-position">${exp.position}</div>
          <div class="description">
            ${formatDescription(exp.description)}
          </div>
        </div>
      `).join('')}
    </div>
    ` : ''}
    
    <div class="two-column">
      ${cvData.education.length > 0 ? `
      <div class="section">
        <h2>EDUCATION</h2>
        ${cvData.education.map(edu => `
          <div style="margin-bottom: 15px;">
            <div style="font-weight: bold; font-size: 13px;">${edu.institution}</div>
            <div style="font-size: 12px;">${edu.degree}</div>
            <div style="font-size: 11px; color: #999;">${edu.period}</div>
          </div>
        `).join('')}
      </div>
      ` : ''}
      
      ${cvData.skills.length > 0 ? `
      <div class="section">
        <h2>SKILLS</h2>
        <ul class="skills-list">
          ${cvData.skills.map(skill => `<li>${skill}</li>`).join('')}
        </ul>
      </div>
      ` : ''}
    </div>
    
    ${cvData.certifications.length > 0 ? `
    <div class="section">
      <h2>CERTIFICATIONS</h2>
      <ul class="skills-list">
        ${cvData.certifications.map(cert => `<li>${cert}</li>`).join('')}
      </ul>
    </div>
    ` : ''}
  `;
  
  return { content };
}

/**
 * Prepare data for the Creative Modern template
 */
function prepareCreativeModernData(cvData) {
  // Extract initials
  const nameParts = cvData.name.split(' ');
  const initials = nameParts.map(part => part[0]).join('');
  
  const content = `
    <h1>${cvData.name}</h1>
    <div class="job-title">${cvData.jobTitle}</div>
    
    <div class="layout">
      <div class="left-column">
        <div class="section">
          <h2>CONTACT</h2>
          ${cvData.contact.phone ? `<div class="contact-item"><span class="contact-icon">P</span> ${cvData.contact.phone}</div>` : ''}
          ${cvData.contact.email ? `<div class="contact-item"><span class="contact-icon">E</span> ${cvData.contact.email}</div>` : ''}
          ${cvData.contact.address ? `<div class="contact-item"><span class="contact-icon">A</span> ${cvData.contact.address}</div>` : ''}
        </div>
        
        ${cvData.education.length > 0 ? `
        <div class="section">
          <h2>EDUCATION</h2>
          ${cvData.education.map(edu => `
            <div style="margin-bottom: 15px;">
              <div class="education-year">${edu.period}</div>
              <div class="education-degree">${edu.degree}</div>
              <div class="education-school">${edu.institution}</div>
            </div>
          `).join('')}
        </div>
        ` : ''}
        
        ${cvData.skills.length > 0 ? `
        <div class="section">
          <h2>SKILLS</h2>
          <ul class="skills-list">
            ${cvData.skills.map(skill => `<li>${skill}</li>`).join('')}
          </ul>
        </div>
        ` : ''}
        
        ${cvData.languages.length > 0 ? `
        <div class="section">
          <h2>LANGUAGES</h2>
          <ul class="skills-list">
            ${cvData.languages.map(lang => `<li>${lang}</li>`).join('')}
          </ul>
        </div>
        ` : ''}
      </div>
      
      <div class="right-column">
        ${cvData.experience.length > 0 ? `
        <div class="section">
          <h2>WORK EXPERIENCE</h2>
          ${cvData.experience.map(exp => `
            <div class="experience-item">
              <div class="item-header">
                <div class="company-name">${exp.company}</div>
                <div class="date-range">${exp.period}</div>
              </div>
              <div class="job-position">${exp.position}</div>
              <div class="description">
                ${formatDescription(exp.description)}
              </div>
            </div>
          `).join('')}
        </div>
        ` : ''}
      </div>
    </div>
  `;
  
  return { content, initials };
}

/**
 * Format description (convert lists, etc.)
 */
function formatDescription(description) {
  if (!description) return '';
  
  const lines = description.split('\n').filter(line => line.trim());
  
  // If it is a list (starts with •, -, * or contains multiple bullet lines)
  const bulletLines = lines.filter(line => {
    const trimmed = line.trim();
    return trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*');
  });
  
  if (bulletLines.length > 0) {
    // Construire la liste HTML
    const listItems = lines.map(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*')) {
        const cleaned = trimmed.replace(/^[•\-*]\s*/, '').trim();
        return cleaned ? `<li>${cleaned}</li>` : '';
      } else if (trimmed.length > 0) {
        // Ligne sans puce mais fait partie de la description
        return `<li>${trimmed}</li>`;
      }
      return '';
    }).filter(line => line).join('');
    
    return `<ul>${listItems}</ul>`;
  }
  
  // Otherwise, single or multiple paragraphs
  if (lines.length === 1) {
    return `<p>${lines[0]}</p>`;
  } else {
    return lines.map(line => `<p>${line}</p>`).join('');
  }
}

/**
 * Simple generation (fallback)
 */
function generateSimpleHTML(cvText) {
  // Convert CV text to formatted HTML
  // Assumes the CV is structured with sections separated by line breaks

  const lines = cvText.split('\n').filter((line) => line.trim() !== '');
  let html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Optimized CV</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            background: #fff;
            padding: 40px;
        }
        .cv-container {
            max-width: 800px;
            margin: 0 auto;
            background: #fff;
            padding: 40px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        h1 {
            font-size: 32px;
            margin-bottom: 10px;
            color: #2c3e50;
            border-bottom: 3px solid #3498db;
            padding-bottom: 10px;
        }
        h2 {
            font-size: 24px;
            margin-top: 30px;
            margin-bottom: 15px;
            color: #34495e;
            border-bottom: 2px solid #ecf0f1;
            padding-bottom: 5px;
        }
        h3 {
            font-size: 18px;
            margin-top: 20px;
            margin-bottom: 10px;
            color: #2c3e50;
        }
        .section {
            margin-bottom: 25px;
        }
        p {
            margin-bottom: 10px;
            text-align: justify;
        }
        ul {
            margin-left: 20px;
            margin-bottom: 15px;
        }
        li {
            margin-bottom: 8px;
        }
        .contact-info {
            margin-bottom: 20px;
            font-size: 14px;
            color: #7f8c8d;
        }
        .contact-info p {
            margin-bottom: 5px;
        }
        .experience-item, .education-item {
            margin-bottom: 20px;
        }
        .date {
            color: #7f8c8d;
            font-style: italic;
        }
        @media print {
            body {
                padding: 0;
            }
            .cv-container {
                box-shadow: none;
            }
        }
    </style>
</head>
<body>
    <div class="cv-container">
`;

  let currentSection = '';
  let inList = false;

  lines.forEach((line) => {
    const trimmedLine = line.trim();

    // Detect main titles (H1)
    if (
      trimmedLine.length < 50 &&
      (trimmedLine.toUpperCase() === trimmedLine ||
        /^[A-Z][a-z]+(\s+[A-Z][a-z]+)*$/.test(trimmedLine))
    ) {
      // Check if it is a section title
      const sectionKeywords = [
        'EXPERIENCE',
        'EDUCATION',
        'COMPETENCIES',
        'SKILLS',
        'CONTACT',
        'PROFILE',
        'LANGUAGES',
      ];

      const isSectionHeader = sectionKeywords.some((keyword) =>
        trimmedLine.toUpperCase().includes(keyword)
      );

      if (isSectionHeader) {
        if (inList) {
          html += '</ul>';
          inList = false;
        }
        html += `<h2>${trimmedLine}</h2>`;
        currentSection = trimmedLine;
      } else if (!currentSection || currentSection === '') {
        // First title = candidate name
        html += `<h1>${trimmedLine}</h1>`;
      } else {
        // Subtitle H3
        if (inList) {
          html += '</ul>';
          inList = false;
        }
        html += `<h3>${trimmedLine}</h3>`;
      }
    } else if (trimmedLine.startsWith('-') || trimmedLine.startsWith('•')) {
      // Bullet list
      if (!inList) {
        html += '<ul>';
        inList = true;
      }
      const listItem = trimmedLine.replace(/^[-•]\s*/, '');
      html += `<li>${listItem}</li>`;
    } else if (trimmedLine.match(/^\d{4}[-–]\d{4}/) || trimmedLine.match(/^\d{4}/)) {
      // Dates
      html += `<p class="date">${trimmedLine}</p>`;
    } else {
      // Normal paragraph
      if (inList) {
        html += '</ul>';
        inList = false;
      }
      html += `<p>${trimmedLine}</p>`;
    }
  });

  if (inList) {
    html += '</ul>';
  }

  html += `
    </div>
</body>
</html>`;

  return html;
};

