/**
 * CV parser to extract structured data from optimized CV text
 */

/**
 * Parse optimized CV text and extract structured data
 * @param {string} cvText - Optimized CV text
 * @returns {object} - Structured CV data
 */
exports.parseCVText = (cvText) => {
  if (!cvText) return null;

  const lines = cvText.split('\n').filter(line => line.trim());
  
  const cvData = {
    name: '',
    jobTitle: '',
    contact: {
      email: '',
      phone: '',
      address: '',
      website: ''
    },
    profile: '',
    experience: [],
    projects: [],
    education: [],
    skills: [],
    languages: [],
    certifications: [],
    references: []
  };

  // Extract name (usually the first significant line in uppercase or the largest)
  cvData.name = extractName(lines);
  
  // Extract job title
  cvData.jobTitle = extractJobTitle(lines, cvData.name);
  
  // Extract contact information
  cvData.contact = extractContact(cvText);
  
  // Extract the profile/summary
  cvData.profile = extractProfile(cvText);
  
  // Extract professional experience
  cvData.experience = extractExperience(cvText);
  
  // Extract projects
  cvData.projects = extractProjects(cvText);
  
  // Extract education
  cvData.education = extractEducation(cvText);
  
  // Extract skills
  cvData.skills = extractSkills(cvText);
  
  // Extract languages
  cvData.languages = extractLanguages(cvText);
  
  // Extract certifications
  cvData.certifications = extractCertifications(cvText);
  
  // Extract references
  cvData.references = extractReferences(cvText);
  
  return cvData;
};

/**
 * Extract name
 */
function extractName(lines) {
  // The name is usually the first significant line
  for (const line of lines.slice(0, 5)) {
    const trimmed = line.trim();
    // Look for a name (2-4 words, starting with uppercase)
    if (/^[A-Z][a-z]+(\s+[A-Z][a-z]+){1,3}$/.test(trimmed) && trimmed.length < 50) {
      return trimmed;
    }
    // Or all in uppercase
    if (/^[A-Z\s]{5,50}$/.test(trimmed) && !trimmed.includes('EXPERIENCE') && !trimmed.includes('EDUCATION')) {
      return trimmed;
    }
  }
  return lines[0]?.trim() || '';
}

/**
 * Extract job title
 */
function extractJobTitle(lines, name) {
  // Title generally appears after the name
  const nameIndex = lines.findIndex(line => line.includes(name));
  if (nameIndex >= 0 && nameIndex < lines.length - 1) {
    const nextLine = lines[nameIndex + 1].trim();
    // If it looks like a job title (not too long, not an email/phone)
    if (nextLine.length < 60 && !/@/.test(nextLine) && !/\d{3}/.test(nextLine)) {
      return nextLine;
    }
  }
  return '';
}

/**
 * Extract contact information
 */
function extractContact(text) {
  const contact = {
    email: '',
    phone: '',
    address: '',
    website: ''
  };
  
  // Email
  const emailMatch = text.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
  if (emailMatch) contact.email = emailMatch[1];
  
  // Phone
  const phoneMatch = text.match(/(\+?\d{1,4}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,4})/);
  if (phoneMatch) contact.phone = phoneMatch[1];
  
  // Address
  const addressMatch = text.match(/(\d+\s+[A-Za-z\s]+,\s*[A-Za-z\s]+,?\s*[A-Z]{2}\s*\d{5})/i);
  if (addressMatch) contact.address = addressMatch[1];
  
  // Website
  const websiteMatch = text.match(/((?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?)/);
  if (websiteMatch && !websiteMatch[1].includes('@')) contact.website = websiteMatch[1];
  
  return contact;
}

/**
 * Extract profile/summary
 */
function extractProfile(text) {
  const profilePatterns = [
    /(?:PROFIL PROFESSIONNEL|PROFILE PROFESSIONNEL|PROFESSIONAL PROFILE|PROFILE|PROFIL|SUMMARY|RÉSUMÉ|ABOUT|À PROPOS|PROFESSIONAL SUMMARY)[\s:]*\n([\s\S]*?)(?=\n(?:EXPERIENCE|EXPÉRIENCE|EDUCATION|ÉDUCATION|FORMATION|SKILLS|COMPÉTENCES|WORK|PROJETS))/i,
  ];
  
  for (const pattern of profilePatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      // Clean and extract profile
      const profileText = match[1].trim();
      // Take the full paragraph until the next section
      const lines = profileText.split('\n').filter(line => {
        const trimmed = line.trim();
        // Ignore lines that look like section titles
        return trimmed && 
               !trimmed.match(/^[A-Z\s]{10,}$/) && 
               trimmed.length > 20;
      });
      
      if (lines.length > 0) {
        return lines.join(' ').trim();
      }
    }
  }
  
  return '';
}

/**
 * Extract professional experience
 */
function extractExperience(text) {
  const experiences = [];
  
  // Find the experience section with several variations
  const experienceSection = text.match(/(?:WORK EXPERIENCE|EXPERIENCE PROFESSIONNELLE|EXPÉRIENCE PROFESSIONNELLE|PROFESSIONAL EXPERIENCE|EXPERIENCE|EXPÉRIENCE)[\s:]*\n([\s\S]*?)(?=\n(?:PROJETS|PROJECTS|EDUCATION|ÉDUCATION|FORMATION|SKILLS|COMPÉTENCES|LANGUAGES|CERTIFICATIONS|$))/i);
  
  if (!experienceSection) return experiences;
  
  const section = experienceSection[1];
  
  // Improved pattern to detect experience entries
  // Flexible format: Position | Company, Location OR Company - Position
  const lines = section.split('\n');
  let currentExp = null;
  let descriptionLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Detect new experience entry (line with | or date)
    if (line.match(/\|/) || line.match(/\d{4}\s*[-–]\s*(?:\d{4}|Present|Présent|Actuel|Current)/i)) {
      // Save previous experience
      if (currentExp) {
        currentExp.description = descriptionLines.join('\n').trim();
        experiences.push(currentExp);
        descriptionLines = [];
      }
      
      // Parse new entry
      const parts = line.split('|');
      if (parts.length >= 2) {
        // Format: Position | Company, Location
        const position = parts[0].trim();
        const companyLocation = parts[1].trim();
        const companyMatch = companyLocation.match(/([^,]+)(?:,\s*(.+))?/);
        const company = companyMatch ? companyMatch[1].trim() : companyLocation;
        
        // Look for the date on the next line
        let period = '';
        if (i + 1 < lines.length) {
          const nextLine = lines[i + 1].trim();
          const dateMatch = nextLine.match(/(\d{4}\s*[-–]\s*(?:\d{4}|Present|Présent|Actuel|Current))/i);
          if (dateMatch) {
            period = dateMatch[1];
            i++; // Skip the date line
          }
        }
        
        currentExp = { position, company, period };
      }
    } else if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
      // Description line
      descriptionLines.push(line);
    } else if (line.length > 0 && currentExp) {
      // Other description line
      descriptionLines.push(line);
    }
  }
  
  // Save last experience
  if (currentExp) {
    currentExp.description = descriptionLines.join('\n').trim();
    experiences.push(currentExp);
  }
  
  return experiences;
}

/**
 * Extract projects
 */
function extractProjects(text) {
  const projects = [];
  
  // Find projects section
  const projectsSection = text.match(/(?:PROJETS CLÉS|PROJETS|PROJECTS|RÉALISATIONS)[\s:]*\n([\s\S]*?)(?=\n(?:FORMATION|EDUCATION|ÉDUCATION|SKILLS|COMPÉTENCES|LANGUAGES|CERTIFICATIONS|$))/i);
  
  if (!projectsSection) return projects;
  
  const section = projectsSection[1];
  const lines = section.split('\n');
  let currentProject = null;
  let descriptionLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Detect new project (no bullet, short line, no ":")
    if (line.length > 0 && line.length < 80 && !line.startsWith('•') && !line.startsWith('-') && !line.startsWith('*')) {
      // Check if this is a project title (not description)
      const hasDate = line.match(/\d{4}/);
      const hasBullet = line.startsWith('•') || line.startsWith('-');
      
      if (!hasBullet && (hasDate || i === 0 || lines[i-1].trim() === '')) {
        // Save previous project
        if (currentProject) {
          currentProject.description = descriptionLines.join('\n').trim();
          projects.push(currentProject);
          descriptionLines = [];
        }
        
        // Parse new project
        const dateMatch = line.match(/\|\s*(\d{4}\s*[-–]\s*(?:\d{4}|Present|Présent))/i);
        const name = dateMatch ? line.split('|')[0].trim() : line;
        const period = dateMatch ? dateMatch[1] : '';
        
        currentProject = { name, period };
        continue;
      }
    }
    
    // Ligne de description
    if (line.length > 0 && currentProject) {
      descriptionLines.push(line);
    }
  }
  
  // Save last project
  if (currentProject) {
    currentProject.description = descriptionLines.join('\n').trim();
    projects.push(currentProject);
  }
  
  return projects;
}

/**
 * Extract education
 */
function extractEducation(text) {
  const education = [];
  
  // Find education section
  const educationSection = text.match(/(?:EDUCATION|ÉDUCATION|ACADEMIC|FORMATION)[\s:]*\n([\s\S]*?)(?=\n(?:SKILLS|COMPÉTENCES|EXPERIENCE|LANGUAGES|CERTIFICATIONS|PROJECTS|$))/i);
  
  if (!educationSection) return education;
  
  const section = educationSection[1];
  
  // Pattern to detect education entries
  const entryPattern = /([A-Z][A-Za-z\s]+(?:University|College|School|Institute|École|Université))\s*\n?\s*([A-Z][A-Za-z\s,]+(?:degree|Degree|Bachelor|Master|PhD|Diploma|Certificate|Licence|Master)?[^\n]*)\s*\n?\s*(\d{4}\s*[-–]\s*\d{4})/gi;
  
  let match;
  while ((match = entryPattern.exec(section)) !== null) {
    education.push({
      institution: match[1].trim(),
      degree: match[2].trim(),
      period: match[3].trim()
    });
  }
  
  return education;
}

/**
 * Extract skills
 */
function extractSkills(text) {
  const skills = [];
  
  // Find skills section with several variations
  const skillsSection = text.match(/(?:COMPÉTENCES TECHNIQUES|TECHNICAL SKILLS|SKILLS|COMPÉTENCES|COMPETENCIES|TECHNOLOGIES)[\s:]*\n([\s\S]*?)(?=\n(?:LANGUAGES|LANGUES|EDUCATION|EXPERIENCE|CERTIFICATIONS|PROJECTS|PROJETS|FORMATION|$))/i);
  
  if (!skillsSection) return skills;
  
  const section = skillsSection[1];
  const lines = section.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && trimmed.length > 2 && trimmed.length < 200) {
      // Enlever les puces et nettoyer
      let skill = trimmed.replace(/^[•\-*]\s*/, '').trim();
      
      // Si la ligne contient ":", garder toute la ligne (ex: "Langages : Python, Java")
      if (skill && !skill.match(/^[A-Z\s]{10,}$/)) {
        skills.push(skill);
      }
    }
  }
  
  return skills;
}

/**
 * Extraire les langues
 */
function extractLanguages(text) {
  const languages = [];
  
  // Find languages section
  const languagesSection = text.match(/(?:LANGUAGES|LANGUES)[\s:]*\n([\s\S]*?)(?=\n(?:SKILLS|COMPÉTENCES|EDUCATION|EXPERIENCE|CERTIFICATIONS|REFERENCE|$))/i);
  
  if (!languagesSection) return languages;
  
  const section = languagesSection[1];
  const lines = section.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && trimmed.length > 2 && trimmed.length < 100) {
      const language = trimmed.replace(/^[•\-*]\s*/, '').trim();
      if (language) languages.push(language);
    }
  }
  
  return languages;
}

/**
 * Extract certifications
 */
function extractCertifications(text) {
  const certifications = [];
  
  // Find certifications section
  const certificationsSection = text.match(/(?:CERTIFICATIONS|CERTIFICATES|LICENCES)[\s:]*\n([\s\S]*?)(?=\n(?:SKILLS|COMPÉTENCES|EDUCATION|EXPERIENCE|LANGUAGES|REFERENCE|$))/i);
  
  if (!certificationsSection) return certifications;
  
  const section = certificationsSection[1];
  const lines = section.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && trimmed.length > 2 && trimmed.length < 150) {
      const cert = trimmed.replace(/^[•\-*]\s*/, '').trim();
      if (cert) certifications.push(cert);
    }
  }
  
  return certifications;
}

/**
 * Extract references
 */
function extractReferences(text) {
  const references = [];
  
  // Find references section
  const referencesSection = text.match(/(?:REFERENCES|RÉFÉRENCE)[\s:]*\n([\s\S]*?)$/i);
  
  if (!referencesSection) return references;
  
  const section = referencesSection[1];
  
  // Pattern to detect references
  const entryPattern = /([A-Z][a-z]+\s+[A-Z][a-z]+)\s*\n?\s*([A-Z][A-Za-z\s,&]+)\s*\n?\s*(?:Phone|Tel|Téléphone)?[\s:]*([+\d\s\-()]+)\s*\n?\s*(?:Email)?[\s:]*([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/gi;
  
  let match;
  while ((match = entryPattern.exec(section)) !== null) {
    references.push({
      name: match[1].trim(),
      title: match[2].trim(),
      phone: match[3].trim(),
      email: match[4].trim()
    });
  }
  
  return references;
}

module.exports = {
  parseCVText: exports.parseCVText
};

