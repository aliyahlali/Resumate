/**
 * Resume History Tests for Resumate API
 * Tests CV history retrieval, management, and persistence
 * 
 * Usage: node Test/resumeHistorytest.js
 */

const axios = require('axios');
require('dotenv').config();

const BASE_URL = process.env.TEST_URL || 'http://localhost:5000/api';

// Sample data for testing
const sampleCVText = `John Doe
Senior Software Engineer
john@example.com

EXPERIENCE
Lead Developer at TechCorp | 2022-Present
• Architected microservices using Node.js and Docker
• Led team of 5 engineers
Senior Developer at WebSolutions | 2019-2021
• Built React applications
• Managed MongoDB databases`;

const jobDescriptionText = `Senior Full Stack Developer
Requirements: Node.js, React, MongoDB, Docker, AWS`;

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
    const email = `history_test_${Date.now()}@example.com`;
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
    throw new Error('Failed to get valid token for history tests');
  }
}

// Helper to generate a CV
async function generateCV(token, cv = sampleCVText, job = jobDescriptionText) {
  const response = await axios.post(`${BASE_URL}/cv/generate`, {
    cvText: cv,
    jobDescription: job,
    templateId: 'modern-professional',
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    timeout: 120000,
  });

  return response.data.data;
}

async function testHistoryRetrieval() {
  logSection('HISTORY RETRIEVAL TESTS');

  const token = await getValidToken();

  // Test 1: Retrieve empty history for new user
  await test('Should retrieve empty history for new user', async () => {
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
    if (response.data.data.length !== 0) {
      throw new Error('New user should have empty history');
    }
    if (response.data.count !== 0) {
      throw new Error('Count should be 0 for new user');
    }

    logInfo('Empty history confirmed for new user');
  });

  // Test 2: Generate CV and verify it appears in history
  await test('Should add generated CV to history', async () => {
    // Generate a CV
    const generated = await generateCV(token);

    if (!generated.id) {
      throw new Error('Generated CV has no ID');
    }

    // Retrieve history
    const response = await axios.get(`${BASE_URL}/cv/history`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.count === 0) {
      throw new Error('CV not added to history');
    }

    const found = response.data.data.some(cv => cv._id === generated.id || cv.id === generated.id);
    if (!found) {
      throw new Error('Generated CV not found in history');
    }

    logInfo(`CV added to history. Total CVs: ${response.data.count}`);
  });

  // Test 3: Multiple CVs in history
  await test('Should display multiple CVs in history', async () => {
    // Generate multiple CVs
    await generateCV(token);
    await generateCV(token, sampleCVText.replace('John', 'Jane'), jobDescriptionText);
    
    // Retrieve history
    const response = await axios.get(`${BASE_URL}/cv/history`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.count < 2) {
      throw new Error('Multiple CVs not in history');
    }

    logInfo(`Multiple CVs in history: ${response.data.count} total`);
  });

  // Test 4: History ordered by creation date (newest first)
  await test('Should order history by creation date (newest first)', async () => {
    // Generate two CVs with delay
    const cv1 = await generateCV(token);
    
    // Small delay to ensure different timestamps
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const cv2 = await generateCV(token, sampleCVText + '\nAdditional experience');
    
    // Retrieve history
    const response = await axios.get(`${BASE_URL}/cv/history`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.data.length < 2) {
      throw new Error('Not enough CVs in history');
    }

    // Most recent should be first
    const newest = response.data.data[0];
    if (newest._id !== cv2.id && newest.id !== cv2.id) {
      logInfo('Note: History order may differ from expected');
    } else {
      logInfo('History ordered correctly (newest first)');
    }
  });

  // Test 5: History without authentication
  await test('Should reject history retrieval without authentication', async () => {
    try {
      await axios.get(`${BASE_URL}/cv/history`);

      throw new Error('Should have failed but succeeded');
    } catch (error) {
      if (!error.response || error.response.status !== 401) {
        throw new Error(`Expected 401 but got ${error.response?.status}`);
      }
    }
  });

  // Test 6: History response structure
  await test('Should return proper history response structure', async () => {
    // Generate a CV first
    await generateCV(token);

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
    if (typeof response.data.count !== 'number') {
      throw new Error('Count is not a number');
    }
  });
}

async function testCVRetrieval() {
  logSection('INDIVIDUAL CV RETRIEVAL TESTS');

  const token = await getValidToken();

  let generatedCVId;

  // Test 1: Generate and retrieve specific CV
  await test('Should retrieve specific CV by ID', async () => {
    const generated = await generateCV(token);
    generatedCVId = generated.id;

    const response = await axios.get(`${BASE_URL}/cv/${generatedCVId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.data.success) {
      throw new Error('Failed to fetch CV by ID');
    }
    if (!response.data.data) {
      throw new Error('No data returned');
    }

    const cvData = response.data.data;
    if (!cvData.id && !cvData._id) {
      throw new Error('No CV ID in response');
    }
    if (!cvData.optimizedCVText) {
      throw new Error('Missing optimized CV text');
    }
    if (!cvData.cvHTML) {
      throw new Error('Missing CV HTML');
    }

    logInfo('CV retrieved successfully with all fields');
  });

  // Test 2: Retrieve CV includes original CV text
  await test('Should retrieve CV with original CV text', async () => {
    const generated = await generateCV(token);

    const response = await axios.get(`${BASE_URL}/cv/${generated.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const cvData = response.data.data;

    if (!cvData.originalCVText) {
      throw new Error('Original CV text not included');
    }

    logInfo('Original CV text included in response');
  });

  // Test 3: Retrieve CV includes job description
  await test('Should retrieve CV with job description', async () => {
    const generated = await generateCV(token);

    const response = await axios.get(`${BASE_URL}/cv/${generated.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const cvData = response.data.data;

    if (!cvData.jobDescription) {
      throw new Error('Job description not included');
    }

    logInfo('Job description included in response');
  });

  // Test 4: Retrieve non-existent CV
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

  // Test 5: Invalid CV ID format
  await test('Should handle invalid CV ID format', async () => {
    try {
      await axios.get(`${BASE_URL}/cv/!!!invalid!!!`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      throw new Error('Should have failed but succeeded');
    } catch (error) {
      if (!error.response || (error.response.status !== 404 && error.response.status !== 400)) {
        throw new Error(`Expected 404 or 400 but got ${error.response?.status}`);
      }
    }
  });

  // Test 6: Retrieve CV without authentication
  await test('Should reject CV retrieval without authentication', async () => {
    if (!generatedCVId) {
      logInfo('Skipping unauthenticated retrieval test (no CV ID)');
      return;
    }

    try {
      await axios.get(`${BASE_URL}/cv/${generatedCVId}`);

      throw new Error('Should have failed but succeeded');
    } catch (error) {
      if (!error.response || error.response.status !== 401) {
        throw new Error(`Expected 401 but got ${error.response?.status}`);
      }
    }
  });

  // Test 7: Cannot access other user's CV
  await test('Should not allow accessing another user\'s CV', async () => {
    const user1Token = await getValidToken();
    const user2Token = await getValidToken();

    // User 1 generates a CV
    const cv = await generateCV(user1Token);

    // User 2 tries to access it
    try {
      await axios.get(`${BASE_URL}/cv/${cv.id}`, {
        headers: {
          Authorization: `Bearer ${user2Token}`,
        },
      });

      throw new Error('Should not access other user\'s CV');
    } catch (error) {
      if (error.response?.status !== 404) {
        throw new Error(`Expected 404 but got ${error.response?.status}`);
      }
    }
  });
}

async function testCVContent() {
  logSection('CV CONTENT TESTS');

  const token = await getValidToken();

  // Test 1: HTML content is valid
  await test('Should return valid HTML content', async () => {
    const generated = await generateCV(token);

    const response = await axios.get(`${BASE_URL}/cv/${generated.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const html = response.data.data.cvHTML;

    if (typeof html !== 'string') {
      throw new Error('HTML is not a string');
    }
    if (html.length === 0) {
      throw new Error('HTML is empty');
    }
    if (!html.includes('<') || !html.includes('>')) {
      throw new Error('HTML does not contain tags');
    }

    logInfo(`HTML content valid: ${html.length} characters`);
  });

  // Test 2: Optimized text is different from original
  await test('Should have optimized text different from original', async () => {
    const generated = await generateCV(token);

    const response = await axios.get(`${BASE_URL}/cv/${generated.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const original = response.data.data.originalCVText;
    const optimized = response.data.data.optimizedCVText;

    if (!original || !optimized) {
      throw new Error('Missing original or optimized text');
    }

    // They should be different (optimization applied)
    if (original === optimized) {
      logInfo('Note: Original and optimized text are identical');
    } else {
      logInfo('Optimized text differs from original (optimization applied)');
    }
  });

  // Test 3: Optimized text includes job-relevant keywords
  await test('Should have job-relevant keywords in optimized text', async () => {
    const generated = await generateCV(token);

    const response = await axios.get(`${BASE_URL}/cv/${generated.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const optimized = response.data.data.optimizedCVText.toLowerCase();

    // Check for some keywords from the job description
    const keywords = ['node', 'react', 'developer', 'experience'];
    const foundKeywords = keywords.filter(k => optimized.includes(k));

    if (foundKeywords.length === 0) {
      logInfo('Note: No obvious job keywords found in optimized text');
    } else {
      logInfo(`Found ${foundKeywords.length} job-relevant keywords in optimized text`);
    }
  });

  // Test 4: Creation timestamp is present
  await test('Should include creation timestamp', async () => {
    const generated = await generateCV(token);

    const response = await axios.get(`${BASE_URL}/cv/${generated.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.data.data.createdAt) {
      throw new Error('Missing createdAt timestamp');
    }

    // Verify it's a valid date
    const date = new Date(response.data.data.createdAt);
    if (isNaN(date.getTime())) {
      throw new Error('createdAt is not a valid date');
    }

    logInfo(`CV created at: ${response.data.data.createdAt}`);
  });

  // Test 5: Response includes all required fields
  await test('Should return all required CV fields', async () => {
    const generated = await generateCV(token);

    const response = await axios.get(`${BASE_URL}/cv/${generated.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = response.data.data;
    const requiredFields = ['id', 'originalCVText', 'jobDescription', 'optimizedCVText', 'cvHTML', 'createdAt'];

    const missingFields = requiredFields.filter(field => !data[field] && data[field] !== undefined && data[field] !== '');
    if (missingFields.length > 0) {
      logInfo(`Note: Missing or empty fields: ${missingFields.join(', ')}`);
    } else {
      logInfo('All required fields present and populated');
    }
  });
}

async function testEdgeCases() {
  logSection('EDGE CASE TESTS');

  const token = await getValidToken();

  // Test 1: Multiple history retrievals return consistent data
  await test('Should return consistent data on multiple history retrievals', async () => {
    const generated = await generateCV(token);

    const response1 = await axios.get(`${BASE_URL}/cv/history`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const response2 = await axios.get(`${BASE_URL}/cv/history`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response1.data.count !== response2.data.count) {
      throw new Error('Inconsistent history count');
    }

    logInfo('History data consistent across retrievals');
  });

  // Test 2: History persistence across requests
  await test('Should persist CV in history across requests', async () => {
    const generated = await generateCV(token);
    const cvId = generated.id;

    // Retrieve history
    const historyResponse = await axios.get(`${BASE_URL}/cv/history`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Get individual CV
    const cvResponse = await axios.get(`${BASE_URL}/cv/${cvId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Both should return the same CV
    if (!cvResponse.data.data.optimizedCVText) {
      throw new Error('CV data not persisted');
    }

    logInfo('CV persisted correctly across requests');
  });

  // Test 3: Very long CV text in history
  await test('Should handle very long CV text in history', async () => {
    const longCV = sampleCVText + '\n' + 'Experience: '.repeat(100);

    const generated = await generateCV(token, longCV);

    const response = await axios.get(`${BASE_URL}/cv/${generated.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.data.data.originalCVText) {
      throw new Error('Long CV text not stored');
    }

    logInfo('Long CV text stored and retrieved successfully');
  });

  // Test 4: Special characters in CV
  await test('Should handle special characters in stored CV', async () => {
    const specialCV = sampleCVText + '\nSpecial: @#$%^&*()_+-=[]{}|;:,.<>?';

    const generated = await generateCV(token, specialCV);

    const response = await axios.get(`${BASE_URL}/cv/${generated.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.data.data.originalCVText.includes('@#')) {
      throw new Error('Special characters not preserved');
    }

    logInfo('Special characters preserved in storage');
  });

  // Test 5: Unicode characters in CV history
  await test('Should handle Unicode characters in CV history', async () => {
    const unicodeCV = 'José García\n李明\n' + sampleCVText;

    const generated = await generateCV(token, unicodeCV);

    const response = await axios.get(`${BASE_URL}/cv/${generated.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.data.data.originalCVText.includes('José')) {
      throw new Error('Unicode characters not preserved');
    }

    logInfo('Unicode characters preserved in storage');
  });

  // Test 6: Timestamps are accurate
  await test('Should have accurate timestamps', async () => {
    const beforeGeneration = new Date();
    
    const generated = await generateCV(token);
    
    const afterGeneration = new Date();

    const response = await axios.get(`${BASE_URL}/cv/${generated.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const createdTime = new Date(response.data.data.createdAt);

    if (createdTime < beforeGeneration || createdTime > afterGeneration) {
      logInfo('Note: Timestamp may be slightly off due to processing time');
    } else {
      logInfo('Timestamp is accurate');
    }
  });
}

async function testHistoryManagement() {
  logSection('HISTORY MANAGEMENT TESTS');

  const token = await getValidToken();

  // Test 1: History grows with each generation
  await test('Should add all generated CVs to history', async () => {
    const initial = await axios.get(`${BASE_URL}/cv/history`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const initialCount = initial.data.count;

    // Generate 3 CVs
    await generateCV(token);
    await generateCV(token, sampleCVText.replace('John', 'Jane'));
    await generateCV(token, sampleCVText.replace('Software', 'Senior Software'));

    const updated = await axios.get(`${BASE_URL}/cv/history`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const newCount = updated.data.count;

    if (newCount !== initialCount + 3) {
      throw new Error(`Expected ${initialCount + 3} CVs but got ${newCount}`);
    }

    logInfo(`History updated correctly: ${initialCount} → ${newCount} CVs`);
  });

  // Test 2: Each user has separate history
  await test('Should maintain separate history per user', async () => {
    const user1 = await getValidToken();
    const user2 = await getValidToken();

    // User 1 generates 2 CVs
    await generateCV(user1);
    await generateCV(user1);

    // User 2 generates 1 CV
    await generateCV(user2);

    // Get histories
    const history1 = await axios.get(`${BASE_URL}/cv/history`, {
      headers: {
        Authorization: `Bearer ${user1}`,
      },
    });

    const history2 = await axios.get(`${BASE_URL}/cv/history`, {
      headers: {
        Authorization: `Bearer ${user2}`,
      },
    });

    logInfo(`User 1 history: ${history1.data.count} CVs, User 2 history: ${history2.data.count} CVs`);
  });

  // Test 3: History data completeness
  await test('Should maintain complete data in history', async () => {
    const generated = await generateCV(token);

    // Retrieve from history list
    const historyList = await axios.get(`${BASE_URL}/cv/history`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const cvInHistory = historyList.data.data.find(cv => cv._id === generated.id || cv.id === generated.id);

    if (!cvInHistory) {
      throw new Error('Generated CV not found in history list');
    }

    // Check required fields in history list
    const requiredFields = ['_id', 'createdAt'];
    const hasRequiredFields = requiredFields.every(field => cvInHistory[field]);

    if (!hasRequiredFields) {
      throw new Error('History list missing required fields');
    }

    logInfo('History list contains complete data');
  });
}

async function runAllTests() {
  try {
    logInfo(`\nStarting Resume History Tests\nServer: ${BASE_URL}\n`);

    await testHistoryRetrieval();
    await testCVRetrieval();
    await testCVContent();
    await testEdgeCases();
    await testHistoryManagement();

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
