/**
 * Edge Case Test Suite for Internship Tracker
 * Tests backend API, auth flows, database resilience, and boundary conditions
 */

const API_BASE = process.env.API_URL || 'http://localhost:4000';

async function testRunner() {
  console.log(`\n==================================================`);
  console.log(`🚀 STARTING EDGE CASE TEST SUITE`);
  console.log(`Target: ${API_BASE}`);
  console.log(`==================================================\n`);

  let passed = 0;
  let failed = 0;

  function assert(condition, testName, details = '') {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName} ${details ? `(${details})` : ''}`);
      failed++;
    }
  }

  // 1. HEALTH CHECKS
  console.log(`\n--- 1. Health Checks ---`);
  try {
    const res1 = await fetch(`${API_BASE}/health`);
    assert(res1.status === 200, 'GET /health returns 200 OK');
    const res2 = await fetch(`${API_BASE}/api/health`);
    assert(res2.status === 200, 'GET /api/health returns 200 OK');
  } catch (err) {
    assert(false, 'Health endpoints reachable', err.message);
  }

  // 2. AUTHENTICATION EDGE CASES
  console.log(`\n--- 2. Auth Edge Cases ---`);
  let authToken = null;
  let testUserEmail = `edge.test.${Date.now()}@example.com`;
  let receivedOtp = null;

  // 2a: Missing email
  try {
    const res = await fetch(`${API_BASE}/api/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    assert(res.status === 400, 'POST /send-otp with empty body returns 400');
  } catch (e) {
    assert(false, 'Empty send-otp body test', e.message);
  }

  // 2b: Invalid email formats & domain typos (e.g. gmailll.com)
  try {
    const invalidEmails = [
      'notanemail',
      'user@',
      '@domain.com',
      'user@domain',
      'user@gmailll.com', // user-reported typo!
      'user@gmaill.com',
      'user@gamil.com',
      'user@yaho.com',
      'user@hotmial.com',
      'user@tempmail.com', // disposable domain
      'user@fake.comm'     // invalid TLD typo
    ];
    for (const badEmail of invalidEmails) {
      const res = await fetch(`${API_BASE}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: badEmail })
      });
      assert(res.status === 400, `POST /send-otp correctly rejects invalid/typo email "${badEmail}" with 400`);
    }
  } catch (e) {
    assert(false, 'Invalid email format test', e.message);
  }

  // 2c: Non-string email type
  try {
    const res = await fetch(`${API_BASE}/api/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 123456 })
    });
    assert(res.status === 400, 'POST /send-otp with number email returns 400');
  } catch (e) {
    assert(false, 'Non-string email test', e.message);
  }

  // 2d: Valid send-otp
  try {
    const res = await fetch(`${API_BASE}/api/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testUserEmail, name: 'Edge Tester' })
    });
    const data = await res.json();
    assert(res.status === 200 && data.success === true, 'POST /send-otp with valid email returns 200 success');
    receivedOtp = data.previewOtp;
  } catch (e) {
    assert(false, 'Valid send-otp test', e.message);
  }

  // 2e: Verify OTP with wrong code
  try {
    const res = await fetch(`${API_BASE}/api/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testUserEmail, otp: '000000' })
    });
    assert(res.status === 400, 'POST /verify-otp with wrong OTP code returns 400');
  } catch (e) {
    assert(false, 'Wrong OTP verification test', e.message);
  }

  // 2f: Verify OTP with missing fields
  try {
    const res = await fetch(`${API_BASE}/api/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testUserEmail })
    });
    assert(res.status === 400, 'POST /verify-otp with missing OTP returns 400');
  } catch (e) {
    assert(false, 'Missing OTP code test', e.message);
  }

  // 2g: Verify OTP with correct code
  if (receivedOtp) {
    try {
      const res = await fetch(`${API_BASE}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testUserEmail, otp: receivedOtp, name: 'Edge Tester' })
      });
      const data = await res.json();
      assert(res.status === 200 && data.token, 'POST /verify-otp with correct OTP returns JWT token');
      authToken = data.token;
    } catch (e) {
      assert(false, 'Valid OTP verification test', e.message);
    }

    // 2h: Test OTP reuse (one-time use protection)
    try {
      const res = await fetch(`${API_BASE}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testUserEmail, otp: receivedOtp })
      });
      assert(res.status === 400, 'POST /verify-otp reusing already-verified OTP fails with 400');
    } catch (e) {
      assert(false, 'OTP reuse prevention test', e.message);
    }
  }

  // 2i: Profile with no token vs invalid token vs valid token
  try {
    const resNoToken = await fetch(`${API_BASE}/api/auth/me`);
    assert(resNoToken.status === 401, 'GET /api/auth/me without token returns 401 Unauthorized');

    const resBadToken = await fetch(`${API_BASE}/api/auth/me`, {
      headers: { 'Authorization': 'Bearer this-is-an-invalid-garbage-token' }
    });
    assert(resBadToken.status === 401, 'GET /api/auth/me with invalid token returns 401 Unauthorized');

    if (authToken) {
      const resValid = await fetch(`${API_BASE}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      const data = await resValid.json();
      assert(resValid.status === 200 && data.user?.email === testUserEmail, 'GET /api/auth/me with valid token returns user profile');
    }
  } catch (e) {
    assert(false, 'Auth me endpoint tests', e.message);
  }

  // 2j: JWT Registration & Password Login
  console.log(`\n--- 2j. JWT Register & Password Login Tests ---`);
  const jwtTestEmail = `jwt.user.${Date.now()}@example.com`;
  const jwtTestPassword = 'SecurePassword123!';
  let jwtLoginToken = null;

  // Register with missing fields
  try {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: jwtTestEmail })
    });
    assert(res.status === 400, 'POST /api/auth/register with missing password returns 400');
  } catch (e) {
    assert(false, 'Register missing password test', e.message);
  }

  // Register with short password (< 6 chars)
  try {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: jwtTestEmail, password: '123' })
    });
    assert(res.status === 400, 'POST /api/auth/register with short password returns 400');
  } catch (e) {
    assert(false, 'Register short password test', e.message);
  }

  // Register with domain typo (e.g. gmailll.com)
  try {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'baduser@gmailll.com', password: 'ValidPassword123!' })
    });
    const data = await res.json();
    assert(res.status === 400 && data.error.includes('@gmail.com'), 'POST /api/auth/register rejects @gmailll.com with suggested @gmail.com (400)');
  } catch (e) {
    assert(false, 'Register with typo domain test', e.message);
  }

  // Valid registration (requires user to log in)
  try {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: jwtTestEmail, password: jwtTestPassword, name: 'JWT User' })
    });
    const data = await res.json();
    assert(res.status === 201 && data.success && data.user.email === jwtTestEmail, 'POST /api/auth/register creates user account without auto-redirect (201)');
  } catch (e) {
    assert(false, 'Valid registration test', e.message);
  }

  // Duplicate registration
  try {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: jwtTestEmail, password: jwtTestPassword })
    });
    assert(res.status === 409, 'POST /api/auth/register duplicate email returns 409 Conflict');
  } catch (e) {
    assert(false, 'Duplicate registration test', e.message);
  }

  // Login with wrong password
  try {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: jwtTestEmail, password: 'WrongPassword999' })
    });
    assert(res.status === 401, 'POST /api/auth/login with wrong password returns 401 Unauthorized');
  } catch (e) {
    assert(false, 'Login wrong password test', e.message);
  }

  // Login with non-existent email
  try {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'nobody-never-exists@example.com', password: 'password123' })
    });
    assert(res.status === 401, 'POST /api/auth/login with non-existent email returns 401 Unauthorized');
  } catch (e) {
    assert(false, 'Login non-existent email test', e.message);
  }

  // Valid login
  try {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: jwtTestEmail, password: jwtTestPassword })
    });
    const data = await res.json();
    assert(res.status === 200 && data.token && data.user.email === jwtTestEmail, 'POST /api/auth/login with valid password returns 200 with signed JWT token');
    jwtLoginToken = data.token;
  } catch (e) {
    assert(false, 'Valid login test', e.message);
  }

  // Verify JWT token from login with /api/auth/me
  if (jwtLoginToken) {
    try {
      const res = await fetch(`${API_BASE}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${jwtLoginToken}` }
      });
      const data = await res.json();
      assert(res.status === 200 && data.user.email === jwtTestEmail, 'GET /api/auth/me verifies JWT issued by login endpoint');
    } catch (e) {
      assert(false, 'JWT verification with /me test', e.message);
    }
  }

  // 3. INTERNSHIPS ENDPOINT EDGE CASES
  console.log(`\n--- 3. Internships Query & Detail Edge Cases ---`);

  // 3a: Non-numeric page
  try {
    const res = await fetch(`${API_BASE}/api/internships?page=abc`);
    const data = await res.json();
    assert(res.status === 200 && data.pagination.page === 1, 'GET /api/internships?page=abc defaults safely to page 1');
  } catch (e) {
    assert(false, 'Non-numeric page test', e.message);
  }

  // 3b: Negative page
  try {
    const res = await fetch(`${API_BASE}/api/internships?page=-5`);
    const data = await res.json();
    assert(res.status === 200 && data.pagination.page === 1, 'GET /api/internships?page=-5 clamps safely to page 1');
  } catch (e) {
    assert(false, 'Negative page test', e.message);
  }

  // 3c: Outsized limit
  try {
    const res = await fetch(`${API_BASE}/api/internships?limit=99999`);
    const data = await res.json();
    assert(res.status === 200 && data.pagination.limit <= 100, 'GET /api/internships?limit=99999 clamps to max 100');
  } catch (e) {
    assert(false, 'Outsized limit test', e.message);
  }

  // 3d: Invalid enum roleCategory
  try {
    const res = await fetch(`${API_BASE}/api/internships?role=INVALID_ROLE_CATEGORY`);
    assert(res.status === 200, 'GET /api/internships?role=INVALID does NOT crash (returns 200 without enum error)');
  } catch (e) {
    assert(false, 'Invalid roleCategory test', e.message);
  }

  // 3e: Mixed valid and invalid roleCategories
  try {
    const res = await fetch(`${API_BASE}/api/internships?role=SDE,MALICIOUS,DATA`);
    const data = await res.json();
    assert(res.status === 200 && Array.isArray(data.data), 'GET /api/internships?role=SDE,MALICIOUS,DATA filters valid enums safely');
  } catch (e) {
    assert(false, 'Mixed roleCategories test', e.message);
  }

  // 3f: Special characters & SQL injection string in search query
  try {
    const injectionStrings = ["'; DROP TABLE internships; --", '<script>alert("xss")</script>', '%20%27%22', ''];
    for (const sql of injectionStrings) {
      const res = await fetch(`${API_BASE}/api/internships?q=${encodeURIComponent(sql)}`);
      assert(res.status === 200, `GET /api/internships?q=${sql.substring(0, 15)} handles special chars safely`);
    }
  } catch (e) {
    assert(false, 'SQL / XSS injection search query test', e.message);
  }

  // 3g: Invalid duration format
  try {
    const res = await fetch(`${API_BASE}/api/internships?duration=abc`);
    const data = await res.json();
    assert(res.status === 200 && data.data.length > 0, 'GET /api/internships?duration=abc ignores non-numeric duration safely');
  } catch (e) {
    assert(false, 'Invalid duration test', e.message);
  }

  // 3h: Invalid internship ID (string)
  try {
    const res = await fetch(`${API_BASE}/api/internships/not-a-number`);
    assert(res.status === 400, 'GET /api/internships/not-a-number returns 400 Bad Request');
  } catch (e) {
    assert(false, 'String internship ID test', e.message);
  }

  // 3i: Negative internship ID
  try {
    const res = await fetch(`${API_BASE}/api/internships/-10`);
    assert(res.status === 400, 'GET /api/internships/-10 returns 400 Bad Request');
  } catch (e) {
    assert(false, 'Negative internship ID test', e.message);
  }

  // 3j: Non-existent internship ID
  try {
    const res = await fetch(`${API_BASE}/api/internships/99999999`);
    assert(res.status === 404, 'GET /api/internships/99999999 returns 404 Not Found');
  } catch (e) {
    assert(false, 'Non-existent internship ID test', e.message);
  }

  // 3k: Valid internship ID
  let validInternshipId = null;
  try {
    const listRes = await fetch(`${API_BASE}/api/internships?limit=1`);
    const listData = await listRes.json();
    if (listData.data?.length > 0) {
      validInternshipId = listData.data[0].id;
      const detailRes = await fetch(`${API_BASE}/api/internships/${validInternshipId}`);
      assert(detailRes.status === 200, `GET /api/internships/${validInternshipId} returns 200 with details`);
    }
  } catch (e) {
    assert(false, 'Valid internship ID fetch test', e.message);
  }

  // 4. COMPANIES ENDPOINT EDGE CASES
  console.log(`\n--- 4. Companies Edge Cases ---`);

  // 4a: Uppercase company slug
  try {
    const res = await fetch(`${API_BASE}/api/companies/GOOGLE`);
    assert(res.status === 200, 'GET /api/companies/GOOGLE (uppercase) resolves case-insensitively');
  } catch (e) {
    assert(false, 'Uppercase slug test', e.message);
  }

  // 4b: Non-existent company slug
  try {
    const res = await fetch(`${API_BASE}/api/companies/completely-non-existent-company-slug-xyz`);
    assert(res.status === 404, 'GET /api/companies/non-existent returns 404 Not Found');
  } catch (e) {
    assert(false, 'Non-existent company slug test', e.message);
  }

  // 5. BOOKMARKS ENDPOINT EDGE CASES
  console.log(`\n--- 5. Bookmarks Edge Cases ---`);

  // 5a: Create bookmark without auth
  try {
    const res = await fetch(`${API_BASE}/api/bookmarks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ internshipId: validInternshipId || 1 })
    });
    assert(res.status === 401, 'POST /api/bookmarks without auth returns 401');
  } catch (e) {
    assert(false, 'Unauthenticated bookmark create test', e.message);
  }

  if (authToken && validInternshipId) {
    // 5b: Non-numeric internshipId
    try {
      const res = await fetch(`${API_BASE}/api/bookmarks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ internshipId: 'not-a-number' })
      });
      assert(res.status === 400, 'POST /api/bookmarks with non-numeric internshipId returns 400');
    } catch (e) {
      assert(false, 'Non-numeric bookmark ID test', e.message);
    }

    // 5c: Non-existent internshipId
    try {
      const res = await fetch(`${API_BASE}/api/bookmarks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ internshipId: 9999999 })
      });
      assert(res.status === 404, 'POST /api/bookmarks with non-existent internshipId returns 404 (FK constraint guarded)');
    } catch (e) {
      assert(false, 'Non-existent bookmark internshipId test', e.message);
    }

    // 5d: Valid bookmark create
    try {
      const res = await fetch(`${API_BASE}/api/bookmarks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ internshipId: validInternshipId })
      });
      assert(res.status === 201, 'POST /api/bookmarks with valid ID creates bookmark (201)');
    } catch (e) {
      assert(false, 'Valid bookmark create test', e.message);
    }

    // 5e: Duplicate bookmark create (idempotency check)
    try {
      const res = await fetch(`${API_BASE}/api/bookmarks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ internshipId: validInternshipId })
      });
      assert(res.status === 201, 'POST /api/bookmarks duplicate bookmark upserts idempotently without error');
    } catch (e) {
      assert(false, 'Duplicate bookmark upsert test', e.message);
    }

    // 5f: Get user bookmarks
    try {
      const res = await fetch(`${API_BASE}/api/bookmarks`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      const data = await res.json();
      assert(res.status === 200 && data.data.some(b => b.internshipId === validInternshipId), 'GET /api/bookmarks returns user bookmarks list');
    } catch (e) {
      assert(false, 'Get bookmarks test', e.message);
    }

    // 5g: Delete bookmark with invalid ID
    try {
      const res = await fetch(`${API_BASE}/api/bookmarks/abc`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      assert(res.status === 400, 'DELETE /api/bookmarks/abc returns 400');
    } catch (e) {
      assert(false, 'Delete bookmark invalid ID test', e.message);
    }

    // 5h: Delete bookmark with valid ID
    try {
      const res = await fetch(`${API_BASE}/api/bookmarks/${validInternshipId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      assert(res.status === 200, 'DELETE /api/bookmarks/:id removes bookmark (200)');
    } catch (e) {
      assert(false, 'Delete bookmark valid ID test', e.message);
    }
  }

  // 6. MALFORMED JSON BODY HANDLING
  console.log(`\n--- 6. Malformed JSON Body Handling ---`);
  try {
    const res = await fetch(`${API_BASE}/api/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{ "invalid_json_payload": '
    });
    assert(res.status === 400, 'Sending malformed JSON returns 400 Bad Request (handled by errorHandler)');
  } catch (e) {
    assert(false, 'Malformed JSON test', e.message);
  }

  console.log(`\n==================================================`);
  console.log(`📊 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log(`==================================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

testRunner().catch(err => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
