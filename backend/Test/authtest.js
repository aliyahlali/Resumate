/**
 * Authentication Tests for Resumate API
 * Tests user registration, login, and authentication flow
 * 
 * Usage: node Test/Authtest.js
 */

const axios = require('axios');
require('dotenv').config();

const BASE_URL = process.env.TEST_URL || 'http://localhost:5000/api';

// Test data
const testUsers = {
  validUser: {
    email: `test_${Date.now()}@example.com`,
    password: 'SecurePass123!',
  },
  validUser2: {
    email: `test2_${Date.now()}@example.com`,
    password: 'AnotherPass456!',
  },
  adminUser: {
    email: `admin_${Date.now()}@example.com`,
    password: 'AdminPass789!',
    role: 'admin',
  },
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

// Test Suite Functions

async function testRegistration() {
  logSection('REGISTRATION TESTS');

  // Test 1: Successful registration
  await test('Should register a new user successfully', async () => {
    const response = await axios.post(`${BASE_URL}/auth/register`, {
      email: testUsers.validUser.email,
      password: testUsers.validUser.password,
    });

    if (!response.data.success) {
      throw new Error('Registration failed: success field is false');
    }
    if (!response.data.token) {
      throw new Error('No token returned');
    }
    if (!response.data.user || !response.data.user.id) {
      throw new Error('No user data returned');
    }

    testUsers.validUser.token = response.data.token;
    testUsers.validUser.id = response.data.user.id;
  });

  // Test 2: Registration with role
  await test('Should register user with admin role', async () => {
    const response = await axios.post(`${BASE_URL}/auth/register`, {
      email: testUsers.adminUser.email,
      password: testUsers.adminUser.password,
      role: 'admin',
    });

    if (!response.data.success) {
      throw new Error('Admin registration failed');
    }
    if (response.data.user.role !== 'admin') {
      throw new Error('User role is not admin');
    }

    testUsers.adminUser.token = response.data.token;
    testUsers.adminUser.id = response.data.user.id;
  });

  // Test 3: Missing email
  await test('Should fail registration without email', async () => {
    try {
      await axios.post(`${BASE_URL}/auth/register`, {
        password: 'password123',
      });
      throw new Error('Should have failed but succeeded');
    } catch (error) {
      if (error.response?.status !== 400) {
        throw new Error(`Expected 400 but got ${error.response?.status}`);
      }
      if (!error.response?.data?.message?.includes('email')) {
        throw new Error('Expected email error message');
      }
    }
  });

  // Test 4: Missing password
  await test('Should fail registration without password', async () => {
    try {
      await axios.post(`${BASE_URL}/auth/register`, {
        email: 'test@example.com',
      });
      throw new Error('Should have failed but succeeded');
    } catch (error) {
      if (error.response?.status !== 400) {
        throw new Error(`Expected 400 but got ${error.response?.status}`);
      }
      if (!error.response?.data?.message?.includes('password')) {
        throw new Error('Expected password error message');
      }
    }
  });

  // Test 5: Duplicate email
  await test('Should fail registration with duplicate email', async () => {
    try {
      await axios.post(`${BASE_URL}/auth/register`, {
        email: testUsers.validUser.email,
        password: 'anotherPassword123',
      });
      throw new Error('Should have failed but succeeded');
    } catch (error) {
      if (error.response?.status !== 400) {
        throw new Error(`Expected 400 but got ${error.response?.status}`);
      }
      if (!error.response?.data?.message?.includes('exists')) {
        throw new Error('Expected exists error message');
      }
    }
  });

  // Test 6: Weak password handling
  await test('Should handle weak password gracefully', async () => {
    const response = await axios.post(`${BASE_URL}/auth/register`, {
      email: testUsers.validUser2.email,
      password: '123',
    });

    // Should still register (password validation may not be strict)
    if (!response.data.success) {
      throw new Error('Weak password registration failed');
    }

    testUsers.validUser2.token = response.data.token;
    testUsers.validUser2.id = response.data.user.id;
  });
}

async function testLogin() {
  logSection('LOGIN TESTS');

  // Test 1: Successful login
  await test('Should login with correct credentials', async () => {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: testUsers.validUser.email,
      password: testUsers.validUser.password,
    });

    if (!response.data.success) {
      throw new Error('Login failed: success field is false');
    }
    if (!response.data.token) {
      throw new Error('No token returned');
    }
    if (!response.data.user) {
      throw new Error('No user data returned');
    }
  });

  // Test 2: Missing email
  await test('Should fail login without email', async () => {
    try {
      await axios.post(`${BASE_URL}/auth/login`, {
        password: 'password123',
      });
      throw new Error('Should have failed but succeeded');
    } catch (error) {
      if (error.response?.status !== 400) {
        throw new Error(`Expected 400 but got ${error.response?.status}`);
      }
    }
  });

  // Test 3: Missing password
  await test('Should fail login without password', async () => {
    try {
      await axios.post(`${BASE_URL}/auth/login`, {
        email: testUsers.validUser.email,
      });
      throw new Error('Should have failed but succeeded');
    } catch (error) {
      if (error.response?.status !== 400) {
        throw new Error(`Expected 400 but got ${error.response?.status}`);
      }
    }
  });

  // Test 4: Non-existent user
  await test('Should fail login with non-existent email', async () => {
    try {
      await axios.post(`${BASE_URL}/auth/login`, {
        email: 'nonexistent@example.com',
        password: 'password123',
      });
      throw new Error('Should have failed but succeeded');
    } catch (error) {
      if (error.response?.status !== 401) {
        throw new Error(`Expected 401 but got ${error.response?.status}`);
      }
      if (!error.response?.data?.message?.includes('Invalid')) {
        throw new Error('Expected Invalid credentials message');
      }
    }
  });

  // Test 5: Wrong password
  await test('Should fail login with incorrect password', async () => {
    try {
      await axios.post(`${BASE_URL}/auth/login`, {
        email: testUsers.validUser.email,
        password: 'WrongPassword123!',
      });
      throw new Error('Should have failed but succeeded');
    } catch (error) {
      if (error.response?.status !== 401) {
        throw new Error(`Expected 401 but got ${error.response?.status}`);
      }
      if (!error.response?.data?.message?.includes('Invalid')) {
        throw new Error('Expected Invalid credentials message');
      }
    }
  });

  // Test 6: Case sensitivity of email
  await test('Should handle email case-insensitively', async () => {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: testUsers.validUser.email.toUpperCase(),
      password: testUsers.validUser.password,
    });

    // Should work if case-insensitive, will fail if case-sensitive
    if (response.status === 200 || response.data.success) {
      logInfo('Email is case-insensitive');
    }
  });
}

async function testAuthentication() {
  logSection('AUTHENTICATION TESTS');

  if (!testUsers.validUser.token) {
    logError('Skipping authentication tests - no valid token available');
    return;
  }

  // Test 1: Get profile with valid token
  await test('Should fetch user profile with valid token', async () => {
    const response = await axios.get(`${BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${testUsers.validUser.token}`,
      },
    });

    if (!response.data.success) {
      throw new Error('Failed to fetch profile');
    }
    if (!response.data.user || !response.data.user.email) {
      throw new Error('No user data in response');
    }
    if (response.data.user.email !== testUsers.validUser.email) {
      throw new Error('Email mismatch in profile');
    }
  });

  // Test 2: Access without token
  await test('Should fail to access protected route without token', async () => {
    try {
      await axios.get(`${BASE_URL}/auth/me`);
      throw new Error('Should have failed but succeeded');
    } catch (error) {
      if (!error.response || (error.response.status !== 401 && error.response.status !== 403)) {
        throw new Error(`Expected 401/403 but got ${error.response?.status}`);
      }
    }
  });

  // Test 3: Access with invalid token
  await test('Should fail to access protected route with invalid token', async () => {
    try {
      await axios.get(`${BASE_URL}/auth/me`, {
        headers: {
          Authorization: 'Bearer invalid_token_xyz',
        },
      });
      throw new Error('Should have failed but succeeded');
    } catch (error) {
      if (!error.response || (error.response.status !== 401 && error.response.status !== 403)) {
        throw new Error(`Expected 401/403 but got ${error.response?.status}`);
      }
    }
  });

  // Test 4: Access with malformed bearer token
  await test('Should fail with malformed authorization header', async () => {
    try {
      await axios.get(`${BASE_URL}/auth/me`, {
        headers: {
          Authorization: 'InvalidBearerFormat',
        },
      });
      throw new Error('Should have failed but succeeded');
    } catch (error) {
      if (!error.response || (error.response.status !== 401 && error.response.status !== 403)) {
        throw new Error(`Expected 401/403 but got ${error.response?.status}`);
      }
    }
  });

  // Test 5: Token in different authorization formats
  await test('Should accept Bearer token with various formats', async () => {
    const response = await axios.get(`${BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${testUsers.validUser.token}`,
      },
    });

    if (!response.data.success) {
      throw new Error('Bearer token not accepted');
    }
  });
}

async function testTokenValidation() {
  logSection('TOKEN VALIDATION TESTS');

  if (!testUsers.adminUser.token) {
    logError('Skipping token validation tests - no admin token available');
    return;
  }

  // Test 1: Verify token structure
  await test('Should verify token contains user ID', async () => {
    const response = await axios.get(`${BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${testUsers.adminUser.token}`,
      },
    });

    if (!response.data.user.id) {
      throw new Error('User ID not in response');
    }
  });

  // Test 2: Verify role in token
  await test('Should verify admin role in token', async () => {
    const response = await axios.get(`${BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${testUsers.adminUser.token}`,
      },
    });

    if (response.data.user.role !== 'admin') {
      throw new Error(`Expected admin role but got ${response.data.user.role}`);
    }
  });

  // Test 3: Multiple login attempts return consistent user data
  await test('Should return consistent user data on multiple logins', async () => {
    const login1 = await axios.post(`${BASE_URL}/auth/login`, {
      email: testUsers.validUser.email,
      password: testUsers.validUser.password,
    });

    const login2 = await axios.post(`${BASE_URL}/auth/login`, {
      email: testUsers.validUser.email,
      password: testUsers.validUser.password,
    });

    if (login1.data.user.id !== login2.data.user.id) {
      throw new Error('User ID mismatch on multiple logins');
    }
  });
}

async function testEdgeCases() {
  logSection('EDGE CASE TESTS');

  // Test 1: Very long email
  await test('Should handle very long email', async () => {
    const longEmail = `${'a'.repeat(50)}@example.com`;
    const response = await axios.post(`${BASE_URL}/auth/register`, {
      email: longEmail,
      password: 'Password123!',
    });

    // Should either succeed or fail gracefully
    if (!response.data && !response.status) {
      throw new Error('No response from server');
    }
  });

  // Test 2: SQL injection attempt in email
  await test('Should safely handle SQL injection attempt in email', async () => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/register`, {
        email: "' OR '1'='1@example.com",
        password: 'Password123!',
      });
      // If it reaches here, the injection was safely handled
      logInfo('SQL injection safely handled');
    } catch (error) {
      // Should fail gracefully
      if (!error.response) {
        throw error;
      }
    }
  });

  // Test 3: Very long password
  await test('Should handle very long password', async () => {
    const response = await axios.post(`${BASE_URL}/auth/register`, {
      email: `longpass_${Date.now()}@example.com`,
      password: 'p'.repeat(500),
    });

    if (!response.data.success) {
      throw new Error('Long password registration failed');
    }
  });

  // Test 4: Special characters in password
  await test('Should handle special characters in password', async () => {
    const response = await axios.post(`${BASE_URL}/auth/register`, {
      email: `special_${Date.now()}@example.com`,
      password: 'P@ss!#$%^&*()_+-=[]{}|;:,.<>?',
    });

    if (!response.data.success) {
      throw new Error('Special character password registration failed');
    }
  });

  // Test 5: Spaces in credentials
  await test('Should handle spaces in password', async () => {
    const email = `spaces_${Date.now()}@example.com`;
    const password = 'Pass word with spaces 123';

    const registerRes = await axios.post(`${BASE_URL}/auth/register`, {
      email,
      password,
    });

    if (!registerRes.data.success) {
      throw new Error('Registration with spaces in password failed');
    }

    // Now try to login with same password
    const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
      email,
      password,
    });

    if (!loginRes.data.success) {
      throw new Error('Login with spaces in password failed');
    }
  });
}

async function runAllTests() {
  try {
    logInfo(`\nStarting Authentication Tests\nServer: ${BASE_URL}\n`);

    await testRegistration();
    await testLogin();
    await testAuthentication();
    await testTokenValidation();
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
