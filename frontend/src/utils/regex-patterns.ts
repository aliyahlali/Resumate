// Centralized regex patterns for CV parsing
export const PATTERNS = {
  // Email patterns
  EMAIL: {
    WITH_LABEL: /(?:email|e-mail|mail|courriel)[\s:]*([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i,
    STANDALONE: /\b([a-zA-Z0-9](?:[a-zA-Z0-9._-]*[a-zA-Z0-9])?@[a-zA-Z0-9](?:[a-zA-Z0-9.-]*[a-zA-Z0-9])?\.(?:[a-zA-Z]{2,}|[a-zA-Z]{2}\.[a-zA-Z]{2}))\b/,
    WITH_SPACES: /([a-zA-Z0-9._%+-]+)\s*@\s*([a-zA-Z0-9.-]+)\s*\.\s*([a-zA-Z]{2,})/
  },

  // Phone patterns
  PHONE: {
    WITH_LABEL: /(?:phone|tel|mobile)[\s:]*(\+?[\d\s\-\(\)]{8,})/i,
    INTERNATIONAL: /(\+\d{1,4}[\s\-]?\d{1,4}[\s\-]?\d{1,4}[\s\-]?\d{1,4}[\s\-]?\d{1,4})/,
    US_FORMAT: /(\(\d{3}\)\s*\d{3}[\s\-]?\d{4})/,
    SIMPLE: /(\d{3}[\s\-]\d{3}[\s\-]\d{4})/,
    FLEXIBLE: /(\+?[\d\s\-\(\)\.]{10,20})/
  },

  // Name patterns
  NAME: {
    WITH_LABEL: /(?:name)[\s:]+([A-Z][A-Za-z]+(?:\s+[A-Z][A-Za-z]+)+)/i,
    ALL_CAPS_FIRST: /^([A-Z]{2,}(?:\s+[A-Z]{2,})+)/m,
    TITLE_CASE_FIRST: /^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/m,
    ALL_CAPS_ANYWHERE: /\b([A-Z]{2,}(?:\s+[A-Z]{2,}){1,3})\b/,
    TITLE_CASE: /\b([A-Z][a-z]{2,}(?:\s+[A-Z][a-z]{2,}){1,3})\b/,
    WITH_APOSTROPHE: /\b([A-Z][a-z]+(?:'[A-Z][a-z]+)?(?:\s+[A-Z][a-z]+(?:'[A-Z][a-z]+)?)+)\b/,
    FLEXIBLE: /^([A-Za-z]+(?:\s+[A-Za-z]+)+)/m
  },

  // PDF artifact patterns
  PDF_ARTIFACTS: {
    KEYWORDS: /\b(?:endobj|xref|stream|endstream|startxref|obj|TypeXRef|Root|Info|Filter|FlateDecode|Length|trailer|Size|Prev|XRefStm)\b/gi,
    NUMBERS: /\b\d{7,}\s+\d+\s+[nf]\b/g,
    ZEROS: /\b0000000\d+\b/g,
    HEX: /\b[0-9A-F]{40,}\b/gi,
    LONG_SEQUENCES: /\b[a-zA-Z0-9]{30,}\b/g,
    SPECIAL_CHARS: /[^\w\s@.,;:()\-+#&\n\/\\'"]/g
  },

  // CV content validation
  CV_INDICATORS: {
    SECTIONS: /\b(?:experience|education|skills|work|name|address|email|phone|university|company|job|position|degree|certificate|diploma|bachelor|master|phd|curriculum|vitae|resume)\b/i,
    DATES: /\b(?:january|february|march|april|may|june|july|august|september|october|november|december|\d{4})\b/i,
    MEANINGFUL_CONTENT: [
      /@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/, // Email
      /\+?[\d\s\-\(\)]{8,}/, // Phone
      /\b[A-Z][a-z]+\s+[A-Z][a-z]+\b/, // Names
      /\b(?:experience|education|skills|work|university|company|job|position|degree)\b/i // CV keywords
    ]
  },

  // Exclude patterns for name validation
  NAME_EXCLUDES: /(email|phone|tel|address|location|experience|education|skills|objective|summary|curriculum|vitae|cv|resume|profile|contact|work|job|company|university|degree|qualification|professional|personal|technical|software|developer|engineer|manager|director|analyst|consultant|specialist|senior|junior|lead|head|chief|assistant|coordinator|administrator|officer|representative|supervisor|team|project|department|section|division|branch|office|center|centre|institute|college|school|academy|training|course|program|certificate|diploma|bachelor|master|phd|doctorate|mba|bsc|msc|ba|ma|llb|md|dds|dvm|pharmd|jd)/i
} as const;

// Helper functions for pattern matching
export class PatternMatcher {
  static findEmail(text: string): string | null {
    for (const pattern of Object.values(PATTERNS.EMAIL)) {
      const match = text.match(pattern);
      if (match) {
        let email = match[1] || match[0];
        
        // Handle OCR artifacts in emails
        if (match.length > 3) {
          email = `${match[1]}@${match[2]}.${match[3]}`;
        }
        
        // Clean up common OCR errors
        email = email
          .replace(/\s+/g, '')
          .replace(/[|]/g, 'l')
          .replace(/[0]/g, 'o')
          .toLowerCase();
        
        if (this.isValidEmail(email)) {
          return email;
        }
      }
    }
    return null;
  }

  static findPhone(text: string): string | null {
    for (const pattern of Object.values(PATTERNS.PHONE)) {
      const match = text.match(pattern);
      if (match) {
        let phone = match[1].trim();
        
        // Clean up OCR errors
        phone = phone
          .replace(/[|]/g, '1')
          .replace(/[O]/g, '0')
          .replace(/[l]/g, '1')
          .replace(/\s+/g, ' ')
          .trim();
        
        if (this.isValidPhone(phone)) {
          return phone;
        }
      }
    }
    return null;
  }

  static findName(text: string): string | null {
    // Clean text first
    const cleanText = this.cleanTextForNameExtraction(text);
    
    for (const pattern of Object.values(PATTERNS.NAME)) {
      const match = cleanText.match(pattern);
      if (match && match[1]) {
        const candidateName = match[1].trim().replace(/\s+/g, ' ');
        
        if (this.isValidName(candidateName)) {
          return candidateName;
        }
      }
    }
    return null;
  }

  private static isValidEmail(email: string): boolean {
    return email.includes('@') && 
           email.includes('.') && 
           /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email) &&
           email.length >= 5 && 
           email.length <= 100;
  }

  private static isValidPhone(phone: string): boolean {
    const digitsOnly = phone.replace(/[^\d]/g, '');
    return digitsOnly.length >= 8 && 
           digitsOnly.length <= 15 && 
           phone.match(/^\+?[\d\s\-\(\)\.]{8,20}$/) && 
           !phone.match(/^[\-\s\(\)\.]+$/);
  }

  private static isValidName(name: string): boolean {
    if (name.length < 3 || name.length > 60 || !name.includes(' ')) {
      return false;
    }

    if (PATTERNS.NAME_EXCLUDES.test(name)) {
      return false;
    }

    const nameParts = name.split(/\s+/);
    if (nameParts.length < 2 || nameParts.length > 5) {
      return false;
    }

    return nameParts.every(part => 
      part.length >= 2 && 
      /^[A-Za-z']+$/.test(part) &&
      !/^\d+$/.test(part)
    );
  }

  private static cleanTextForNameExtraction(text: string): string {
    return text
      .replace(PATTERNS.PDF_ARTIFACTS.KEYWORDS, ' ')
      .replace(PATTERNS.PDF_ARTIFACTS.NUMBERS, ' ')
      .replace(/[^\w\s@.,;:()\-+#&\n']/g, ' ')
      .replace(/\s+/g, ' ');
  }
}


