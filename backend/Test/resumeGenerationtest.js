/**
 * Resume Generation Tests for Resumate API
 * Tests CV generation, retrieval, and optimization functionality
 * 
 * Usage: node Test/resumeGenerationtest.js
 */

const axios = require('axios');
require('dotenv').config();

const BASE_URL = process.env.TEST_URL || 'http://localhost:5000/api';

// Test data
const sampleCVText = `John Doe
Senior Software Engineer
john.doe@example.com | (555) 123-4567 | San Francisco, CA

PROFESSIONAL SUMMARY
Experienced software engineer with 8 years of expertise in full-stack development, cloud architecture, and team leadership. Proven track record of delivering scalable solutions and mentoring junior developers.

PROFESSIONAL EXPERIENCE

Lead Software Engineer | TechCorp Inc. | San Francisco, CA
January 2022 - Present
• Architected and implemented microservices infrastructure using Node.js and Docker
• Led cross-functional team of 5 engineers to deliver critical payment processing system
• Reduced API response time by 40% through performance optimization
• Mentored 3 junior developers in modern JavaScript and React best practices

Senior Developer | WebSolutions Ltd. | San Francisco, CA
June 2019 - December 2021
• Developed full-stack web applications using React, Node.js, and MongoDB
• Implemented CI/CD pipelines using GitHub Actions and Jenkins
• Improved application performance by 35% through code optimization
• Collaborated with product team to define technical requirements

Full Stack Developer | StartupXYZ | San Francisco, CA
January 2017 - May 2019
• Built responsive web interfaces using React and Vue.js
• Developed RESTful APIs and database schemas using Node.js and PostgreSQL
• Implemented real-time features using WebSockets
• Participated in agile development process with 2-week sprints

EDUCATION

Bachelor of Science in Computer Science
University of California, Berkeley
Graduated: May 2016

TECHNICAL SKILLS
• Programming Languages: JavaScript, Python, Java, SQL
• Frontend: React, Vue.js, HTML5, CSS3, Tailwind CSS
• Backend: Node.js, Express, Django, Spring Boot
• Databases: MongoDB, PostgreSQL, MySQL, Redis
• Cloud & DevOps: AWS, Docker, Kubernetes, Jenkins, GitHub Actions
• Tools & Platforms: Git, VS Code, JIRA, Slack

PROJECTS
Resume AI Optimizer | Personal Project | 2024
AI-powered platform that optimizes resumes for job descriptions using OpenAI API. Built with React, Node.js, and MongoDB.

Real-time Chat Application | Personal Project | 2023
Implemented WebSocket-based chat application with authentication and message persistence.

CERTIFICATIONS
AWS Certified Solutions Architect – Professional
Google Cloud Associate Cloud Engineer

LANGUAGES
English (Native), Spanish (Fluent), French (Intermediate)`;

const jobDescriptionText = `Senior Full Stack Developer - San Francisco, CA
We are looking for an experienced Senior Full Stack Developer to join our growing team.

Requirements:
• 5+ years of experience in full-stack web development
• Strong proficiency in JavaScript/TypeScript
• Experience with React and Node.js
• Knowledge of SQL and NoSQL databases
• Experience with cloud platforms (AWS, GCP, or Azure)
• Git and version control experience
• Strong problem-solving and communication skills

Nice to Have:
• Experience with Kubernetes and Docker
• Microservices architecture knowledge
• CI/CD pipeline experience
• Open source contribution experience
• Agile/Scrum experience

Responsibilities:
• Design and implement scalable web applications
• Collaborate with product and design teams
• Mentor junior developers
• Participate in code reviews
• Contribute to technical documentation`;

const sampleCVData = {
  name: 'Jane Smith',
  jobTitle: 'Senior Product Manager',
  contact: {
    email: 'jane.smith@example.com',
    phone: '(555) 987-6543',
    address: 'New York, NY',
    website: 'https://janesmith.com',
  },
  profile: 'Results-driven product manager with 6 years of experience launching successful products in SaaS and mobile space.',
  experience: [
    {
      position: 'Senior Product Manager',
      company: 'Tech Innovations Inc.',
      location: 'New York, NY',
      period: 'Jan 2022 - Present',
      description: 'Led product strategy for mobile app generating $2M ARR. Increased user engagement by 45%.',
    },
    {
      position: 'Product Manager',
      company: 'Digital Solutions Co.',
      location: 'New York, NY',
      period: 'Jun 2019 - Dec 2021',
      description: 'Managed product roadmap for SaaS platform. Grew user base from 1K to 10K users.',
    },
  ],
  education: [
    {
      institution: 'Columbia University',
      degree: 'MBA - Business Administration',
      period: '2017 - 2019',
    },
    {
      institution: 'State University',
      degree: 'BS - Computer Science',
      period: '2013 - 2017',
    },
  ],
  skills: [
    'Product Strategy',
    'User Research',
    'Data Analysis',
    'Agile Methodology',
    'Stakeholder Management',
    'Roadmap Planning',
  ],
  projects: [
    {
      name: 'Mobile Analytics Dashboard',
      period: '2023',
      description: 'Led development of real-time analytics dashboard for mobile app, reducing support tickets by 30%.',
    },
  ],
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
    const email = `resume_test_${Date.now()}@example.com`;
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
    throw new Error('Failed to get valid token for resume tests');
  }
}

async function testCVGeneration() {
  logSection('CV GENERATION TESTS');

  const token = await getValidToken();

  // Test 1: Generate CV with valid input
  await test('Should generate optimized CV with valid input', async () => {
    const response = await axios.post(`${BASE_URL}/cv/generate`, {
      cvText: sampleCVText,
      jobDescription: jobDescriptionText,
      templateId: 'modern-professional',
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 120000, // 2 minutes for AI processing
    });

    if (!response.data.success) {
      throw new Error('CV generation failed: success field is false');
    }
    if (!response.data.data.id) {
      throw new Error('No CV ID returned');
    }
    if (!response.data.data.optimizedCVText) {
      throw new Error('No optimized CV text returned');
    }
    if (!response.data.data.cvHTML) {
      throw new Error('No CV HTML returned');
    }

    // Store CV ID for later tests
    this.generatedCVId = response.data.data.id;
  });

  // Test 2: Generate CV without job description
  await test('Should fail CV generation without job description', async () => {
    try {
      await axios.post(`${BASE_URL}/cv/generate`, {
        cvText: sampleCVText,
        jobDescription: '',
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      throw new Error('Should have failed but succeeded');
    } catch (error) {
      if (error.response?.status !== 400) {
        throw new Error(`Expected 400 but got ${error.response?.status}`);
      }
    }
  });

  // Test 3: Generate CV without CV text
  await test('Should fail CV generation without CV text', async () => {
    try {
      await axios.post(`${BASE_URL}/cv/generate`, {
        cvText: '',
        jobDescription: jobDescriptionText,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      throw new Error('Should have failed but succeeded');
    } catch (error) {
      if (error.response?.status !== 400) {
        throw new Error(`Expected 400 but got ${error.response?.status}`);
      }
    }
  });

  // Test 4: Generate CV with very short CV text
  await test('Should fail CV generation with CV text less than 50 characters', async () => {
    try {
      await axios.post(`${BASE_URL}/cv/generate`, {
        cvText: 'Short text',
        jobDescription: jobDescriptionText,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      throw new Error('Should have failed but succeeded');
    } catch (error) {
      if (error.response?.status !== 400) {
        throw new Error(`Expected 400 but got ${error.response?.status}`);
      }
      if (!error.response?.data?.message?.includes('at least 50')) {
        throw new Error('Expected 50 character minimum message');
      }
    }
  });

  // Test 5: Generate CV with very short job description
  await test('Should fail CV generation with job description less than 20 characters', async () => {
    try {
      await axios.post(`${BASE_URL}/cv/generate`, {
        cvText: sampleCVText,
        jobDescription: 'Short',
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      throw new Error('Should have failed but succeeded');
    } catch (error) {
      if (error.response?.status !== 400) {
        throw new Error(`Expected 400 but got ${error.response?.status}`);
      }
      if (!error.response?.data?.message?.includes('at least 20')) {
        throw new Error('Expected 20 character minimum message');
      }
    }
  });

  // Test 6: Generate CV without authentication
  await test('Should fail CV generation without authentication', async () => {
    try {
      await axios.post(`${BASE_URL}/cv/generate`, {
        cvText: sampleCVText,
        jobDescription: jobDescriptionText,
      });

      throw new Error('Should have failed but succeeded');
    } catch (error) {
      if (error.response?.status !== 401) {
        throw new Error(`Expected 401 but got ${error.response?.status}`);
      }
    }
  });

  // Test 7: Response structure validation
  await test('Should return proper response structure for CV generation', async () => {
    const response = await axios.post(`${BASE_URL}/cv/generate`, {
      cvText: sampleCVText,
      jobDescription: jobDescriptionText,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 120000,
    });

    if (!response.data.hasOwnProperty('success')) {
      throw new Error('Missing success field');
    }
    if (!response.data.hasOwnProperty('data')) {
      throw new Error('Missing data field');
    }
    if (!response.data.data.hasOwnProperty('id')) {
      throw new Error('Missing id field in data');
    }
    if (!response.data.data.hasOwnProperty('optimizedCVText')) {
      throw new Error('Missing optimizedCVText field');
    }
    if (!response.data.data.hasOwnProperty('cvHTML')) {
      throw new Error('Missing cvHTML field');
    }
    if (!response.data.data.hasOwnProperty('createdAt')) {
      throw new Error('Missing createdAt field');
    }
  });
}

async function testCVRetrieval() {
  logSection('CV RETRIEVAL TESTS');

  const token = await getValidToken();

  let cvId;

  // Test 1: Get CV history
  await test('Should retrieve CV history', async () => {
    const response = await axios.get(`${BASE_URL}/cv/history`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.data.success) {
      throw new Error('Failed to fetch history');
    }
    if (!Array.isArray(response.data.data)) {
      throw new Error('History data is not an array');
    }

    if (response.data.data.length > 0) {
      cvId = response.data.data[0]._id || response.data.data[0].id;
    }
  });

  // Test 2: Get CV by ID (if we have one)
  if (cvId) {
    await test('Should retrieve specific CV by ID', async () => {
      const response = await axios.get(`${BASE_URL}/cv/${cvId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.data.success) {
        throw new Error('Failed to fetch CV by ID');
      }
      if (!response.data.data.id && !response.data.data._id) {
        throw new Error('No CV ID in response');
      }
      if (!response.data.data.optimizedCVText) {
        throw new Error('No optimized CV text in response');
      }
    });
  }

  // Test 3: Get non-existent CV
  await test('Should return 404 for non-existent CV', async () => {
    try {
      await axios.get(`${BASE_URL}/cv/nonexistent_id_12345`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      throw new Error('Should have failed but succeeded');
    } catch (error) {
      if (error.response?.status !== 404) {
        throw new Error(`Expected 404 but got ${error.response?.status}`);
      }
    }
  });

  // Test 4: Get history without authentication
  await test('Should fail history retrieval without authentication', async () => {
    try {
      await axios.get(`${BASE_URL}/cv/history`);

      throw new Error('Should have failed but succeeded');
    } catch (error) {
      if (error.response?.status !== 401) {
        throw new Error(`Expected 401 but got ${error.response?.status}`);
      }
    }
  });

  // Test 5: History response structure
  await test('Should return proper history response structure', async () => {
    const response = await axios.get(`${BASE_URL}/cv/history`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.data.hasOwnProperty('success')) {
      throw new Error('Missing success field');
    }
    if (!response.data.hasOwnProperty('data')) {
      throw new Error('Missing data field');
    }
    if (!response.data.hasOwnProperty('count')) {
      throw new Error('Missing count field');
    }
  });
}

async function testCreateFromScratch() {
  logSection('CREATE CV FROM SCRATCH TESTS');

  const token = await getValidToken();

  // Test 1: Create CV from structured data
  await test('Should create CV from structured data', async () => {
    const response = await axios.post(`${BASE_URL}/cv/create-from-scratch`, {
      cvData: sampleCVData,
      templateId: 'modern-professional',
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.data.success) {
      throw new Error('CV creation failed');
    }
    if (!response.data.data.id) {
      throw new Error('No CV ID returned');
    }
    if (!response.data.data.cvHTML) {
      throw new Error('No CV HTML returned');
    }
  });

  // Test 2: Create CV with minimal data
  await test('Should create CV with minimal data (name only)', async () => {
    const response = await axios.post(`${BASE_URL}/cv/create-from-scratch`, {
      cvData: {
        name: 'John Doe',
      },
      templateId: 'modern-professional',
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.data.success) {
      throw new Error('Minimal CV creation failed');
    }
  });

  // Test 3: Create CV without name
  await test('Should fail CV creation without name', async () => {
    try {
      await axios.post(`${BASE_URL}/cv/create-from-scratch`, {
        cvData: {
          jobTitle: 'Developer',
        },
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      throw new Error('Should have failed but succeeded');
    } catch (error) {
      if (error.response?.status !== 400) {
        throw new Error(`Expected 400 but got ${error.response?.status}`);
      }
    }
  });

  // Test 4: Create CV with experience array
  await test('Should create CV with multiple experiences', async () => {
    const cvDataWithExp = {
      ...sampleCVData,
      experience: [
        {
          position: 'Manager',
          company: 'Company A',
          period: '2020 - 2023',
          description: 'Led team',
        },
        {
          position: 'Developer',
          company: 'Company B',
          period: '2018 - 2020',
          description: 'Built features',
        },
      ],
    };

    const response = await axios.post(`${BASE_URL}/cv/create-from-scratch`, {
      cvData: cvDataWithExp,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.data.success) {
      throw new Error('CV creation with multiple experiences failed');
    }
  });

  // Test 5: Create CV without authentication
  await test('Should fail CV creation without authentication', async () => {
    try {
      await axios.post(`${BASE_URL}/cv/create-from-scratch`, {
        cvData: sampleCVData,
      });

      throw new Error('Should have failed but succeeded');
    } catch (error) {
      if (error.response?.status !== 401) {
        throw new Error(`Expected 401 but got ${error.response?.status}`);
      }
    }
  });

  // Test 6: Response structure validation
  await test('Should return proper response structure for create-from-scratch', async () => {
    const response = await axios.post(`${BASE_URL}/cv/create-from-scratch`, {
      cvData: sampleCVData,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.data.hasOwnProperty('success')) {
      throw new Error('Missing success field');
    }
    if (!response.data.hasOwnProperty('data')) {
      throw new Error('Missing data field');
    }
    if (!response.data.data.hasOwnProperty('id')) {
      throw new Error('Missing id field');
    }
    if (!response.data.data.hasOwnProperty('cvHTML')) {
      throw new Error('Missing cvHTML field');
    }
  });
}

async function testMatchAnalysis() {
  logSection('MATCH ANALYSIS TESTS');

  const token = await getValidToken();

  // Test 1: Analyze match between CV and job
  await test('Should analyze match between CV and job description', async () => {
    const response = await axios.post(`${BASE_URL}/cv/analyze-match`, {
      cvText: sampleCVText,
      jobDescription: jobDescriptionText,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 60000,
    });

    if (!response.data.success) {
      throw new Error('Match analysis failed');
    }
    if (!response.data.data.matchScore && response.data.data.matchScore !== 0) {
      throw new Error('No match score returned');
    }
    if (!response.data.data.matchedKeywords || !Array.isArray(response.data.data.matchedKeywords)) {
      throw new Error('No matched keywords array');
    }
    if (!response.data.data.missingKeywords || !Array.isArray(response.data.data.missingKeywords)) {
      throw new Error('No missing keywords array');
    }
  });

  // Test 2: Analyze match without CV
  await test('Should fail match analysis without CV text', async () => {
    try {
      await axios.post(`${BASE_URL}/cv/analyze-match`, {
        cvText: '',
        jobDescription: jobDescriptionText,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      throw new Error('Should have failed but succeeded');
    } catch (error) {
      if (error.response?.status !== 400) {
        throw new Error(`Expected 400 but got ${error.response?.status}`);
      }
    }
  });

  // Test 3: Analyze match without job description
  await test('Should fail match analysis without job description', async () => {
    try {
      await axios.post(`${BASE_URL}/cv/analyze-match`, {
        cvText: sampleCVText,
        jobDescription: '',
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      throw new Error('Should have failed but succeeded');
    } catch (error) {
      if (error.response?.status !== 400) {
        throw new Error(`Expected 400 but got ${error.response?.status}`);
      }
    }
  });

  // Test 4: Match analysis without authentication
  await test('Should fail match analysis without authentication', async () => {
    try {
      await axios.post(`${BASE_URL}/cv/analyze-match`, {
        cvText: sampleCVText,
        jobDescription: jobDescriptionText,
      });

      throw new Error('Should have failed but succeeded');
    } catch (error) {
      if (error.response?.status !== 401) {
        throw new Error(`Expected 401 but got ${error.response?.status}`);
      }
    }
  });

  // Test 5: Response structure validation
  await test('Should return proper response structure for match analysis', async () => {
    const response = await axios.post(`${BASE_URL}/cv/analyze-match`, {
      cvText: sampleCVText,
      jobDescription: jobDescriptionText,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 60000,
    });

    if (!response.data.hasOwnProperty('success')) {
      throw new Error('Missing success field');
    }
    if (!response.data.hasOwnProperty('data')) {
      throw new Error('Missing data field');
    }
    if (!response.data.data.hasOwnProperty('matchScore')) {
      throw new Error('Missing matchScore field');
    }
    if (!response.data.data.hasOwnProperty('matchedKeywords')) {
      throw new Error('Missing matchedKeywords field');
    }
    if (!response.data.data.hasOwnProperty('missingKeywords')) {
      throw new Error('Missing missingKeywords field');
    }
  });
}

async function testEdgeCases() {
  logSection('EDGE CASE TESTS');

  const token = await getValidToken();

  // Test 1: Very long CV text
  await test('Should handle very long CV text', async () => {
    const longCV = sampleCVText + '\n' + 'Additional experience: '.repeat(100);

    const response = await axios.post(`${BASE_URL}/cv/generate`, {
      cvText: longCV,
      jobDescription: jobDescriptionText,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 120000,
    });

    if (!response.data.success) {
      throw new Error('Long CV generation failed');
    }
  });

  // Test 2: Special characters in CV
  await test('Should handle special characters in CV', async () => {
    const cvWithSpecialChars = sampleCVText + '\n\nSpecial chars: @#$%^&*()_+-=[]{}|;:,.<>?';

    const response = await axios.post(`${BASE_URL}/cv/generate`, {
      cvText: cvWithSpecialChars,
      jobDescription: jobDescriptionText,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 120000,
    });

    if (!response.data.success) {
      throw new Error('CV with special characters generation failed');
    }
  });

  // Test 3: Unicode and international characters
  await test('Should handle Unicode and international characters', async () => {
    const cvWithUnicode = 'José García\nМаріяПапаєнко\n李明\n' + sampleCVText;

    const response = await axios.post(`${BASE_URL}/cv/generate`, {
      cvText: cvWithUnicode,
      jobDescription: jobDescriptionText,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 120000,
    });

    if (!response.data.success) {
      throw new Error('Unicode CV generation failed');
    }
  });

  // Test 4: Completely different job field
  await test('Should handle CV for different job field', async () => {
    const differentJobDesc = `Junior Graphic Designer - Remote
    We seek a creative graphic designer with 2+ years experience in UI/UX design.
    Required: Adobe Creative Suite, Figma, strong portfolio, communication skills`;

    const response = await axios.post(`${BASE_URL}/cv/generate`, {
      cvText: sampleCVText,
      jobDescription: differentJobDesc,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 120000,
    });

    if (!response.data.success) {
      throw new Error('Cross-field CV generation failed');
    }
  });
}

async function runAllTests() {
  try {
    logInfo(`\nStarting Resume Generation Tests\nServer: ${BASE_URL}\n`);

    await testCVGeneration();
    await testCVRetrieval();
    await testCreateFromScratch();
    await testMatchAnalysis();
    await testEdgeCases();

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
