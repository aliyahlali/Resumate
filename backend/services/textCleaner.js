/**
 * Text cleaning service based on the frontend solution
 * Cleans OCR and PDF artifacts
 */

// Patterns to detect PDF artefacts
const PDF_ARTIFACTS = {
  KEYWORDS: /\b(?:endobj|xref|stream|endstream|startxref|obj|TypeXRef|Root|Info|Filter|FlateDecode|Length|trailer|Size|Prev|XRefStm)\b/gi,
  NUMBERS: /\b\d{7,}\s+\d+\s+[nf]\b/g,
  ZEROS: /\b0000000\d+\b/g,
  HEX: /\b[0-9A-F]{40,}\b/gi,
  LONG_SEQUENCES: /\b[a-zA-Z0-9]{30,}\b/g,
  SPECIAL_CHARS: /[^\w\s@.,;:()\-+#&\n\/\\'"]/g
};

/**
 * Detect if text contains PDF artefacts
 */
function isPDFArtifact(text) {
  if (!text || text.length < 10) return true;
  
  const pdfKeywords = [
    'endobj', 'xref', 'stream', 'endstream', 'startxref',
    'obj', 'TypeXRef', 'Root', 'Info', 'Filter', 'FlateDecode',
    'Length', 'trailer', 'Size', 'Prev', 'XRefStm', 'PDF',
    '0000000', '65535', 'n 000', 'f 000'
  ];
  
  let suspiciousScore = 0;
  let totalLength = text.length;
  
  // Check for PDF keywords
  const foundKeywords = pdfKeywords.filter(keyword => 
    text.toLowerCase().includes(keyword.toLowerCase())
  );
  suspiciousScore += foundKeywords.length * 15;
  
  // Check patterns typical of raw PDF data
  const pdfPatterns = [
    /\b\d{7,}\s+\d+\s+[nf]\b/g,
    /\bendobj\s+\d+\s+\d+\s+obj\b/g,
    /\bstream\s*\n[\s\S]*?endstream\b/g,
    /\b[0-9A-F]{32,}\b/gi,
    /\b0000000\d+\b/g
  ];
  
  for (const pattern of pdfPatterns) {
    const matches = text.match(pattern) || [];
    suspiciousScore += matches.length * 20;
  }
  
  // Look for meaningful content to counterbalance
  const meaningfulPatterns = [
    /@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,
    /\+?[\d\s\-\(\)]{8,}/,
    /\b(?:experience|education|skills|work|name|address|email|phone|university|company|job|position|degree|certificate|diploma|bachelor|master|phd|curriculum|vitae|resume)\b/i,
    /\b[A-Z][a-z]+\s+[A-Z][a-z]+\b/,
    /\b(?:january|february|march|april|may|june|july|august|september|october|november|december|\d{4})\b/i
  ];
  
  let meaningfulScore = 0;
  for (const pattern of meaningfulPatterns) {
    if (pattern.test(text)) {
      meaningfulScore += 10;
    }
  }
  
  const suspiciousRatio = suspiciousScore / Math.max(totalLength, 100);
  const hasMeaningfulContent = meaningfulScore > 20;
  
  return (suspiciousRatio > 0.3 && !hasMeaningfulContent) || 
         suspiciousRatio > 0.6 || 
         foundKeywords.length > 4;
}

/**
 * Clean extracted text from OCR and PDF artefacts
 */
function cleanAndCorrectText(text) {
  console.log('Advanced cleaning of OCR text...');
  
  let cleaned = text;
  
  // Phase 1: Correct common OCR errors
  const symbolCorrections = [
    [/\|\|/g, 'll'],
    [/\|(?=[a-z])/g, 'l'],
    [/(?<=[a-z])\|/g, 'l'],
    [/\|(?=\s)/g, 'I'],
    [/\[/g, 'I'],
    [/\]/g, 'l'],
    [/\{/g, '('],
    [/\}/g, ')'],
    [/`/g, "'"],
    [/"/g, '"'],
    [/"/g, '"'],
    [/'/g, "'"],
    [/'/g, "'"],
  ];
  
  symbolCorrections.forEach(([pattern, replacement]) => {
    cleaned = cleaned.replace(pattern, replacement);
  });
  
  // Phase 2: Contextual corrections
  const contextCorrections = [
    [/\b([A-Z])0([a-z]{2,})\b/g, '$1O$2'],
    [/\b([a-z]+)0([A-Z])\b/g, '$1o$2'],
    [/\b([A-Z])1([a-z]{2,})\b/g, '$1I$2'],
    [/([a-zA-Z0-9])0(@[a-zA-Z0-9.-]+)/g, '$1o$2'],
    [/(@[a-zA-Z0-9.-]+)0([a-zA-Z])/g, '$1o$2'],
    [/\brn(?=[a-z])/g, 'm'],
    [/\b1nformation\b/gi, 'Information'],
    [/\b1nternet\b/gi, 'Internet'],
    [/\bcom1ng\b/gi, 'coming'],
    [/\bwork1ng\b/gi, 'working'],
  ];
  
  contextCorrections.forEach(([pattern, replacement]) => {
    cleaned = cleaned.replace(pattern, replacement);
  });
  
  // Phase 3: Clean emails and phone numbers
  cleaned = cleaned
    .replace(/([a-zA-Z0-9._%+-]+)\s*@\s*([a-zA-Z0-9.-]+)\s*\.\s*([a-zA-Z]{2,})/g, '$1@$2.$3')
    .replace(/(\+?\d{1,4})\s*[-\s]\s*(\d{2,4})\s*[-\s]\s*(\d{2,4})\s*[-\s]?\s*(\d{2,4})?/g, 
      (match, p1, p2, p3, p4) => {
        if (p4) return `${p1}-${p2}-${p3}-${p4}`;
        return `${p1}-${p2}-${p3}`;
      });
  
  // Phase 4: Normalize whitespace
  cleaned = cleaned
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n\s*\n+/g, '\n\n')
    .replace(/\n\s+/g, '\n')
    .replace(/\s+$/gm, '')
    .replace(/^\s+/gm, '');
  
  // Phase 5: CV-specific corrections
  const cvCorrections = [
    [/\bskil1s\b/gi, 'skills'],
    [/\bexper1ence\b/gi, 'experience'],
    [/\beducat1on\b/gi, 'education'],
    [/\buniver51ty\b/gi, 'university'],
    [/\bco11ege\b/gi, 'college'],
    [/\bcompan1es\b/gi, 'companies'],
    [/\btechno1ogy\b/gi, 'technology'],
    [/\btechno1ogies\b/gi, 'technologies'],
    [/\bdeve1oper\b/gi, 'developer'],
    [/\bdeve1opment\b/gi, 'development'],
  ];
  
  cvCorrections.forEach(([pattern, replacement]) => {
    cleaned = cleaned.replace(pattern, replacement);
  });
  
  // Phase 6: Final cleanup
  cleaned = cleaned
    .replace(/\s+/g, ' ')
    .replace(/\n\s+/g, '\n')
    .trim();
  
  console.log(`Cleaning completed: ${text.length} -> ${cleaned.length} characters`);
  
  return cleaned;
}

/**
 * Clean text from PDF artefacts
 */
function cleanPDFArtifacts(text) {
  if (!text) return '';
  
  return text
    .replace(PDF_ARTIFACTS.KEYWORDS, ' ')
    .replace(PDF_ARTIFACTS.NUMBERS, ' ')
    .replace(PDF_ARTIFACTS.ZEROS, ' ')
    .replace(PDF_ARTIFACTS.HEX, ' ')
    .replace(PDF_ARTIFACTS.LONG_SEQUENCES, (match) => {
      if (match.includes('@') || match.includes('.') || /[A-Z]{2,}[a-z]{2,}/.test(match)) {
        return match;
      }
      return ' ';
    })
    .replace(PDF_ARTIFACTS.SPECIAL_CHARS, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Evaluate OCR result quality (based on frontend solution)
 */
function evaluateOCRResult(text, confidence) {
  let score = confidence || 0;
  
  // Score based on length
  if (text.length > 100) score += 15;
  if (text.length > 300) score += 25;
  if (text.length > 800) score += 35;
  
  // Detect CV-specific content with high weights
  const cvIndicators = [
    { pattern: /@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/, weight: 20, name: 'Email' },
    { pattern: /\+?[\d\s\-\(\)]{8,}/, weight: 15, name: 'Phone' },
    { pattern: /\b[A-Z][a-z]+\s+[A-Z][a-z]+\b/, weight: 18, name: 'Name Pattern' },
    { pattern: /\b(?:experience|education|skills|work|employment|job|career|professional)\b/gi, weight: 25, name: 'CV Keywords' },
    { pattern: /\b(?:university|college|degree|bachelor|master|phd|certification)\b/gi, weight: 20, name: 'Education Terms' },
    { pattern: /\b(?:company|corporation|inc|ltd|llc|technologies|solutions)\b/gi, weight: 15, name: 'Company Terms' },
    { pattern: /\b\d{4}\s*[-–]\s*(?:\d{4}|present|current)\b/gi, weight: 22, name: 'Date Ranges' },
    { pattern: /\b(?:javascript|python|java|react|angular|sql|aws|docker|git)\b/gi, weight: 18, name: 'Tech Skills' }
  ];
  
  let detectedIndicators = 0;
  cvIndicators.forEach(indicator => {
    const matches = text.match(indicator.pattern);
    if (matches) {
      score += indicator.weight;
      detectedIndicators++;
      console.log(`Found ${indicator.name}: ${matches.length} matches (+${indicator.weight})`);
    }
  });
  
  // Bonus for multiple CV indicators
  if (detectedIndicators >= 3) score += 20;
  if (detectedIndicators >= 5) score += 30;
  
  // Quality of text structure
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  if (lines.length > 5) score += 10;
  if (lines.length > 15) score += 15;
  
  // Word quality
  const words = text.split(/\s+/).filter(word => word.length > 1);
  const validWords = words.filter(word => /^[a-zA-Z@.-]+$/.test(word)).length;
  const wordRatio = validWords / Math.max(words.length, 1);
  score += wordRatio * 20;
  
  // Penalty for excessive artefacts
  const specialChars = (text.match(/[^a-zA-Z0-9\s@.,-:()\-+#&\n']/g) || []).length;
  const specialRatio = specialChars / Math.max(text.length, 1);
  if (specialRatio > 0.15) score -= 25;
  if (specialRatio > 0.25) score -= 40;
  
  // Penalty for very short text
  if (text.length < 30) score -= 40;
  if (text.length < 100) score -= 20;
  
  // Penalty for repetitive characters (OCR artefacts)
  const repeatedChars = text.match(/(.)\1{5,}/g);
  if (repeatedChars) score -= repeatedChars.length * 10;
  
  const finalScore = Math.max(0, Math.min(100, score));
  console.log(`OCR quality score: ${finalScore}/100 (confidence: ${confidence}%, indicators: ${detectedIndicators})`);
  
  return finalScore;
}

/**
 * Validate the quality of extracted OCR text
 */
function validateOCRQuality(text) {
  if (!text || text.trim().length < 10) {
    return { quality: 'failed', score: 0, issues: ['Text too short or empty'] };
  }
  
  const issues = [];
  let score = evaluateOCRResult(text, 50); // Base score
  
  // Check for meaningful content
  const hasEmail = /@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text);
  const hasPhone = /\+?[\d\s\-\(\)]{8,}/.test(text);
  const hasName = /\b[A-Z][a-z]+\s+[A-Z][a-z]+\b/.test(text);
  const hasCVKeywords = /\b(?:experience|education|skills|work|university|company|job|position|degree)\b/i.test(text);
  
  if (!hasEmail) { issues.push('No email found'); }
  if (!hasPhone) { issues.push('No phone number found'); }
  if (!hasName) { issues.push('No name found'); }
  if (!hasCVKeywords) { issues.push('No CV keywords found'); }
  
  // Check for OCR errors
  const commonOCRErrors = [
    { pattern: /\|/g, description: 'Pipe characters (|) detected' },
    { pattern: /\b[0-9]{1}[a-z]+\b/g, description: 'Digits mixed with letters' },
  ];
  
  for (const error of commonOCRErrors) {
    const matches = text.match(error.pattern) || [];
    if (matches.length > 0) {
      issues.push(`${error.description} (${matches.length} instances)`);
    }
  }
  
  // Determine quality level
  let quality;
  if (score >= 85) quality = 'excellent';
  else if (score >= 65) quality = 'good';
  else if (score >= 30) quality = 'poor';
  else quality = 'failed';
  
  return { quality, score, issues };
}

module.exports = {
  isPDFArtifact,
  cleanAndCorrectText,
  cleanPDFArtifacts,
  validateOCRQuality,
  evaluateOCRResult,
};

