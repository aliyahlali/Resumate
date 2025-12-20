const OpenAI = require('openai');

// Configuration for OpenRouter (if key starts with sk-or-v1-) or standard OpenAI
const isOpenRouter = process.env.OPENAI_API_KEY?.startsWith('sk-or-v1-');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: isOpenRouter 
    ? 'https://openrouter.ai/api/v1' 
    : undefined, // Use OpenAI default URL if not using OpenRouter
});

/**
 * Clean CV text to remove explanatory comments
 * @param {string} text - CV text
 * @returns {string} - Cleaned text
 */
function cleanExplanatoryText(text) {
  if (!text) return text;
  
  let cleaned = text;
  
  // Patterns of explanatory phrases to remove
  const explanatoryPatterns = [
    // French phrases
    /Ce CV optimisé met en avant[\s\S]*?\./gi,
    /Ce CV optimisé[\s\S]*?description du poste\./gi,
    /Les descriptions des expériences[\s\S]*?CV initial\./gi,
    /^[^a-zA-Z0-9]*Ce CV[\s\S]*?(?=\n[A-Z])/gim,
    /^[^a-zA-Z0-9]*Les descriptions[\s\S]*?(?=\n[A-Z])/gim,
    /^[^a-zA-Z0-9]*Ce document[\s\S]*?(?=\n[A-Z])/gim,
    // English phrases
    /This optimized CV[\s\S]*?\./gi,
    /The descriptions[\s\S]*?original CV\./gi,
    /^[^a-zA-Z0-9]*This CV[\s\S]*?(?=\n[A-Z])/gim,
  ];
  
  // Remove explanatory patterns
  explanatoryPatterns.forEach(pattern => {
    cleaned = cleaned.replace(pattern, '');
  });
  
  // Remove lines starting with common explanatory phrases
  const explanatoryLines = [
    /^Ce CV optimisé.*$/gim,
    /^Les descriptions.*$/gim,
    /^Ce document.*$/gim,
    /^This optimized CV.*$/gim,
    /^The descriptions.*$/gim,
  ];
  
  explanatoryLines.forEach(pattern => {
    cleaned = cleaned.replace(pattern, '');
  });
  
  // Remove text blocks between "Ce CV optimisé" and the real start of the CV
  // Find first uppercase word (likely the name)
  const lines = cleaned.split('\n');
  const startIndex = lines.findIndex(line => {
    const trimmed = line.trim();
    // Find a line that looks like the start of a CV (name, contact, etc.)
    return trimmed && (
      /^[A-Z][a-z]+ [A-Z][a-z]+/.test(trimmed) || // Name
      /@/.test(trimmed) || // Email
      /^\+?\d/.test(trimmed) || // Phone
      /^[A-Z][A-Z ]+$/.test(trimmed) // Uppercase title
    );
  });
  
  // If a valid beginning is found, keep only from there
  if (startIndex > 0) {
    cleaned = lines.slice(startIndex).join('\n');
  }
  
  // Clean multiple spaces and leading empty lines
  cleaned = cleaned.replace(/^\s+/, '').replace(/\n\s*\n\s*\n+/g, '\n\n');
  
  return cleaned.trim();
}

/**
 * Optimize a CV based on a job description
 * @param {string} cvText - Original CV text
 * @param {string} jobDescription - Job description
 * @returns {Promise<string>} - Optimized CV
 */
exports.optimizeCV = async (cvText, jobDescription) => {
  try {
    const prompt = `You are an expert in recruitment and professional CV optimization.

ORIGINAL CV TO OPTIMIZE:
${cvText}

TARGET JOB DESCRIPTION:
${jobDescription}

TASK: Create a COMPLETE, PROFESSIONAL and HIGHLY DETAILED CV optimized for this position.

============================================================
EXACT FORMAT TO FOLLOW (STRICT STRUCTURE):
============================================================

[FULL NAME IN UPPERCASE]
[Target Job Title]

CONTACT
[Phone] | [Email] | [Address] | [LinkedIn/Portfolio]

PROFESSIONAL PROFILE
[A 5–7 line paragraph describing: years of experience, main areas of expertise, key skills, major achievements with PRECISE NUMBERS (%, $, volume), value for the employer, and career goals aligned with the role.]

PROFESSIONAL EXPERIENCE

[Job Title] | [Company Name], [City, Country]
[Month Year] – [Month Year or Present]
• [Achievement 1 with strong action verb + context + quantified result: %, $, time saved, volume handled, growth achieved]
• [Achievement 2 with strong action verb + context + quantified result: measurable impact, improved metric]
• [Achievement 3 with strong action verb + context + quantified result: concrete data, precise metrics]
• [Achievement 4 with strong action verb + context + quantified result: tangible results]
• [Achievement 5 with strong action verb + context + quantified result: measurable accomplishment]
• [Achievement 6 with strong action verb + context + quantified result: demonstrable impact]

[Repeat for ALL roles in the original CV – minimum 3 positions with 6–8 bullet points EACH]

KEY PROJECTS
[Project Name 1]
[Detailed description of project, context, and objectives] | [Dates]
• Technologies: [Complete list of technologies used]
• Results: [Results with NUMBERS: performance, adoption, savings, etc.]
• Impact: [Measurable impact on the organization or users]

[Repeat for 2–3 major projects if applicable]

EDUCATION

[Full Degree with specialization]
[Institution Name] | [City, Country]
[Start Year] – [End Year]
• Specialization: [Specific field]
• Honors: [Honors if applicable]
• Academic Projects: [Projects relevant to the role]

[Repeat for all degrees]

TECHNICAL SKILLS

• Programming Languages: [COMPLETE and DETAILED list of all languages]
• Frameworks & Libraries: [COMPLETE list: frameworks, libraries, development tools]
• Databases: [COMPLETE list: SQL, NoSQL, management tools]
• Cloud & DevOps: [Cloud platforms, CI/CD tools, containerization, orchestration]
• Tools & Technologies: [IDE, version control, collaboration, design tools, etc.]
• Methodologies: [Agile, Scrum, Kanban, TDD, etc.]
• Soft Skills: [Communication, leadership, problem solving, etc.]

LANGUAGES

• [Language 1]: [Precise level – Native/Bilingual/Fluent/Intermediate/Basic] – [Certification if applicable]
• [Language 2]: [Precise level] – [Certification if applicable]
• [Language 3]: [Precise level] – [Certification if applicable]

CERTIFICATIONS

• [Certification 1] – [Issuing organization], [Month Year]
• [Certification 2] – [Issuing organization], [Month Year]

============================================================
ABSOLUTE RULES (MUST FOLLOW):
============================================================

REQUIRED:
1. Start DIRECTLY with the NAME (NO text before it).
2. Follow EXACTLY the format above (sections in this order).
3. MINIMUM 6–8 bullet points per professional experience.
4. EVERY bullet MUST contain a NUMBER or METRIC (%, $, count, time).
5. Use strong action verbs in past tense: Developed, Designed, Optimized, Increased, Reduced, Managed, Led, Created, Implemented, Improved.
6. Integrate KEYWORDS from the job description throughout the CV.
7. Expand EACH experience with CONCRETE and SPECIFIC details.
8. Add rich CONTEXT: team size, budget, technologies, challenges.
9. Quantify EVERYTHING: volumes, percentages, time, savings, growth.
10. Create a professional profile of at least 5–7 lines (not 2–3 lines).

STRICTLY FORBIDDEN:
1. No explanatory comments ("This optimized CV...", "Here is...", "I created...").
2. No notes, conclusions, or remarks outside the CV itself.
3. No empty sections.
4. No generic bullet points without metrics ("Worked on projects").
5. No text before the name.
6. No unexplained abbreviations.

NOW GENERATE THE COMPLETE CV STRICTLY FOLLOWING THIS FORMAT:`;

    // Configure model and max_tokens for a very detailed CV
    const model = process.env.OPENAI_MODEL || (isOpenRouter ? 'openai/gpt-3.5-turbo' : 'gpt-3.5-turbo');

    // Limit max_tokens to avoid 402 "more credits, or fewer max_tokens" errors
    // If OPENAI_MAX_TOKENS is set, use it but cap at 3500.
    // Otherwise, use 3000 by default (enough for a detailed CV).
    const configuredMaxTokens = parseInt(process.env.OPENAI_MAX_TOKENS, 10);
    const maxTokens =
      Number.isFinite(configuredMaxTokens) && configuredMaxTokens > 0
        ? Math.min(configuredMaxTokens, 3500)
        : 3000;
    
    const response = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: 'system',
          content:
            'You are a senior expert in recruitment and professional CV writing with 15 years of experience. You MUST create ULTRA-COMPLETE and VERY DETAILED CVs with ALL sections in the exact order: Name, Title, Contact, Professional Profile (minimum 5–7 lines), Professional Experience (6–8 detailed bullet points per role with rich context and precise metrics), Key Projects, Education, Technical Skills (very detailed), Languages, Certifications. EVERY experience bullet MUST include: strong action verb + detailed context + quantified result with PRECISE NUMBERS (%, $, time, volumes, growth). You return ONLY the formatted CV, with NO comments, notes, or explanations. You start DIRECTLY with the name in uppercase, NOTHING before it.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7, // Slightly lower for more consistency
      max_tokens: maxTokens,
    });
    
    console.log('OpenAI response received');
    console.log('Tokens used:', response.usage?.total_tokens || 'unknown');
    console.log('Response length:', response.choices[0].message.content.length, 'characters');

    let optimizedText = response.choices[0].message.content.trim();
    
    // Clean explanatory comments if present
    optimizedText = cleanExplanatoryText(optimizedText);
    
    return optimizedText;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error(
      `Error while optimizing CV: ${error.message || 'Unknown error'}`
    );
  }
};

