const OpenAI = require('openai');

// Check if API key is configured
if (!process.env.OPENAI_API_KEY) {
  console.error('WARNING: OPENAI_API_KEY environment variable is not set!');
  console.error('Please configure your OpenAI API key in the environment variables.');
}

// Configuration for OpenRouter (if key starts with sk-or-v1-) or standard OpenAI
const isOpenRouter = process.env.OPENAI_API_KEY?.startsWith('sk-or-v1-');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-placeholder',
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
  // Check if API key is configured
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-placeholder') {
    throw new Error(
      'OpenAI API key is not configured. Please set the OPENAI_API_KEY environment variable to use the CV optimization feature.'
    );
  }

  try {
    const prompt = `You are an expert in recruitment and professional CV optimization.

ORIGINAL CV TO OPTIMIZE:
${cvText}

TARGET JOB DESCRIPTION:
${jobDescription}

TASK: Create a COMPLETE, PROFESSIONAL CV optimized for this position. The CV MUST FIT ON A SINGLE PAGE. Only include achievements and information from the ORIGINAL CV - do NOT invent or add languages, projects, or experiences that were not in the original CV, even if they appear in the job description.

============================================================
EXACT FORMAT TO FOLLOW (STRICT STRUCTURE):
============================================================

[FULL NAME IN UPPERCASE]
[Target Job Title]

CONTACT
[Phone] | [Email] | [Address] | [LinkedIn/Portfolio]

PROFESSIONAL PROFILE
[A 3–4 line paragraph describing: years of experience, main areas of expertise, key skills, major achievements with PRECISE NUMBERS (%, $, volume), value for the employer, and career goals aligned with the role.]

PROFESSIONAL EXPERIENCE

[Job Title] | [Company Name], [City, Country]
[Month Year] – [Month Year or Present]
• [Achievement 1 with strong action verb + context + quantified result: %, $, time saved, volume handled, growth achieved]
• [Achievement 2 with strong action verb + context + quantified result: measurable impact, improved metric]
• [Achievement 3 with strong action verb + context + quantified result: concrete data, precise metrics]
• [Achievement 4 with strong action verb + context + quantified result: tangible results]

[Repeat for ALL roles in the original CV – 3–4 bullet points MAXIMUM per position]

KEY PROJECTS (optional - include only if space allows and they are from the original CV)
[Project Name 1]
[Brief description] | [Dates]
• Technologies: [Technologies used in original CV]
• Results: [Results with NUMBERS from the original CV]

EDUCATION

[Full Degree with specialization]
[Institution Name] | [City, Country]
[Start Year] – [End Year]
• Specialization: [Specific field if applicable]

TECHNICAL SKILLS

• Programming Languages: [Languages from original CV]
• Frameworks & Libraries: [Frameworks from original CV]
• Databases: [Databases from original CV]
• Cloud & DevOps: [Cloud/DevOps tools from original CV]
• Tools & Technologies: [Tools from original CV]
• Soft Skills: [Soft skills from original CV]

LANGUAGES

• [Language 1]: [Precise level from original CV]
• [Language 2]: [Precise level from original CV]

CERTIFICATIONS (optional - if applicable)

• [Certification 1] – [Issuing organization], [Year]

============================================================
ABSOLUTE RULES (MUST FOLLOW):
============================================================

REQUIRED:
1. Start DIRECTLY with the NAME (NO text before it).
2. Follow EXACTLY the format above (sections in this order).
3. MAXIMUM 4 bullet points per professional experience (be concise).
4. Professional Profile: 3–4 lines ONLY (be concise for single page fit).
5. EVERY bullet MUST contain a NUMBER or METRIC (%, $, count, time).
6. Use strong action verbs in past tense: Developed, Designed, Optimized, Increased, Reduced, Managed, Led, Created, Implemented, Improved.
7. Integrate KEYWORDS from the job description that match the ORIGINAL CV achievements.
8. Add CONTEXT: team size, budget, technologies, challenges from the original CV.
9. Keep formatting compact to ensure the CV fits on ONE PAGE ONLY.
10. Optimize for ATS (Applicant Tracking Systems) - clean formatting, no special characters.

STRICTLY FORBIDDEN:
1. No explanatory comments ("This optimized CV...", "Here is...", "I created...").
2. No notes, conclusions, or remarks outside the CV itself.
3. No empty sections.
4. No generic bullet points without metrics ("Worked on projects").
5. No text before the name.
6. Do NOT add languages, skills, technologies, or projects NOT in the original CV.
7. Do NOT invent achievements or experiences.
8. Do NOT include information that is false or not verifiable from the original CV.
9. Do NOT exceed 4 bullet points per experience.
10. Do NOT make the CV longer than one page - keep sections brief and impactful.

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
            'You are a senior expert in recruitment and professional CV writing. You MUST create CONCISE, ONE-PAGE CVs optimized for the role. CRITICAL CONSTRAINTS: (1) The CV MUST fit on ONE page only - keep all sections compact. (2) MAXIMUM 4 bullet points per professional experience - be ruthless about conciseness. (3) ONLY include information that exists in the original CV - NEVER add skills, languages, projects, or experiences from the job description that are not in the original CV. Do NOT fabricate or invent anything. You return ONLY the formatted CV with NO comments, notes, or explanations. Start DIRECTLY with the name in uppercase.',
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
    console.error('OpenAI API Error Details:');
    console.error('  Status:', error.status);
    console.error('  Message:', error.message);
    console.error('  Error Code:', error.error?.code);
    console.error('  Full Error:', JSON.stringify(error, null, 2));
    
    // Provide user-friendly error messages
    let userMessage = 'Error while optimizing CV';
    
    if (error.status === 401) {
      userMessage = 'Invalid OpenAI API key. Please check your configuration.';
    } else if (error.status === 429) {
      userMessage = 'Rate limit exceeded. Please try again in a few moments.';
    } else if (error.status === 500) {
      userMessage = 'OpenAI service is temporarily unavailable. Please try again later.';
    } else if (error.message?.includes('insufficient_quota')) {
      userMessage = 'Your OpenAI account has insufficient credits. Please add credits to your account.';
    } else if (error.message?.includes('API key')) {
      userMessage = 'OpenAI API key is not configured or is invalid.';
    }
    
    throw new Error(userMessage);
  }
};

/**
 * Helper: extract the first JSON object/array from a model response
 * @param {string} text
 * @returns {any}
 */
function parseJSONFromText(text) {
  if (!text || typeof text !== 'string') throw new Error('Empty response from model');
  const match = text.match(/(\{[\s\S]*\})|(\[[\s\S]*\])/);
  if (!match) throw new Error('No JSON object or array found in model response');
  try {
    return JSON.parse(match[0]);
  } catch (err) {
    throw new Error('Failed to parse JSON from model response');
  }
}

/**
 * Tailor a resume to a job description and return structured JSON
 * @param {string} resumeText
 * @param {string} jobDescription
 */
exports.tailorResume = async (resumeText, jobDescription) => {
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-placeholder') {
    throw new Error('OpenAI API key is not configured. Please set the OPENAI_API_KEY environment variable.');
  }

  const model = process.env.OPENAI_MODEL || (isOpenRouter ? 'openai/gpt-3.5-turbo' : 'gpt-4o') ;

  const prompt = `You are an expert Resume Writer specializing in ATS optimization, one-page concise resumes, and executive brevity.

I have provided the raw text from a user's resume and a Job Description (JD) below.

**HIGH-PRIORITY OBJECTIVE**: Produce a single-page, ATS-friendly resume (max 350-450 words) optimized for the JD while KEEPING ALL MANDATORY SECTIONS.

**MANDATORY SECTIONS** (NEVER OMIT):
- Full Name & Contact Info
- Professional Experience (3-4 most relevant roles only)
- Education (ALL degrees included, condensed format)
- Skills (8-12 curated, JD-aligned skills)
- Languages (include all languages from resume)

**CRITICAL RULES**:
1. **1-Page Fit (350-450 words)**:
   - Name/Contact: 1-2 lines | Experience: 10-12 lines (3-4 roles, max 3 bullets each) | Education: 2-3 lines | Skills: 3-4 lines | Languages: 2-3 lines

2. **Experience**: 
   - Select only 3-4 most relevant roles (omit if older than 10 years and irrelevant)
   - Max **3-4 bullets per role**, single-line each
   - Action verb + context + metric (e.g., "Increased sales by 25% using...")

3. **Skills**:
   - 8-12 skills curated from JD + resume
   - Use exact JD keywords; do NOT invent
   - Prioritize hard skills

4. **Education**:
   - Include ALL degrees/certifications, condensed (e.g., "B.S. Computer Science, MIT, 2020")
   - Do NOT omit this section

5. **Languages**:
   - Include ALL languages from the original resume
   - Format as "Language: Proficiency Level" (e.g., "English: Fluent", "French: Intermediate")
   - Do NOT omit this section

6. **No Fabrication**: Do NOT invent phone, email, website, LinkedIn, degrees. Leave missing fields as empty string/array.

7. **ATS Keywords**: Use exact JD phrasing; never use synonyms for critical terms.

YOUR TASKS:
1. Select only 3-4 most relevant experience entries.
2. Curate 8-12 skills from both resume and JD.
3. Keep ALL education entries (condense if needed).
4. Include ALL languages from the original resume.
5. Identify missing critical keywords in 'missingKeywords'.
6. Ensure total word count fits one page (~350-450 words).
7. Max 3-4 bullets per experience role.

RESUME TEXT:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Return STRICTLY as JSON (fill missing fields with empty string/array, NOT invented values):
{
  "fullName": string,
  "contactInfo": string,
  "skills": [string (8-12 curated skills)],
  "languages": [string (all languages from resume, formatted)],
  "experience": [{ "id": string, "company": string, "role": string, "duration": string, "bullet_points": [string (max 3-4)] }],
  "education": [string (ALL degrees, condensed)],
  "missingKeywords": [string]
}
`;

  try {
    const response = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: 'system',
          content:
            'You are an expert Resume Writer specializing in ATS optimization and concise executive-level summaries. Return JSON only, no extra commentary.'
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.0,
      max_tokens: 1200,
    });

    const text = response.choices?.[0]?.message?.content || '';
    const rawData = parseJSONFromText(text);

    // Helpers to sanitize and enforce constraints
    function sanitizeContactInfo(info) {
      if (!info) return '';
      let cleaned = String(info);

      // Remove URLs that look like placeholders (name.lastname, yourname, example, placeholder)
      cleaned = cleaned.replace(/https?:\/\/[^\s]+/gi, (url) => {
        const host = url.replace(/https?:\/\/(www\.)?/, '').split(/[\/?#]/)[0];
        if (/(name|first|last|your|example|placeholder)/i.test(host)) return '';
        return url;
      });

      // Remove bare domains that appear to be placeholders
      cleaned = cleaned.replace(/\b([a-z0-9-]+\.)+[a-z]{2,}\b/gi, (domain) => {
        if (/(name|first|last|your|example|placeholder)/i.test(domain)) return '';
        return domain;
      });

      // If the cleaned string looks empty or only punctuation, return empty
      cleaned = cleaned.replace(/[\s,;|]+/g, ' ').trim();
      if (!cleaned || /^(name|first|last|your|example|placeholder)$/i.test(cleaned)) return '';
      return cleaned;
    }

    function trimSummary(summary) {
      if (!summary) return '';
      const words = summary.trim().split(/\s+/);
      if (words.length <= 50) return summary.trim();
      return words.slice(0, 50).join(' ') + '...';
    }

    function truncateBullets(bullets) {
      if (!Array.isArray(bullets)) return [];
      return bullets.slice(0, 4);
    }

    // Normalize and enforce constraints: max 4 roles, max 4 bullets per role, do not fabricate contact info
    const experienceList = (rawData.experience || []).slice(0, 4).map((exp, idx) => ({
      id: exp.id || String(idx + 1),
      company: exp.company || '',
      role: exp.role || '',
      duration: exp.duration || '',
      bullet_points: truncateBullets(exp.bullet_points || []),
      description: truncateBullets(exp.bullet_points || []),
    }));

    const adaptedData = {
      fullName: rawData.fullName || '',
      contactInfo: sanitizeContactInfo(rawData.contactInfo || ''),
      summary: trimSummary(rawData.summary || ''),
      skills: Array.isArray(rawData.skills) ? rawData.skills : [],
      experience: experienceList,
      education: Array.isArray(rawData.education) ? rawData.education : [],
      missingKeywords: Array.isArray(rawData.missingKeywords) ? rawData.missingKeywords : [],
    };

    return adaptedData;
  } catch (error) {
    console.error('tailorResume error:', error.message || error);
    throw error;
  }
};

/**
 * Analyze keyword match between a resume and a job description
 * @param {string} resumeText
 * @param {string} jobDescription
 */
exports.analyzeKeywordMatch = async (resumeText, jobDescription) => {
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-placeholder') {
    throw new Error('OpenAI API key is not configured. Please set the OPENAI_API_KEY environment variable.');
  }

  const model = process.env.OPENAI_MODEL || (isOpenRouter ? 'openai/gpt-3.5-turbo' : 'gpt-4o');

  const prompt = `You are an ATS (Applicant Tracking System) simulator.
Analyze the Resume Text and Job Description (JD). Tasks:
1. Extract the top 15-20 critical hard skills, tools, and keywords from the JD.
2. Check if these keywords exist in the Resume Text (semantic matching allowed: "JS" = "JavaScript").
3. Calculate a "Match Score" 0-100 based on how many CRITICAL keywords are present.
4. Provide a very brief 1-sentence summary of the match quality.

Return strictly JSON with this schema:
{ "score": number, "matchedKeywords": [string], "missingKeywords": [string], "summary": string }

RESUME TEXT:
${resumeText.substring(0, 8000)}

JOB DESCRIPTION:
${jobDescription.substring(0, 4000)}
`;

  try {
    const response = await openai.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: 'You are an ATS scoring assistant. Return only JSON as specified.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.0,
      max_tokens: 800,
    });

    const text = response.choices?.[0]?.message?.content || '';
    const parsed = parseJSONFromText(text);
    return parsed;
  } catch (error) {
    console.error('analyzeKeywordMatch error:', error.message || error);
    throw error;
  }
};

/**
 * Get company intel from a JD. Note: the model doesn't run live web searches here; it will provide best-effort answers.
 * @param {string} jobDescription
 */
exports.getCompanyIntel = async (jobDescription) => {
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-placeholder') {
    throw new Error('OpenAI API key is not configured. Please set the OPENAI_API_KEY environment variable.');
  }

  const model = process.env.OPENAI_MODEL || (isOpenRouter ? 'openai/gpt-3.5-turbo' : 'gpt-4o');

  const prompt = `Analyze this Job Description. Tasks:
1. Identify the Company Name (if present).
2. Provide a brief summary of what the company does.
3. Provide 2-3 recent headlines or "about us" facts (best-effort; mark source if known).
4. Provide 3-4 words describing likely corporate culture.

Return strictly JSON:
{ "name": string, "summary": string, "recentNews": [{"title": string, "url": string}], "cultureKeywords": [string] }

Job Description (truncated):
${jobDescription.substring(0, 1000)}...`;

  try {
    const response = await openai.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: 'You are a concise research assistant. Return only JSON.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.0,
      max_tokens: 600,
    });

    const text = response.choices?.[0]?.message?.content || '';
    try {
      const intel = parseJSONFromText(text);
      return intel;
    } catch (err) {
      console.warn('Could not parse company intel JSON, returning null. Raw response:', text);
      return null;
    }
  } catch (error) {
    console.warn('getCompanyIntel warning:', error.message || error);
    return null;
  }
};

/**
 * Create a simple chat session wrapper to send messages with a system instruction
 */
exports.createChatSession = (systemInstruction = "You are a helpful career coach assistant. You help users improve their resumes. Be concise, encouraging, and professional.") => {
  return {
    sendMessage: async (messages = []) => {
      if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-placeholder') {
        throw new Error('OpenAI API key is not configured. Please set the OPENAI_API_KEY environment variable.');
      }

      const model = process.env.OPENAI_MODEL || (isOpenRouter ? 'openai/gpt-3.5-turbo' : 'gpt-4o');

      const fullMessages = [
        { role: 'system', content: systemInstruction },
        ...messages
      ];

      const response = await openai.chat.completions.create({
        model,
        messages: fullMessages,
        temperature: 0.2,
        max_tokens: 800,
      });

      return response.choices?.[0]?.message?.content || '';
    }
  };
};

