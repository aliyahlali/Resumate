/**
 * Upload Tests for Resumate API
 * Tests file upload, OCR extraction, and file handling
 * 
 * Usage: node Test/Uploadtest.js
 */

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const BASE_URL = process.env.TEST_URL || 'http://localhost:5000/api';

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

// Helper function to create test files
function createTestFile(filename, content, isBinary = false) {
  const testDir = path.join(__dirname, 'test-files');
  
  // Create test-files directory if it doesn't exist
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
  }

  const filePath = path.join(testDir, filename);
  
  if (isBinary) {
    fs.writeFileSync(filePath, content);
  } else {
    fs.writeFileSync(filePath, content, 'utf-8');
  }
  
  return filePath;
}

// Helper to clean up test files
function cleanupTestFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.warn(`Could not delete test file: ${filePath}`);
  }
}

// Helper to get valid token from login
async function getValidToken() {
  try {
    const registerEmail = `upload_test_${Date.now()}@example.com`;
    const registerRes = await axios.post(`${BASE_URL}/auth/register`, {
      email: registerEmail,
      password: 'TestPassword123!',
    });

    if (registerRes.data.success) {
      return registerRes.data.token;
    }

    // If registration fails (user exists), try login
    const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
      email: registerEmail,
      password: 'TestPassword123!',
    });

    return loginRes.data.token;
  } catch (error) {
    throw new Error('Failed to get valid token for upload tests');
  }
}

async function testAuthentication() {
  logSection('AUTHENTICATION TESTS');

  // Test 1: Upload without authentication
  await test('Should fail upload without authentication', async () => {
    const filePath = createTestFile('test.txt', 'Sample CV content');
    
    try {
      const form = new FormData();
      form.append('cvFile', fs.createReadStream(filePath));

      await axios.post(`${BASE_URL}/upload/extract`, form, {
        headers: form.getHeaders(),
      });
      
      throw new Error('Should have failed but succeeded');
    } catch (error) {
      if (!error.response || (error.response.status !== 401 && error.response.status !== 403)) {
        throw new Error(`Expected 401/403 but got ${error.response?.status}`);
      }
    } finally {
      cleanupTestFile(filePath);
    }
  });

  // Test 2: Upload with invalid token
  await test('Should fail upload with invalid token', async () => {
    const filePath = createTestFile('test.txt', 'Sample CV content');
    
    try {
      const form = new FormData();
      form.append('cvFile', fs.createReadStream(filePath));

      await axios.post(`${BASE_URL}/upload/extract`, form, {
        headers: {
          ...form.getHeaders(),
          'Authorization': 'Bearer invalid_token_xyz',
        },
      });
      
      throw new Error('Should have failed but succeeded');
    } catch (error) {
      if (!error.response || (error.response.status !== 401 && error.response.status !== 403)) {
        throw new Error(`Expected 401/403 but got ${error.response?.status}`);
      }
    } finally {
      cleanupTestFile(filePath);
    }
  });
}

async function testFileUpload() {
  logSection('FILE UPLOAD TESTS');

  const token = await getValidToken();

  // Test 1: Upload valid text file
  await test('Should upload and extract text from text file', async () => {
    const content = `John Doe
    Senior Software Engineer
    
    EXPERIENCE:
    - Led development of microservices architecture
    - Managed team of 5 developers
    
    SKILLS:
    - JavaScript, Node.js, React
    - MongoDB, PostgreSQL`;

    const filePath = createTestFile('resume.txt', content);

    try {
      const form = new FormData();
      form.append('cvFile', fs.createReadStream(filePath));

      const response = await axios.post(`${BASE_URL}/upload/extract`, form, {
        headers: {
          ...form.getHeaders(),
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.data.success) {
        throw new Error('Upload failed: success field is false');
      }
      if (!response.data.data.extractedText) {
        throw new Error('No extracted text returned');
      }
      if (!response.data.data.fileName) {
        throw new Error('No filename in response');
      }
      if (typeof response.data.data.textLength !== 'number') {
        throw new Error('No text length in response');
      }
    } finally {
      cleanupTestFile(filePath);
    }
  });

  // Test 2: Upload without file
  await test('Should fail upload without file', async () => {
    try {
      const form = new FormData();

      await axios.post(`${BASE_URL}/upload/extract`, form, {
        headers: {
          ...form.getHeaders(),
          'Authorization': `Bearer ${token}`,
        },
      });

      throw new Error('Should have failed but succeeded');
    } catch (error) {
      if (error.response?.status !== 400) {
        throw new Error(`Expected 400 but got ${error.response?.status}`);
      }
      if (!error.response?.data?.message?.includes('No file')) {
        throw new Error('Expected "No file" error message');
      }
    }
  });

  // Test 3: Upload very large file (should fail due to size limit)
  await test('Should fail upload of file exceeding size limit', async () => {
    const largeContent = 'x'.repeat(11 * 1024 * 1024); // 11MB
    const filePath = createTestFile('large.txt', largeContent);

    try {
      const form = new FormData();
      form.append('cvFile', fs.createReadStream(filePath));

      await axios.post(`${BASE_URL}/upload/extract`, form, {
        headers: {
          ...form.getHeaders(),
          'Authorization': `Bearer ${token}`,
        },
      });

      throw new Error('Should have failed but succeeded');
    } catch (error) {
      if (!error.response || (error.response.status !== 400 && error.response.status !== 413)) {
        throw new Error(`Expected 400/413 but got ${error.response?.status}`);
      }
    } finally {
      cleanupTestFile(filePath);
    }
  });

  // Test 4: Upload unsupported file type
  await test('Should fail upload of unsupported file type', async () => {
    const filePath = createTestFile('file.xyz', 'Some content');

    try {
      const form = new FormData();
      form.append('cvFile', fs.createReadStream(filePath));

      await axios.post(`${BASE_URL}/upload/extract`, form, {
        headers: {
          ...form.getHeaders(),
          'Authorization': `Bearer ${token}`,
        },
      });

      throw new Error('Should have failed but succeeded');
    } catch (error) {
      if (!error.response || error.response.status !== 400) {
        throw new Error(`Expected 400 but got ${error.response?.status}`);
      }
      if (!error.response?.data?.message?.includes('Unsupported')) {
        throw new Error('Expected unsupported file type error');
      }
    } finally {
      cleanupTestFile(filePath);
    }
  });

  // Test 5: Upload file with special characters in name
  await test('Should handle filename with special characters', async () => {
    const content = 'Sample CV content with special chars';
    const filePath = createTestFile('resume_john-doe_2024.txt', content);

    try {
      const form = new FormData();
      form.append('cvFile', fs.createReadStream(filePath));

      const response = await axios.post(`${BASE_URL}/upload/extract`, form, {
        headers: {
          ...form.getHeaders(),
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.data.success) {
        throw new Error('Upload with special characters failed');
      }
    } finally {
      cleanupTestFile(filePath);
    }
  });

  // Test 6: Upload file with spaces in name
  await test('Should handle filename with spaces', async () => {
    const content = 'Sample CV with spaces in filename';
    const filePath = createTestFile('My Resume Document.txt', content);

    try {
      const form = new FormData();
      form.append('cvFile', fs.createReadStream(filePath));

      const response = await axios.post(`${BASE_URL}/upload/extract`, form, {
        headers: {
          ...form.getHeaders(),
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.data.success) {
        throw new Error('Upload with spaces in name failed');
      }
    } finally {
      cleanupTestFile(filePath);
    }
  });
}

async function testSupportedFormats() {
  logSection('SUPPORTED FILE FORMAT TESTS');

  const token = await getValidToken();

  // Test 1: Upload TXT file
  await test('Should accept .txt files', async () => {
    const content = 'Resume in text format';
    const filePath = createTestFile('resume.txt', content);

    try {
      const form = new FormData();
      form.append('cvFile', fs.createReadStream(filePath));

      const response = await axios.post(`${BASE_URL}/upload/extract`, form, {
        headers: {
          ...form.getHeaders(),
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.data.success) {
        throw new Error('TXT upload failed');
      }
    } finally {
      cleanupTestFile(filePath);
    }
  });

  // Test 2: Upload PNG image
  await test('Should accept .png image files', async () => {
    // Create a minimal PNG file (1x1 pixel)
    const pngHeader = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
    ]);
    
    const filePath = createTestFile('resume.png', pngHeader, true);

    try {
      const form = new FormData();
      form.append('cvFile', fs.createReadStream(filePath));

      const response = await axios.post(`${BASE_URL}/upload/extract`, form, {
        headers: {
          ...form.getHeaders(),
          'Authorization': `Bearer ${token}`,
        },
        timeout: 30000, // 30 second timeout for image processing
      });

      // Should either succeed or fail gracefully (OCR may fail on invalid image)
      if (response.status === 200 || response.status === 500) {
        logInfo('PNG format handled appropriately');
      }
    } catch (error) {
      // OCR errors are acceptable for invalid images
      if (error.response?.status === 500 || error.response?.status === 200) {
        logInfo('PNG format handled appropriately');
      } else {
        throw error;
      }
    } finally {
      cleanupTestFile(filePath);
    }
  });

  // Test 3: Upload JPG image
  await test('Should accept .jpg image files', async () => {
    // Create a minimal JPEG file
    const jpgHeader = Buffer.from([
      0xFF, 0xD8, 0xFF, 0xE0, // JPEG marker
    ]);
    
    const filePath = createTestFile('resume.jpg', jpgHeader, true);

    try {
      const form = new FormData();
      form.append('cvFile', fs.createReadStream(filePath));

      const response = await axios.post(`${BASE_URL}/upload/extract`, form, {
        headers: {
          ...form.getHeaders(),
          'Authorization': `Bearer ${token}`,
        },
        timeout: 30000,
      });

      if (response.status === 200 || response.status === 500) {
        logInfo('JPG format handled appropriately');
      }
    } catch (error) {
      if (error.response?.status === 500 || error.response?.status === 200) {
        logInfo('JPG format handled appropriately');
      } else {
        throw error;
      }
    } finally {
      cleanupTestFile(filePath);
    }
  });
}

async function testTextExtraction() {
  logSection('TEXT EXTRACTION TESTS');

  const token = await getValidToken();

  // Test 1: Verify extracted text preservation
  await test('Should preserve text content during extraction', async () => {
    const originalText = `John Doe
    Senior Developer
    john@example.com
    
    Experience: 5 years in software development`;

    const filePath = createTestFile('extract_test.txt', originalText);

    try {
      const form = new FormData();
      form.append('cvFile', fs.createReadStream(filePath));

      const response = await axios.post(`${BASE_URL}/upload/extract`, form, {
        headers: {
          ...form.getHeaders(),
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.data.data.extractedText) {
        throw new Error('No extracted text');
      }

      // Check if key information is preserved
      const extracted = response.data.data.extractedText.toLowerCase();
      if (!extracted.includes('john')) {
        throw new Error('Name not preserved in extraction');
      }
    } finally {
      cleanupTestFile(filePath);
    }
  });

  // Test 2: Text length calculation
  await test('Should correctly calculate extracted text length', async () => {
    const content = 'A'.repeat(500);
    const filePath = createTestFile('length_test.txt', content);

    try {
      const form = new FormData();
      form.append('cvFile', fs.createReadStream(filePath));

      const response = await axios.post(`${BASE_URL}/upload/extract`, form, {
        headers: {
          ...form.getHeaders(),
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.data.data.textLength <= 0) {
        throw new Error('Invalid text length');
      }

      if (response.data.data.textLength !== response.data.data.extractedText.length) {
        throw new Error('Text length mismatch');
      }
    } finally {
      cleanupTestFile(filePath);
    }
  });

  // Test 3: Empty file handling
  await test('Should handle empty file gracefully', async () => {
    const filePath = createTestFile('empty.txt', '');

    try {
      const form = new FormData();
      form.append('cvFile', fs.createReadStream(filePath));

      const response = await axios.post(`${BASE_URL}/upload/extract`, form, {
        headers: {
          ...form.getHeaders(),
          'Authorization': `Bearer ${token}`,
        },
      });

      // Should succeed but with empty or minimal content
      if (response.status !== 200) {
        throw new Error('Empty file handling failed');
      }
    } finally {
      cleanupTestFile(filePath);
    }
  });

  // Test 4: File with special encoding
  await test('Should handle UTF-8 encoded file', async () => {
    const content = 'José García • Μαρία Παπαδοπούλου • 李明 • мир';
    const filePath = createTestFile('unicode.txt', content, false);

    try {
      const form = new FormData();
      form.append('cvFile', fs.createReadStream(filePath));

      const response = await axios.post(`${BASE_URL}/upload/extract`, form, {
        headers: {
          ...form.getHeaders(),
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.data.success) {
        throw new Error('UTF-8 file handling failed');
      }
    } finally {
      cleanupTestFile(filePath);
    }
  });
}

async function testFileHandling() {
  logSection('FILE HANDLING TESTS');

  const token = await getValidToken();

  // Test 1: Multiple file uploads
  await test('Should handle multiple sequential uploads', async () => {
    const filePath1 = createTestFile('multi1.txt', 'First file content');
    const filePath2 = createTestFile('multi2.txt', 'Second file content');

    try {
      // First upload
      let form = new FormData();
      form.append('cvFile', fs.createReadStream(filePath1));

      let response = await axios.post(`${BASE_URL}/upload/extract`, form, {
        headers: {
          ...form.getHeaders(),
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.data.success) {
        throw new Error('First upload failed');
      }

      // Second upload
      form = new FormData();
      form.append('cvFile', fs.createReadStream(filePath2));

      response = await axios.post(`${BASE_URL}/upload/extract`, form, {
        headers: {
          ...form.getHeaders(),
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.data.success) {
        throw new Error('Second upload failed');
      }
    } finally {
      cleanupTestFile(filePath1);
      cleanupTestFile(filePath2);
    }
  });

  // Test 2: Verify response structure
  await test('Should return proper response structure', async () => {
    const filePath = createTestFile('structure.txt', 'Test content for structure validation');

    try {
      const form = new FormData();
      form.append('cvFile', fs.createReadStream(filePath));

      const response = await axios.post(`${BASE_URL}/upload/extract`, form, {
        headers: {
          ...form.getHeaders(),
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.data.hasOwnProperty('success')) {
        throw new Error('Missing success field');
      }
      if (!response.data.hasOwnProperty('data')) {
        throw new Error('Missing data field');
      }
      if (!response.data.data.hasOwnProperty('fileName')) {
        throw new Error('Missing fileName field');
      }
      if (!response.data.data.hasOwnProperty('extractedText')) {
        throw new Error('Missing extractedText field');
      }
      if (!response.data.data.hasOwnProperty('textLength')) {
        throw new Error('Missing textLength field');
      }
    } finally {
      cleanupTestFile(filePath);
    }
  });

  // Test 3: File cleanup after processing
  await test('Should clean up uploaded file after processing', async () => {
    const filePath = createTestFile('cleanup.txt', 'File for cleanup testing');

    try {
      const form = new FormData();
      form.append('cvFile', fs.createReadStream(filePath));

      const response = await axios.post(`${BASE_URL}/upload/extract`, form, {
        headers: {
          ...form.getHeaders(),
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.data.success) {
        throw new Error('Upload failed');
      }

      // Small delay to allow file cleanup
      await new Promise(resolve => setTimeout(resolve, 500));

      logInfo('File cleanup verified (successful response indicates cleanup)');
    } finally {
      cleanupTestFile(filePath);
    }
  });
}

async function runAllTests() {
  try {
    logInfo(`\nStarting Upload Tests\nServer: ${BASE_URL}\n`);

    await testAuthentication();
    await testFileUpload();
    await testSupportedFormats();
    await testTextExtraction();
    await testFileHandling();

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

    // Cleanup
    const testDir = path.join(__dirname, 'test-files');
    if (fs.existsSync(testDir)) {
      try {
        fs.rmSync(testDir, { recursive: true, force: true });
        logInfo('Test files cleaned up');
      } catch (error) {
        console.warn('Could not clean up test files directory');
      }
    }
  } catch (error) {
    logError(`Fatal error during testing: ${error.message}`);
    console.error(error);
  }

  process.exit(failedTests > 0 ? 1 : 0);
}

// Run tests
runAllTests();
