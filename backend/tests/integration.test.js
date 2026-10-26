/**
 * Ultimate Hound Club - Local Integration & Verification Test Suite
 * Validates:
 * 1. Database-backed Registration & Login
 * 2. Rejection of fake Super Admin login & master-password bypass
 * 3. JWT Bearer token authentication & invalid token handling
 * 4. User role elevation protection (anti-self-promotion)
 * 5. Role-based scope restrictions (State Admin & Club Admin)
 * 6. Club claims lifecycle & persistence
 * 7. Membership registration & honest pending status
 * 8. Honest payment gateway status reporting
 */

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const http = require('http');
const jwt = require('jsonwebtoken');
const app = require('../server');
const { JWT_SECRET } = require('../middlewares/authMiddleware');

let server;
let baseUrl;
const results = [];

function request(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, baseUrl);
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const data = body ? JSON.stringify(body) : null;
    if (data) headers['Content-Length'] = Buffer.byteLength(data);

    const req = http.request(url, { method, headers }, (res) => {
      let responseBody = '';
      res.on('data', chunk => responseBody += chunk);
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(responseBody);
        } catch (_) {
          json = responseBody;
        }
        resolve({ status: res.statusCode, headers: res.headers, body: json });
      });
    });

    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

function assert(condition, testName, details = '') {
  if (condition) {
    results.push({ name: testName, passed: true, details });
    console.log(`  PASS: ${testName}`);
  } else {
    results.push({ name: testName, passed: false, details });
    console.error(`  FAIL: ${testName} - ${details}`);
  }
}

async function runTests() {
  console.log('\n======================================================');
  console.log('   ULTIMATE HOUND CLUB - LOCAL INTEGRATION TEST SUITE');
  console.log('======================================================\n');

  // Start test server on dynamic/ephemeral port
  server = app.listen(0);
  const port = server.address().port;
  baseUrl = `http://localhost:${port}`;
  console.log(`Test server running locally on ${baseUrl}\n`);

  try {
    // ---------------------------------------------------------
    // TEST 1: Database-backed Registration & Login
    // ---------------------------------------------------------
    console.log('[1/8] Testing Database-backed Registration & Login...');
    const testEmail = `test.member.${Date.now()}@example.com`;
    const regRes = await request('POST', '/api/v1/auth/register', {
      name: 'Integration Test User',
      email: testEmail,
      password: 'SecureTestPassword123!',
      role: 'SUPER_ADMIN', // Attempt privilege escalation
      phone: '(555) 019-9999'
    });

    assert(regRes.status === 201, 'Registration returns HTTP 201 Created', `Got status ${regRes.status}`);
    assert(regRes.body?.data?.user?.role === 'MEMBER', 'Self-registration restricts role to MEMBER (anti-privilege escalation)', `Role: ${regRes.body?.data?.user?.role}`);
    assert(Boolean(regRes.body?.data?.token), 'Registration returns valid JWT bearer token');

    const memberToken = regRes.body?.data?.token;

    // Login with registered credentials
    const loginRes = await request('POST', '/api/v1/auth/login', {
      email: testEmail,
      password: 'SecureTestPassword123!'
    });
    assert(loginRes.status === 200, 'Login with real DB credentials returns HTTP 200 OK', `Got status ${loginRes.status}`);
    assert(loginRes.body?.data?.user?.email === testEmail, 'Login returns authenticated user record matching DB');

    // ---------------------------------------------------------
    // TEST 2: Rejection of Fake Super Admin Login & Master-Password Bypass
    // ---------------------------------------------------------
    console.log('\n[2/8] Testing Removal of Fake Super Admin Login & Bypass...');
    const fakeAdminRes = await request('POST', '/api/v1/auth/login', {
      email: 'nonexistent.random.user@hackers.org',
      password: 'Password123!'
    });
    assert(fakeAdminRes.status === 401, 'Non-existent user rejected with HTTP 401 (no fake admin fallback)', `Got status ${fakeAdminRes.status}`);
    assert(fakeAdminRes.body?.error?.code === 'INVALID_CREDENTIALS', 'Error code is INVALID_CREDENTIALS');

    const wrongPassRes = await request('POST', '/api/v1/auth/login', {
      email: testEmail,
      password: 'WrongPassword123!'
    });
    assert(wrongPassRes.status === 401, 'Invalid password rejected with HTTP 401');

    const masterPassBypassRes = await request('POST', '/api/v1/auth/login', {
      email: testEmail,
      password: '123'
    });
    assert(masterPassBypassRes.status === 401, 'Master password bypass "123" rejected with HTTP 401');

    // ---------------------------------------------------------
    // TEST 3: JWT Bearer Token Handling & Profile
    // ---------------------------------------------------------
    console.log('\n[3/8] Testing JWT Bearer Token Handling & Profile...');
    const unauthedProfileRes = await request('GET', '/api/v1/auth/me');
    assert(unauthedProfileRes.status === 401, 'Unauthenticated /auth/me rejected with HTTP 401');

    const invalidTokenRes = await request('GET', '/api/v1/auth/me', null, 'invalid.tampered.token');
    assert(invalidTokenRes.status === 401, 'Invalid JWT token rejected with HTTP 401');

    const authedProfileRes = await request('GET', '/api/v1/auth/me', null, memberToken);
    assert(authedProfileRes.status === 200, 'Valid JWT returns HTTP 200 profile', `Got status ${authedProfileRes.status}`);
    assert(authedProfileRes.body?.data?.email === testEmail, 'Profile data matches authenticated user token');

    // ---------------------------------------------------------
    // TEST 4: Role Elevation Protection (Anti-Self-Promotion)
    // ---------------------------------------------------------
    console.log('\n[4/8] Testing Role Elevation Protection...');
    const unauthedRoleUpdate = await request('PUT', `/api/v1/users/${regRes.body?.data?.user?.id}/role`, {
      role: 'SUPER_ADMIN'
    });
    assert(unauthedRoleUpdate.status === 401, 'Unauthenticated role promotion rejected with HTTP 401');

    const memberRoleUpdate = await request('PUT', `/api/v1/users/${regRes.body?.data?.user?.id}/role`, {
      role: 'SUPER_ADMIN'
    }, memberToken);
    assert(memberRoleUpdate.status === 403, 'MEMBER attempting role promotion rejected with HTTP 403 Forbidden');

    // ---------------------------------------------------------
    // TEST 5: Role-based Scope Restrictions (State Admin & Club Admin)
    // ---------------------------------------------------------
    console.log('\n[5/8] Testing Role-based Scope Restrictions...');
    const stateAdminToken = jwt.sign(
      { id: 'usr-state-test', name: 'Texas Admin', email: 'tx.admin@example.com', role: 'STATE_ADMIN', stateCode: 'TX', state: 'Texas' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    const stateAdminMembersRes = await request('GET', '/api/v1/members', null, stateAdminToken);
    assert(stateAdminMembersRes.status === 200, 'State Admin can query /api/v1/members');
    const allTexas = Array.isArray(stateAdminMembersRes.body?.data) && stateAdminMembersRes.body.data.every(m => !m.state || m.state.toLowerCase().includes('texas') || m.state === 'TX');
    assert(allTexas, 'State Admin query is scoped strictly to their state (Texas)');

    const clubAdminToken = jwt.sign(
      { id: 'usr-club-test', name: 'Oak Ridge Admin', email: 'club.admin@example.com', role: 'CLUB_ADMIN', club: 'Oak Ridge Hunting Club', clubId: 'club-1' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    const clubAdminMembersRes = await request('GET', '/api/v1/members', null, clubAdminToken);
    assert(clubAdminMembersRes.status === 200, 'Club Admin can query /api/v1/members');

    // Unauthorized club update
    const unauthorizedClubUpdate = await request('PUT', '/api/v1/clubs/club-2', { name: 'Compromised Club' }, clubAdminToken);
    assert(unauthorizedClubUpdate.status === 403, 'Club Admin cannot modify a club outside their scope (returns HTTP 403)');

    // ---------------------------------------------------------
    // TEST 6: Real Club Claims Lifecycle & Persistence
    // ---------------------------------------------------------
    console.log('\n[6/8] Testing Club Claims Lifecycle & Persistence...');
    const claimsGetRes = await request('GET', '/api/v1/club-claims');
    assert(claimsGetRes.status === 200, 'GET /api/v1/club-claims returns HTTP 200');
    assert(Array.isArray(claimsGetRes.body?.data), 'Club claims returns an array of claims');

    const testClaimId = `CLM-TST-${Date.now().toString().slice(-4)}`;
    const newClaimRes = await request('POST', '/api/v1/club-claims', {
      id: testClaimId,
      club: 'Integration Test Hunting Association',
      state: 'TX',
      applicant: 'Test Applicant',
      email: 'applicant@example.com',
      phone: '(555) 123-4567',
      message: 'Charter verification for test.'
    });
    assert(newClaimRes.status === 201, 'POST /api/v1/club-claims creates claim with HTTP 201');
    assert(newClaimRes.body?.data?.claimStatus === 'Pending', 'New claim starts in Pending status');

    const approveClaimRes = await request('PUT', `/api/v1/club-claims/${testClaimId}`, {
      claimStatus: 'Approved'
    });
    assert(approveClaimRes.status === 200, 'PUT /api/v1/club-claims/:id updates claim with HTTP 200');
    assert(approveClaimRes.body?.data?.claimStatus === 'Approved', 'Claim status successfully updated to Approved');

    // ---------------------------------------------------------
    // TEST 7: Membership Registration & Honest Pending Status
    // ---------------------------------------------------------
    console.log('\n[7/8] Testing Membership Registration & Honest Status...');
    const memberRegRes = await request('POST', '/api/v1/members', {
      name: 'Honest Membership Candidate',
      email: `candidate.${Date.now()}@example.com`,
      phone: '(555) 888-0192',
      state: 'Tennessee',
      club: 'Oak Ridge Hunting Club',
      duesAmount: 35.0
    });
    assert(memberRegRes.status === 201, 'POST /api/v1/members returns HTTP 201');
    assert(memberRegRes.body?.data?.status === 'Pending Payment Verification', 'Membership status honestly defaults to Pending Payment Verification');

    // ---------------------------------------------------------
    // TEST 8: Honest Payment Gateway Status Reporting
    // ---------------------------------------------------------
    console.log('\n[8/8] Testing Honest Payment Gateway Status Reporting...');
    const paymentConfigRes = await request('GET', '/api/v1/payments/config');
    assert(paymentConfigRes.status === 200, 'GET /api/v1/payments/config returns HTTP 200');
    assert(paymentConfigRes.body?.isConfigured === false, 'Payment gateway configuration honestly reports isConfigured = false');
    assert(paymentConfigRes.body?.status === 'SANDBOX_PENDING_GATEWAY', 'Status honestly indicates sandbox/pending gateway');

    const chargeRes = await request('POST', '/api/v1/payments/charge', {
      amount: 45.00,
      customerName: 'Test Member',
      email: 'test@example.com'
    });
    assert(chargeRes.status === 200, 'POST /api/v1/payments/charge returns HTTP 200');
    assert(chargeRes.body?.status === 'SIMULATED_TEST', 'Transaction status clearly marked as SIMULATED_TEST');
    assert(chargeRes.body?.isLiveCharge === false, 'isLiveCharge is explicitly false');

  } catch (err) {
    console.error('Fatal test error:', err);
  } finally {
    if (server) {
      server.close();
    }
  }

  // Summary
  console.log('\n------------------------------------------------------');
  const total = results.length;
  const passed = results.filter(r => r.passed).length;
  const failed = total - passed;
  console.log(`TOTAL TESTS: ${total} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log('------------------------------------------------------\n');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests();
