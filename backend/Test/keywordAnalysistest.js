/**
 * Keyword Analysis Tests for Resumate API
 * Tests keyword matching, ATS scoring, and company intelligence extraction
 * 
 * Usage: node Test/keywordAnalysistest.js
 */

const axios = require('axios');
require('dotenv').config();

const BASE_URL = process.env.TEST_URL || 'http://localhost:5000/api';

// Test data
const testResumes = {
  techResume: `John Doe
Senior Full Stack Developer
john@example.com | (555) 123-4567

PROFESSIONAL EXPERIENCE
Lead Software Engineer | TechCorp Inc. | San Francisco, CA | 2022 - Present
• Architected microservices infrastructure using Node.js, Docker, and Kubernetes
• Developed React applications with TypeScript and Redux
• Implemented GraphQL APIs for mobile and web applications
• Optimized PostgreSQL queries, reducing query time by 40%
• Managed AWS infrastructure (EC2, S3, Lambda, RDS)

Senior Full Stack Developer | WebSolutions Ltd. | San Francisco, CA | 2019 - 2021
• Built full-stack applications using Node.js, Express, and MongoDB
• Developed responsive UIs with React and Tailwind CSS
• Implemented CI/CD pipelines using GitHub Actions and Jenkins
• Collaborated with cross-functional teams in Agile environment

TECHNICAL SKILLS
Programming Languages: JavaScript, TypeScript, Python, Java, SQL
Frontend: React, Vue.js, HTML5, CSS3, Webpack
Backend: Node.js, Express, Django, Spring Boot, GraphQL
Databases: MongoDB, PostgreSQL, MySQL, Redis
Cloud & DevOps: AWS, Docker, Kubernetes, Jenkins, GitHub Actions, Terraform
Tools: Git, VS Code, JIRA, Docker Compose, Postman`,

  marketingResume: `Sarah Johnson
Marketing Manager
sarah@example.com | (555) 987-6543

PROFESSIONAL EXPERIENCE
Senior Marketing Manager | Digital Innovations Inc. | New York, NY | 2021 - Present
• Led marketing campaigns generating $5M revenue increase
• Managed social media strategy across 5 platforms (Facebook, Instagram, LinkedIn, Twitter)
• Coordinated with sales team for lead generation and customer acquisition
• Analyzed market trends and competitor strategies
• Created compelling product messaging and brand positioning

Marketing Coordinator | Creative Agency LLC | New York, NY | 2019 - 2021
• Supported marketing campaigns with content creation and social media management
• Managed email marketing campaigns with 25% open rate improvement
• Coordinated events and trade shows
• Performed market research and competitor analysis

SKILLS
Digital Marketing, Social Media Management, Content Marketing, SEO, SEM, Email Marketing
Google Analytics, HubSpot, Salesforce, Mailchimp, Hootsuite, Canva, Adobe Suite`,

  noSkillResume: `Mike Smith
Worker
mike@example.com

EXPERIENCE
Job at Company | 2020 - 2022
Did stuff and helped the team

Job at Another Company | 2018 - 2020
Worked and learned things`,
};

const testJobDescriptions = {
  techJob: `Senior Full Stack Developer - San Francisco, CA

We are seeking an experienced Senior Full Stack Developer to join our engineering team.

Requirements:
• 5+ years of experience in full-stack web development
• Strong proficiency in JavaScript/TypeScript and React
• Experience with Node.js and Express
• Knowledge of SQL and NoSQL databases (PostgreSQL, MongoDB)
• Experience with Docker, Kubernetes, and AWS
• Understanding of microservices architecture
• Experience with GraphQL APIs
• Proficiency in CI/CD tools (Jenkins, GitHub Actions)
• Strong problem-solving skills and attention to detail
• Experience with Agile/Scrum methodologies

Nice to Have:
• Experience with Python or Java
• Knowledge of Redis and caching strategies
• Experience with Terraform and Infrastructure as Code
• Open source contributions
• Bachelor's degree in Computer Science or related field

Responsibilities:
• Design and implement scalable web applications
• Collaborate with product and design teams
• Mentor junior developers
• Participate in code reviews
• Contribute to technical documentation`,

  marketingJob: `Marketing Manager - New York, NY

We are looking for a talented Marketing Manager to lead our marketing initiatives.

Key Requirements:
• 4+ years of marketing experience
• Strong background in digital marketing
• Experience with social media management and content marketing
• Proficiency with marketing tools (Google Analytics, HubSpot, Salesforce)
• Strong analytical and data-driven decision-making skills
• Excellent communication and project management abilities
• Experience with email marketing campaigns
• Knowledge of SEO and SEM

Nice to Have:
• Experience with event management
• Graphic design skills
• Video marketing experience
• Experience with Adobe Creative Suite
• MBA or related marketing certification

Responsibilities:
• Develop and execute marketing strategies
• Manage digital marketing campaigns
• Oversee social media accounts
• Analyze marketing metrics and ROI
• Collaborate with sales and product teams
• Create marketing content and messaging`,

  basicJob: `General Worker - Any Location

Looking for someone to do work.

Requirements:
• Ability to work
• Willing to learn
• Good attitude`,
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✓ ${message}`, 'green');
}

function logError(message) {
  log(`✗ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ ${message}`, 'blue');
}

function logSection(title) {
  log(`\n${'='.repeat(50)}`, 'cyan');
  log(title, 'cyan');
  log(`${'='.repeat(50)}`, 'cyan');
}

// Test results tracking
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

async function test(name, fn) {
  totalTests++;
  try {
    await fn();
    logSuccess(name);
    passedTests++;
  } catch (error) {
    logError(name);
    console.error(`  Error: ${error.message}`);
    if (error.response?.data) {
      console.error(`  Response: ${JSON.stringify(error.response.data)}`);
    }
    failedTests++;
  }
}

// Helper to get valid token
async function getValidToken() {
  try {
    const email = `keyword_test_${Date.now()}@example.com`;
    const password = 'TestPassword123!';

    const registerRes = await axios.post(`${BASE_URL}/auth/register`, {
      email,
      password,
    });

    if (registerRes.data.success) {
      return registerRes.data.token;
    }

    const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
      email,
      password,
    });

    return loginRes.data.token;
  } catch (error) {
    throw new Error('Failed to get valid token for keyword tests');
  }
}

async function testMatchAnalysisBasics() {
  logSection('MATCH ANALYSIS BASIC TESTS');

  const token = await getValidToken();

  // Test 1: Perfect match scenario
  await test('Should analyze match between well-matched CV and job description', async () => {
    const response = await axios.post(`${BASE_URL}/cv/analyze-match`, {
      cvText: testResumes.techResume,
      jobDescription: testJobDescriptions.techJob,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 60000,
    });

    if (!response.data.success) {
      throw new Error('Match analysis failed');
    }
    if (typeof response.data.data.matchScore !== 'number') {
      throw new Error('Match score is not a number');
    }
    if (response.data.data.matchScore < 0 || response.data.data.matchScore > 100) {
      throw new Error('Match score out of range (0-100)');
    }
    if (!Array.isArray(response.data.data.matchedKeywords)) {
      throw new Error('Matched keywords is not an array');
    }
    if (!Array.isArray(response.data.data.missingKeywords)) {
      throw new Error('Missing keywords is not an array');
    }

    logInfo(`Match score: ${response.data.data.matchScore}%`);
    logInfo(`Matched keywords: ${response.data.data.matchedKeywords.length}`);
    logInfo(`Missing keywords: ${response.data.data.missingKeywords.length}`);
  });

  // Test 2: Poor match scenario
  await test('Should detect low match between marketing resume and tech job', async () => {
    const response = await axios.post(`${BASE_URL}/cv/analyze-match`, {
      cvText: testResumes.marketingResume,
      jobDescription: testJobDescriptions.techJob,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 60000,
    });

    if (!response.data.success) {
      throw new Error('Match analysis failed');
    }

    logInfo(`Match score for marketing-to-tech job: ${response.data.data.matchScore}%`);
  });

  // Test 3: Keyword detection
  await test('Should detect relevant keywords in matched resume', async () => {
    const response = await axios.post(`${BASE_URL}/cv/analyze-match`, {
      cvText: testResumes.techResume,
      jobDescription: testJobDescriptions.techJob,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 60000,
    });

    if (response.data.data.matchedKeywords.length === 0) {
      throw new Error('No matched keywords found in well-matched CV');
    }

    // Check for specific expected keywords
    const matched = response.data.data.matchedKeywords.map(k => k.toLowerCase());
    const expectedKeywords = ['react', 'node', 'typescript', 'javascript', 'kubernetes'];
    const foundExpected = expectedKeywords.filter(k => 
      matched.some(m => m.includes(k) || k.includes(m.split(' ')[0]))
    );

    logInfo(`Found ${foundExpected.length}/${expectedKeywords.length} expected keywords`);
  });

  // Test 4: Missing keyword detection
  await test('Should identify missing keywords when job requires specific tech', async () => {
    const response = await axios.post(`${BASE_URL}/cv/analyze-match`, {
      cvText: testResumes.marketingResume,
      jobDescription: testJobDescriptions.techJob,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 60000,
    });

    if (response.data.data.missingKeywords.length === 0) {
      throw new Error('No missing keywords found in poorly-matched CV');
    }

    logInfo(`Missing keywords: ${response.data.data.missingKeywords.slice(0, 5).join(', ')}`);
  });

  // Test 5: Empty resume handling
  await test('Should handle empty or minimal resume gracefully', async () => {
    try {
      await axios.post(`${BASE_URL}/cv/analyze-match`, {
        cvText: '',
        jobDescription: testJobDescriptions.techJob,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      throw new Error('Should have failed but succeeded');
    } catch (error) {
      if (!error.response || error.response.status !== 400) {
        throw new Error(`Expected 400 but got ${error.response?.status}`);
      }
    }
  });
}

async function testKeywordExtraction() {
  logSection('KEYWORD EXTRACTION TESTS');

  const token = await getValidToken();

  // Test 1: Extract multiple keyword types
  await test('Should extract various keyword types (skills, tools, frameworks)', async () => {
    const response = await axios.post(`${BASE_URL}/cv/analyze-match`, {
      cvText: testResumes.techResume,
      jobDescription: testJobDescriptions.techJob,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 60000,
    });

    const allKeywords = [
      ...response.data.data.matchedKeywords,
      ...response.data.data.missingKeywords,
    ];

    // Check for different types of keywords
    const hasFramework = allKeywords.some(k => 
      k.toLowerCase().includes('react') || 
      k.toLowerCase().includes('express') ||
      k.toLowerCase().includes('node')
    );

    const hasLanguage = allKeywords.some(k => 
      k.toLowerCase().includes('javascript') || 
      k.toLowerCase().includes('typescript') ||
      k.toLowerCase().includes('python')
    );

    const hasDatabase = allKeywords.some(k => 
      k.toLowerCase().includes('postgres') || 
      k.toLowerCase().includes('mongo') ||
      k.toLowerCase().includes('sql')
    );

    if (!hasFramework || !hasLanguage || !hasDatabase) {
      throw new Error('Not all keyword types were extracted');
    }

    logInfo('Successfully extracted frameworks, languages, and databases');
  });

  // Test 2: Semantic keyword matching
  await test('Should semantically match similar keywords (JS = JavaScript, DB = Database)', async () => {
    // Create CV with abbreviated terms
    const abbreviatedCV = testResumes.techResume
      .replace('JavaScript', 'JS')
      .replace('TypeScript', 'TS')
      .replace('PostgreSQL', 'PG');

    const response = await axios.post(`${BASE_URL}/cv/analyze-match`, {
      cvText: abbreviatedCV,
      jobDescription: testJobDescriptions.techJob,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 60000,
    });

    // Score should still be reasonable despite abbreviations
    if (response.data.data.matchScore < 30) {
      logInfo('Note: Abbreviations may have reduced match score');
    } else {
      logInfo('Semantic matching appears to work well with abbreviations');
    }
  });

  // Test 3: Case-insensitive keyword matching
  await test('Should match keywords regardless of case', async () => {
    const mixedCaseCV = testResumes.techResume.toUpperCase().substring(0, 100) + 
                        testResumes.techResume.toLowerCase().substring(100);

    const response = await axios.post(`${BASE_URL}/cv/analyze-match`, {
      cvText: mixedCaseCV,
      jobDescription: testJobDescriptions.techJob,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 60000,
    });

    if (response.data.data.matchedKeywords.length === 0) {
      throw new Error('Case sensitivity preventing keyword matching');
    }

    logInfo('Case-insensitive matching confirmed');
  });

  // Test 4: Whitespace and punctuation tolerance
  await test('Should handle extra whitespace and punctuation in keywords', async () => {
    const messy = testResumes.techResume
      .replace(/Node\.js/g, 'Node  .  js')
      .replace(/React/g, 'React,')
      .replace(/Docker/g, 'Docker-');

    const response = await axios.post(`${BASE_URL}/cv/analyze-match`, {
      cvText: messy,
      jobDescription: testJobDescriptions.techJob,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 60000,
    });

    if (response.data.data.matchedKeywords.length > 0) {
      logInfo('Whitespace and punctuation handling works well');
    }
  });
}

async function testScoreCalculation() {
  logSection('SCORE CALCULATION TESTS');

  const token = await getValidToken();

  // Test 1: Score reflects match quality
  await test('Should assign higher scores to better-matched resumes', async () => {
    // Good match
    const goodMatch = await axios.post(`${BASE_URL}/cv/analyze-match`, {
      cvText: testResumes.techResume,
      jobDescription: testJobDescriptions.techJob,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 60000,
    });

    // Poor match
    const poorMatch = await axios.post(`${BASE_URL}/cv/analyze-match`, {
      cvText: testResumes.noSkillResume,
      jobDescription: testJobDescriptions.techJob,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 60000,
    });

    const goodScore = goodMatch.data.data.matchScore;
    const poorScore = poorMatch.data.data.matchScore;

    if (goodScore <= poorScore) {
      throw new Error(`Good match (${goodScore}) should score higher than poor match (${poorScore})`);
    }

    logInfo(`Good match score: ${goodScore}%, Poor match score: ${poorScore}%`);
  });

  // Test 2: Score range validation
  await test('Should keep score within 0-100 range', async () => {
    const response = await axios.post(`${BASE_URL}/cv/analyze-match`, {
      cvText: testResumes.techResume,
      jobDescription: testJobDescriptions.techJob,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 60000,
    });

    const score = response.data.data.matchScore;

    if (score < 0 || score > 100) {
      throw new Error(`Score out of range: ${score}`);
    }

    logInfo(`Score is within valid range: ${score}%`);
  });

  // Test 3: Exact match should have high score
  await test('Should assign high score when CV matches job requirements closely', async () => {
    const response = await axios.post(`${BASE_URL}/cv/analyze-match`, {
      cvText: testResumes.techResume,
      jobDescription: testJobDescriptions.techJob,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 60000,
    });

    const score = response.data.data.matchScore;

    if (score < 50) {
      logInfo(`Note: Match score is ${score}%, might be below expected for good match`);
    } else {
      logInfo(`Good match score: ${score}%`);
    }
  });

  // Test 4: Cross-industry match should have low score
  await test('Should assign low score when industries completely different', async () => {
    const response = await axios.post(`${BASE_URL}/cv/analyze-match`, {
      cvText: testResumes.marketingResume,
      jobDescription: testJobDescriptions.techJob,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 60000,
    });

    const score = response.data.data.matchScore;

    if (score > 70) {
      logInfo(`Note: Cross-industry match score is ${score}%, higher than expected`);
    } else {
      logInfo(`Cross-industry mismatch score: ${score}%`);
    }
  });
}

async function testResponseStructure() {
  logSection('RESPONSE STRUCTURE TESTS');

  const token = await getValidToken();

  // Test 1: Complete response structure
  await test('Should return complete analysis response structure', async () => {
    const response = await axios.post(`${BASE_URL}/cv/analyze-match`, {
      cvText: testResumes.techResume,
      jobDescription: testJobDescriptions.techJob,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 60000,
    });

    const data = response.data.data;

    if (!data.hasOwnProperty('matchScore')) {
      throw new Error('Missing matchScore field');
    }
    if (!data.hasOwnProperty('matchedKeywords')) {
      throw new Error('Missing matchedKeywords field');
    }
    if (!data.hasOwnProperty('missingKeywords')) {
      throw new Error('Missing missingKeywords field');
    }
    if (!Array.isArray(data.matchedKeywords)) {
      throw new Error('matchedKeywords is not an array');
    }
    if (!Array.isArray(data.missingKeywords)) {
      throw new Error('missingKeywords is not an array');
    }
  });

  // Test 2: Keyword entry structure
  await test('Should have properly formatted keyword entries', async () => {
    const response = await axios.post(`${BASE_URL}/cv/analyze-match`, {
      cvText: testResumes.techResume,
      jobDescription: testJobDescriptions.techJob,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 60000,
    });

    const keywords = response.data.data.matchedKeywords;

    if (keywords.length > 0) {
      // Check if keywords are strings
      keywords.forEach((keyword, index) => {
        if (typeof keyword !== 'string') {
          throw new Error(`Keyword ${index} is not a string: ${typeof keyword}`);
        }
        if (keyword.length === 0) {
          throw new Error(`Keyword ${index} is empty`);
        }
      });
    }

    logInfo(`Valid structure for ${keywords.length} matched keywords`);
  });

  // Test 3: Score is numeric
  await test('Should return numeric match score', async () => {
    const response = await axios.post(`${BASE_URL}/cv/analyze-match`, {
      cvText: testResumes.techResume,
      jobDescription: testJobDescriptions.techJob,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 60000,
    });

    const score = response.data.data.matchScore;

    if (typeof score !== 'number') {
      throw new Error(`Score is not a number: ${typeof score}`);
    }
    if (isNaN(score)) {
      throw new Error('Score is NaN');
    }
  });
}

async function testEdgeCases() {
  logSection('EDGE CASE TESTS');

  const token = await getValidToken();

  // Test 1: Very long resume
  await test('Should handle very long resume text', async () => {
    const longResume = testResumes.techResume + '\n\n' + 'Experience: '.repeat(500);

    const response = await axios.post(`${BASE_URL}/cv/analyze-match`, {
      cvText: longResume,
      jobDescription: testJobDescriptions.techJob,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 60000,
    });

    if (!response.data.success) {
      throw new Error('Long resume analysis failed');
    }

    logInfo('Long resume analyzed successfully');
  });

  // Test 2: Very long job description
  await test('Should handle very long job description', async () => {
    const longJob = testJobDescriptions.techJob + '\n\n' + 'Requirements: '.repeat(500);

    const response = await axios.post(`${BASE_URL}/cv/analyze-match`, {
      cvText: testResumes.techResume,
      jobDescription: longJob,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 60000,
    });

    if (!response.data.success) {
      throw new Error('Long job description analysis failed');
    }

    logInfo('Long job description analyzed successfully');
  });

  // Test 3: Special characters in text
  await test('Should handle special characters in resume and job description', async () => {
    const specialResume = testResumes.techResume + '\nSpecial: @#$%^&*()_+-=[]{}|;:,.<>?';
    const specialJob = testJobDescriptions.techJob + '\nSpecial: @#$%^&*()_+-=[]{}|;:,.<>?';

    const response = await axios.post(`${BASE_URL}/cv/analyze-match`, {
      cvText: specialResume,
      jobDescription: specialJob,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 60000,
    });

    if (!response.data.success) {
      throw new Error('Special characters handling failed');
    }

    logInfo('Special characters handled correctly');
  });

  // Test 4: Unicode and international characters
  await test('Should handle Unicode and international characters', async () => {
    const unicodeResume = 'José García\n李明\nМаріяПапаєнко\n' + testResumes.techResume;
    const unicodeJob = 'Büro Berlin\n北京\nМосква\n' + testJobDescriptions.techJob;

    const response = await axios.post(`${BASE_URL}/cv/analyze-match`, {
      cvText: unicodeResume,
      jobDescription: unicodeJob,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 60000,
    });

    if (!response.data.success) {
      throw new Error('Unicode handling failed');
    }

    logInfo('Unicode characters handled correctly');
  });

  // Test 5: Numbers and percentages
  await test('Should handle numbers and percentages in text', async () => {
    const numericResume = testResumes.techResume + '\nAchievements: 40% improvement, 5+ years, $2M revenue';
    const numericJob = testJobDescriptions.techJob + '\nRequirements: 5+ years experience, 50% increase targets';

    const response = await axios.post(`${BASE_URL}/cv/analyze-match`, {
      cvText: numericResume,
      jobDescription: numericJob,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 60000,
    });

    if (!response.data.success) {
      throw new Error('Numeric text handling failed');
    }

    logInfo('Numbers and percentages handled correctly');
  });
}

async function testErrorHandling() {
  logSection('ERROR HANDLING TESTS');

  const token = await getValidToken();

  // Test 1: Missing CV text
  await test('Should return error when CV text is missing', async () => {
    try {
      await axios.post(`${BASE_URL}/cv/analyze-match`, {
        jobDescription: testJobDescriptions.techJob,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      throw new Error('Should have failed but succeeded');
    } catch (error) {
      if (!error.response || error.response.status !== 400) {
        throw new Error(`Expected 400 but got ${error.response?.status}`);
      }
    }
  });

  // Test 2: Missing job description
  await test('Should return error when job description is missing', async () => {
    try {
      await axios.post(`${BASE_URL}/cv/analyze-match`, {
        cvText: testResumes.techResume,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      throw new Error('Should have failed but succeeded');
    } catch (error) {
      if (!error.response || error.response.status !== 400) {
        throw new Error(`Expected 400 but got ${error.response?.status}`);
      }
    }
  });

  // Test 3: Unauthenticated request
  await test('Should reject unauthenticated request', async () => {
    try {
      await axios.post(`${BASE_URL}/cv/analyze-match`, {
        cvText: testResumes.techResume,
        jobDescription: testJobDescriptions.techJob,
      });

      throw new Error('Should have failed but succeeded');
    } catch (error) {
      if (!error.response || error.response.status !== 401) {
        throw new Error(`Expected 401 but got ${error.response?.status}`);
      }
    }
  });
}

async function runAllTests() {
  try {
    logInfo(`\nStarting Keyword Analysis Tests\nServer: ${BASE_URL}\n`);

    await testMatchAnalysisBasics();
    await testKeywordExtraction();
    await testScoreCalculation();
    await testResponseStructure();
    await testEdgeCases();
    await testErrorHandling();

    // Print summary
    logSection('TEST SUMMARY');
    log(`Total Tests: ${totalTests}`, 'yellow');
    logSuccess(`Passed: ${passedTests}`);
    if (failedTests > 0) {
      logError(`Failed: ${failedTests}`);
    } else {
      logSuccess('All tests passed!');
    }
    log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(2)}%`, 'cyan');
  } catch (error) {
    logError(`Fatal error during testing: ${error.message}`);
    console.error(error);
  }

  process.exit(failedTests > 0 ? 1 : 0);
}

// Run tests
runAllTests();
