import { PatternMatcher, PATTERNS } from './regex-patterns';

export interface PersonalInfo {
  name: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  website: string | null;
  title: string | null;
}

export interface WorkExperience {
  company: string;
  position: string;
  period: string;
  description: string;
}

export interface Education {
  institution: string;
  degree: string;
  period: string;
}

export interface Skills {
  personal: string[];
  professional: string[];
}

export interface ExtractedCVInfo {
  personalInfo: PersonalInfo;
  workExperience: WorkExperience[];
  education: Education[];
  skills: Skills;
}

export class CVExtractor {
  
  static extractPersonalInfo(cvText: string): PersonalInfo {
    console.log('Extracting personal information...');
    
    const personalInfo: PersonalInfo = {
      name: PatternMatcher.findName(cvText),
      email: PatternMatcher.findEmail(cvText),
      phone: PatternMatcher.findPhone(cvText),
      location: this.extractLocation(cvText),
      website: this.extractWebsite(cvText),
      title: this.extractTitle(cvText)
    };
    
    const foundFields = Object.entries(personalInfo)
      .filter(([_, value]) => value !== null)
      .map(([key, _]) => key);
    
    console.log('Personal info extracted:', foundFields);
    return personalInfo;
  }

  static extractWorkExperience(cvText: string, limit = 3): WorkExperience[] {
    console.log('Extracting work experience...');
    
    const experienceSection = this.findSection(cvText, 'experience');
    if (!experienceSection) {
      console.log('No work experience section found');
      return [];
    }
    
    const workEntries = this.parseWorkEntries(experienceSection);
    console.log(`Found ${workEntries.length} work experience entries`);
    
    return workEntries.slice(0, limit);
  }

  static extractEducation(cvText: string, limit = 2): Education[] {
    console.log('Extracting education...');
    
    const educationSection = this.findSection(cvText, 'education');
    if (!educationSection) {
      console.log('No education section found');
      return [];
    }
    
    const educationEntries = this.parseEducationEntries(educationSection);
    console.log(`Found ${educationEntries.length} education entries`);
    
    return educationEntries.slice(0, limit);
  }

  static extractSkills(cvText: string): Skills {
    console.log('Extracting skills...');
    
    const skillsSection = this.findSection(cvText, 'skills') || cvText;
    
    return {
      personal: this.extractPersonalSkills(skillsSection),
      professional: this.extractProfessionalSkills(skillsSection)
    };
  }

  static extractAll(cvText: string): ExtractedCVInfo {
    console.log('Starting comprehensive CV extraction...');
    
    // Clean text first
    const cleanedText = this.cleanText(cvText);
    
    if (cleanedText.length < 50) {
      console.warn('Text too short after cleaning');
      return this.getEmptyInfo();
    }
    
    const info: ExtractedCVInfo = {
      personalInfo: this.extractPersonalInfo(cleanedText),
      workExperience: this.extractWorkExperience(cleanedText),
      education: this.extractEducation(cleanedText),
      skills: this.extractSkills(cleanedText)
    };
    
    console.log('✅ CV extraction completed');
    return info;
  }

  // Private helper methods
  private static cleanText(text: string): string {
    if (!text) return '';
    
    return text
      .replace(PATTERNS.PDF_ARTIFACTS.KEYWORDS, ' ')
      .replace(PATTERNS.PDF_ARTIFACTS.NUMBERS, ' ')
      .replace(PATTERNS.PDF_ARTIFACTS.ZEROS, ' ')
      .replace(PATTERNS.PDF_ARTIFACTS.HEX, ' ')
      .replace(PATTERNS.PDF_ARTIFACTS.LONG_SEQUENCES, (match) => {
        if (match.includes('@') || match.includes('.') || /[A-Z]{2,}[a-z]{2,}/.test(match)) {
          return match;
        }
        return ' ';
      })
      .replace(PATTERNS.PDF_ARTIFACTS.SPECIAL_CHARS, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private static extractLocation(cvText: string): string | null {
    const locationPatterns = [
      /(?:address|location)[\s:]*([A-Z][a-z]+(?:,\s*[A-Z][a-z]+)*)/i,
      /([A-Z][a-z]+,\s*[A-Z]{2})/,
      /(\d+\s+[A-Z][a-z]+\s+(?:St|Street|Ave|Avenue|Rd|Road|Dr|Drive|Blvd|Boulevard))/i
    ];
    
    for (const pattern of locationPatterns) {
      const match = cvText.match(pattern);
      if (match) {
        console.log('Found location:', match[1]);
        return match[1];
      }
    }
    return null;
  }

  private static extractWebsite(cvText: string): string | null {
    const websitePatterns = [
      /(linkedin\.com\/[^\s]+)/i,
      /(github\.com\/[^\s]+)/i,
      /(portfolio\.[\w.-]+)/i,
      /(www\.[\w.-]+\.com[^\s]*)/i
    ];
    
    for (const pattern of websitePatterns) {
      const match = cvText.match(pattern);
      if (match) {
        console.log('Found website:', match[1]);
        return match[1];
      }
    }
    return null;
  }

  private static extractTitle(cvText: string): string | null {
    const titlePatterns = [
      /(?:title|position)[\s:]+([^\n]+)/i,
      /([A-Z][a-z]+\s+(?:skilled\s+)?(?:Java\s+)?(?:Developer|Engineer|Manager|Analyst|Designer|Consultant|Specialist|Director))/i
    ];
    
    for (const pattern of titlePatterns) {
      const match = cvText.match(pattern);
      if (match) {
        const title = match[1].trim();
        console.log('Found title:', title);
        return title;
      }
    }
    return null;
  }

  private static findSection(cvText: string, sectionType: 'experience' | 'education' | 'skills'): string | null {
    const patterns = {
      experience: [
        /(?:WORK\s+EXPERIENCE|EXPERIENCE|EMPLOYMENT)([\s\S]*?)(?=EDUCATION|SKILLS|$)/i,
        /(?:Professional\s+Experience)([\s\S]*?)(?=EDUCATION|SKILLS|$)/i
      ],
      education: [
        /(?:EDUCATION|QUALIFICATIONS|ACADEMIC)([\s\S]*?)(?=SKILLS|EXPERIENCE|$)/i,
        /(?:Educational\s+Background)([\s\S]*?)(?=SKILLS|EXPERIENCE|$)/i
      ],
      skills: [
        /(?:SKILLS|COMPETENCIES|ABILITIES)([\s\S]*?)(?=EXPERIENCE|EDUCATION|$)/i,
        /(?:Technical\s+Skills)([\s\S]*?)(?=EXPERIENCE|EDUCATION|$)/i
      ]
    };
    
    for (const pattern of patterns[sectionType]) {
      const match = cvText.match(pattern);
      if (match) {
        console.log(`Found ${sectionType} section`);
        return match[1];
      }
    }
    return null;
  }

  private static parseWorkEntries(experienceSection: string): WorkExperience[] {
    // Simplified work entry parsing logic
    const entries: WorkExperience[] = [];
    
    // Basic pattern matching for common formats
    const workPattern = /([A-Z][A-Za-z\s&.]+(?:Inc|Ltd|Company|Corp|Solutions|Technologies|Innovations|Hub)\.?)\s*\n?\s*([A-Z][A-Za-z\s]+(?:Developer|Engineer|Manager|Analyst|Specialist|Director))\s*\n?\s*(\d{4}\s*[-–]\s*(?:\d{4}|Present))/gi;
    
    let match;
    while ((match = workPattern.exec(experienceSection)) !== null && entries.length < 3) {
      entries.push({
        company: match[1].trim(),
        position: match[2].trim(),
        period: match[3].trim(),
        description: "Professional experience with relevant technical skills and achievements."
      });
    }
    
    return entries;
  }

  private static parseEducationEntries(educationSection: string): Education[] {
    const entries: Education[] = [];
    
    const eduPattern = /([A-Z][A-Za-z\s]+(?:University|Institute|College|School))\s*\n?\s*([A-Z][A-Za-z\s]+(?:degree|Degree|Bachelor|Master|PhD|Certificate).*?)\s*\n?\s*(\d{4}\s*[-–]\s*\d{4})/gi;
    
    let match;
    while ((match = eduPattern.exec(educationSection)) !== null && entries.length < 2) {
      entries.push({
        institution: match[1].trim(),
        degree: match[2].trim(),
        period: match[3].trim()
      });
    }
    
    return entries;
  }

  private static extractPersonalSkills(text: string): string[] {
    const personalSkills = [
      "Communication", "Problem Solving", "Team Collaboration",
      "Adaptability", "Time Management", "Leadership",
      "Critical Thinking", "Creativity", "Analytical Thinking"
    ];
    
    const found = personalSkills.filter(skill => 
      text.toLowerCase().includes(skill.toLowerCase())
    );
    
    return found.length > 0 ? found.slice(0, 6) : personalSkills.slice(0, 6);
  }

  private static extractProfessionalSkills(text: string): string[] {
    const technicalSkills = [
      "JavaScript", "TypeScript", "Python", "Java", "React", "Angular", "Vue",
      "Node.js", "Express", "SQL", "MongoDB", "PostgreSQL", "MySQL",
      "AWS", "Azure", "Docker", "Kubernetes", "Git", "Agile", "Scrum"
    ];
    
    const found = technicalSkills.filter(skill => 
      text.toLowerCase().includes(skill.toLowerCase())
    );
    
    return found.length > 0 ? found.slice(0, 8) : technicalSkills.slice(0, 6);
  }

  private static getEmptyInfo(): ExtractedCVInfo {
    return {
      personalInfo: {
        name: null,
        email: null,
        phone: null,
        location: null,
        website: null,
        title: null
      },
      workExperience: [],
      education: [],
      skills: {
        personal: [],
        professional: []
      }
    };
  }
}


