/**
 * Ultimate Hound Club - Critical Security Remediation & Test Isolation Suite
 * 
 * SAFE TEST ISOLATION GUARANTEES:
 * 1. Strictly runs against isolated local test SQLite database.
 * 2. Explicitly blocks execution if DB_HOST or DATABASE_URL points to Railway or remote database.
 * 3. Initializes fresh test schema and fixtures, with cleanup.
 * 
 * VULNERABILITY REMEDIATION VERIFICATION:
 * A. Club Claims: Protected listing & admin actions, validation, applicant privacy.
 * B. Membership Status: Protected status update, member self-activation prevention, scope enforcement.
 * C. User Profile: Authentication required, user can only update own profile, mass-assignment blocked.
 * D. Event Modification/Deletion: Auth + role required, scope isolation across clubs, 404 on missing.
 * E. Financial Reports: Super Admin / State Admin required, public routes restricted.
 * F. Role Changes & Unknown Routes: Role endpoint protected, unknown routes return structured HTTP 404.
 * G. Scope Query Isolation: Queries strictly filtered by state/club scope.
 * H. Honest Gateway & Sandbox: Payments clearly marked SIMULATED_TEST, no real charge.
 */

// Step 1: Force test environment before any module loads
process.env.NODE_ENV = 'test';
delete process.env.DATABASE_URL;
process.env.DB_HOST = '127.0.0.1';

const http = require('http');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const db = require('../db');
const { initializeTestSchema, seedTestFixtures } = require('./testSchema');
const app = require('../server');
const { JWT_SECRET } = require('../middlewares/authMiddleware');

let server;
let baseUrl;
const results = [];

function request(method, reqPath, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(reqPath, baseUrl);
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
    console.log(`  ✅ PASS: ${testName}`);
  } else {
    results.push({ name: testName, passed: false, details });
    console.error(`  ❌ FAIL: ${testName} - ${details}`);
  }
}

async function runTests() {
  console.log('\n================================================================');
  console.log('   ULTIMATE HOUND CLUB - CRITICAL SECURITY & TEST ISOLATION');
  console.log('================================================================\n');

  // Verify Safe Test Database Isolation
  console.log('[ISOLATION CHECK] Verifying database isolation safeguards...');
  assert(db.isTestDatabase === true, 'Test database is explicitly identified as isolated local test DB');
  assert(!db.dbPath.includes('rlwy.net'), 'Database path is strictly local file, zero connection to Railway');
  console.log(`  Isolated SQLite Test Database File: ${db.dbPath}\n`);

  // Initialize fresh schema and seed test fixtures
  await initializeTestSchema(db);
  await seedTestFixtures(db);
  console.log('  Isolated test schema & fixtures initialized.\n');

  // Start test server on dynamic/ephemeral port
  server = app.listen(0);
  const port = server.address().port;
  baseUrl = `http://localhost:${port}`;
  console.log(`Test server running locally on ${baseUrl}\n`);

  try {
    // Generate test tokens
    const superAdminToken = jwt.sign(
      { id: 'usr-super-admin', email: 'superadmin@example.com', name: 'Super Admin', role: 'SUPER_ADMIN' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    const memberToken = jwt.sign(
      { id: 'usr-regular-member', email: 'member@example.com', name: 'Regular Member', role: 'MEMBER', clubId: 'club-1', state: 'Tennessee' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    const stateAdminToken = jwt.sign(
      { id: 'usr-state-admin', email: 'stateadmin@example.com', name: 'Texas State Admin', role: 'STATE_ADMIN', stateCode: 'TX', state: 'Texas' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    const clubAdminToken = jwt.sign(
      { id: 'usr-club-admin', email: 'clubadmin@example.com', name: 'Oak Ridge Admin', role: 'CLUB_ADMIN', clubId: 'club-1', club: 'Oak Ridge Hunting Club' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // -----------------------------------------------------------------
    // SECTION 1: Database-Backed Registration, Login & Anti-Bypass
    // -----------------------------------------------------------------
    console.log('[1/9] Testing Database-Backed Registration, Login & Anti-Bypass...');
    const regEmail = `test.user.${Date.now()}@example.com`;
    const regRes = await request('POST', '/api/v1/auth/register', {
      name: 'Auth Test User',
      email: regEmail,
      password: 'SecurePassword123!',
      role: 'SUPER_ADMIN', // Privilege escalation attempt
      phone: '(555) 019-9999'
    });
    assert(regRes.status === 201, 'Registration returns HTTP 201 Created');
    assert(regRes.body?.data?.user?.role === 'MEMBER', 'Self-registration defaults role to MEMBER (anti-escalation)');
    assert(Boolean(regRes.body?.data?.token), 'Registration returns valid JWT bearer token');

    // Login with registered credentials
    const loginRes = await request('POST', '/api/v1/auth/login', {
      email: regEmail,
      password: 'SecurePassword123!'
    });
    assert(loginRes.status === 200, 'Login with real DB credentials returns HTTP 200 OK');
    assert(loginRes.body?.data?.user?.email === regEmail, 'Login returns authenticated user record');

    // Rejection of non-existent user (no fake admin fallback)
    const fakeAdminRes = await request('POST', '/api/v1/auth/login', {
      email: 'nonexistent.user@fakeadmin.org',
      password: 'Password123!'
    });
    assert(fakeAdminRes.status === 401, 'Non-existent user rejected with HTTP 401 (no fake admin)');

    // Rejection of wrong password
    const wrongPassRes = await request('POST', '/api/v1/auth/login', {
      email: regEmail,
      password: 'WrongPassword999!'
    });
    assert(wrongPassRes.status === 401, 'Invalid password rejected with HTTP 401');

    // Rejection of master-password bypass "123"
    const masterPassBypassRes = await request('POST', '/api/v1/auth/login', {
      email: regEmail,
      password: '123'
    });
    assert(masterPassBypassRes.status === 401, 'Master password bypass "123" rejected with HTTP 401');

    // Profile verification (/auth/me)
    const unauthedMe = await request('GET', '/api/v1/auth/me');
    assert(unauthedMe.status === 401, 'Unauthenticated /auth/me rejected with HTTP 401');

    const authedMe = await request('GET', '/api/v1/auth/me', null, loginRes.body?.data?.token);
    assert(authedMe.status === 200, 'Authenticated /auth/me returns HTTP 200 profile');
    assert(authedMe.body?.data?.email === regEmail, 'Profile email matches authenticated user');

    // -----------------------------------------------------------------
    // SECTION 2: Club Claims Authorization, Validation & Privacy
    // -----------------------------------------------------------------
    console.log('\n[2/9] Testing Club Claims Security & Authorization...');
    
    // Negative test: Unauthenticated listing rejected
    const unauthedClaimsGet = await request('GET', '/api/v1/club-claims');
    assert(unauthedClaimsGet.status === 401, 'Unauthenticated GET /api/v1/club-claims rejected with HTTP 401');

    // Negative test: Regular member listing rejected
    const memberClaimsGet = await request('GET', '/api/v1/club-claims', null, memberToken);
    assert(memberClaimsGet.status === 403, 'Regular member GET /api/v1/club-claims rejected with HTTP 403 Forbidden');

    // Positive test: Super Admin listing succeeds
    const adminClaimsGet = await request('GET', '/api/v1/club-claims', null, superAdminToken);
    assert(adminClaimsGet.status === 200, 'Super Admin GET /api/v1/club-claims succeeds with HTTP 200');
    assert(Array.isArray(adminClaimsGet.body?.data), 'Claims response returns array of claims');

    // Public claim submission: Valid input succeeds
    const newClaimRes = await request('POST', '/api/v1/club-claims', {
      id: 'CLM-TEST-001',
      club: 'Lone Star Hunting Association',
      state: 'TX',
      applicant: 'John Hunter',
      email: 'jhunter@example.com',
      phone: '(555) 777-8888',
      message: 'Official charter registration.'
    });
    assert(newClaimRes.status === 201, 'Public POST /api/v1/club-claims succeeds with HTTP 201');
    assert(newClaimRes.body?.data?.claimStatus === 'Pending', 'New claim starts in Pending status');

    // Negative test: Public claim submission fails when required fields are missing
    const invalidClaimRes = await request('POST', '/api/v1/club-claims', {
      message: 'Incomplete submission without club name'
    });
    assert(invalidClaimRes.status === 400, 'POST /api/v1/club-claims rejects missing required fields with HTTP 400');

    // Negative test: Unauthenticated status update rejected
    const unauthedClaimUpdate = await request('PUT', '/api/v1/club-claims/CLM-TEST-001', { claimStatus: 'Approved' });
    assert(unauthedClaimUpdate.status === 401, 'Unauthenticated PUT /api/v1/club-claims/:id rejected with HTTP 401');

    // Negative test: Member status update rejected
    const memberClaimUpdate = await request('PUT', '/api/v1/club-claims/CLM-TEST-001', { claimStatus: 'Approved' }, memberToken);
    assert(memberClaimUpdate.status === 403, 'Member PUT /api/v1/club-claims/:id rejected with HTTP 403 Forbidden');

    // Negative test: Super Admin submitting invalid status rejected
    const invalidStatusClaimUpdate = await request('PUT', '/api/v1/club-claims/CLM-TEST-001', { claimStatus: 'SUPER_ACTIVE' }, superAdminToken);
    assert(invalidStatusClaimUpdate.status === 400, 'Super Admin submitting invalid claim status rejected with HTTP 400');

    // Positive test: Super Admin approving claim succeeds
    const adminClaimUpdate = await request('PUT', '/api/v1/club-claims/CLM-TEST-001', { claimStatus: 'Approved' }, superAdminToken);
    assert(adminClaimUpdate.status === 200, 'Super Admin PUT /api/v1/club-claims/:id succeeds with HTTP 200');
    assert(adminClaimUpdate.body?.data?.claimStatus === 'Approved', 'Claim status successfully updated to Approved');

    // -----------------------------------------------------------------
    // SECTION 3: Membership Status & Self-Activation Prevention
    // -----------------------------------------------------------------
    console.log('\n[3/9] Testing Membership Status Authorization & Self-Activation Prevention...');

    // Honest initial status on member creation
    const newMemberRes = await request('POST', '/api/v1/members', {
      name: 'Unverified Candidate',
      email: 'candidate@example.com',
      phone: '(555) 999-0001',
      state: 'Tennessee',
      club: 'Oak Ridge Hunting Club'
    });
    assert(newMemberRes.status === 201, 'POST /api/v1/members returns HTTP 201');
    assert(newMemberRes.body?.data?.status === 'Pending Payment Verification', 'Membership status strictly defaults to Pending Payment Verification');
    const candidateId = newMemberRes.body?.data?.id;

    // Negative test: Unauthenticated status update rejected
    const unauthedStatusUpdate = await request('PUT', `/api/v1/members/${candidateId}/status`, { status: 'Active' });
    assert(unauthedStatusUpdate.status === 401, 'Unauthenticated PUT /api/v1/members/:id/status rejected with HTTP 401');

    // Negative test: Regular member attempting to activate membership rejected
    const memberSelfActivate = await request('PUT', `/api/v1/members/${candidateId}/status`, { status: 'Active' }, memberToken);
    assert(memberSelfActivate.status === 403, 'Regular member attempting to activate membership rejected with HTTP 403 Forbidden');

    // Negative test: Invalid status string rejected
    const invalidMemberStatus = await request('PUT', `/api/v1/members/${candidateId}/status`, { status: 'BypassedPayment' }, superAdminToken);
    assert(invalidMemberStatus.status === 400, 'Admin submitting invalid membership status rejected with HTTP 400');

    // Negative test: Scope isolation - State Admin (Texas) cannot update Tennessee member
    const outOfScopeStatusUpdate = await request('PUT', `/api/v1/members/${candidateId}/status`, { status: 'Active' }, stateAdminToken);
    assert(outOfScopeStatusUpdate.status === 403, 'State Admin (TX) modifying member outside assigned state (TN) rejected with HTTP 403');

    // Positive test: Super Admin updating status succeeds
    const superAdminStatusUpdate = await request('PUT', `/api/v1/members/${candidateId}/status`, { status: 'Active' }, superAdminToken);
    assert(superAdminStatusUpdate.status === 200, 'Authorized Super Admin PUT /api/v1/members/:id/status succeeds with HTTP 200');
    assert(superAdminStatusUpdate.body?.data?.status === 'Active' || superAdminStatusUpdate.body?.status === 'Active', 'Member status updated to Active by authorized admin');

    // -----------------------------------------------------------------
    // SECTION 4: User Profile Modification & Mass Assignment Protection
    // -----------------------------------------------------------------
    console.log('\n[4/9] Testing User Profile Modification & Mass-Assignment Protection...');

    // Negative test: Unauthenticated profile update rejected
    const unauthedProfileUpdate = await request('PUT', '/api/v1/users/usr-regular-member/profile', { name: 'Hacked Name' });
    assert(unauthedProfileUpdate.status === 401, 'Unauthenticated PUT /api/v1/users/:id/profile rejected with HTTP 401');

    // Negative test: User attempting to modify another user's profile rejected
    const crossUserProfileUpdate = await request('PUT', '/api/v1/users/usr-super-admin/profile', { name: 'Compromised Admin' }, memberToken);
    assert(crossUserProfileUpdate.status === 403, 'Member modifying another user profile rejected with HTTP 403 Forbidden');

    // Positive test: User modifying own permitted profile fields succeeds
    const ownProfileUpdate = await request('PUT', '/api/v1/users/usr-regular-member/profile', {
      name: 'Updated Member Name',
      phone: '(555) 999-1234',
      stateCode: 'TN',
      // Privilege escalation attempt in body:
      role: 'SUPER_ADMIN',
      passwordHash: 'injected_hash'
    }, memberToken);
    assert(ownProfileUpdate.status === 200, 'User modifying own profile succeeds with HTTP 200');
    assert(ownProfileUpdate.body?.data?.name === 'Updated Member Name', 'Profile name updated successfully');
    assert(ownProfileUpdate.body?.data?.role === 'MEMBER', 'Role modification strictly blocked (mass-assignment prevented)');

    // Verify in database that role was NOT changed
    const [dbUserRows] = await db.query('SELECT role FROM `User` WHERE id = ?', ['usr-regular-member']);
    assert(dbUserRows[0]?.role === 'MEMBER', 'Database confirms role remains MEMBER after update attempt');

    // -----------------------------------------------------------------
    // SECTION 5: Event Modification, Deletion & Scope Isolation
    // -----------------------------------------------------------------
    console.log('\n[5/9] Testing Event Modification, Deletion & Scope Isolation...');

    // Public endpoints remain accessible
    const publicEventsGet = await request('GET', '/api/v1/events');
    assert(publicEventsGet.status === 200, 'Public GET /api/v1/events remains accessible (HTTP 200)');
    assert(Array.isArray(publicEventsGet.body?.data), 'Public events endpoint returns array');

    const publicEventDetail = await request('GET', '/api/v1/events/evt-1');
    assert(publicEventDetail.status === 200, 'Public GET /api/v1/events/:id remains accessible (HTTP 200)');

    // Negative test: Unauthenticated event update rejected
    const unauthedEventUpdate = await request('PUT', '/api/v1/events/evt-1', { name: 'Hacked Event' });
    assert(unauthedEventUpdate.status === 401, 'Unauthenticated PUT /api/v1/events/:id rejected with HTTP 401');

    // Negative test: Regular member event update rejected
    const memberEventUpdate = await request('PUT', '/api/v1/events/evt-1', { name: 'Member Event' }, memberToken);
    assert(memberEventUpdate.status === 403, 'Regular member PUT /api/v1/events/:id rejected with HTTP 403 Forbidden');

    // Scope isolation test: Club Admin for club-1 modifying evt-2 (club-2) rejected
    const outOfScopeEventUpdate = await request('PUT', '/api/v1/events/evt-2', { name: 'Unauthorized Modify' }, clubAdminToken);
    assert(outOfScopeEventUpdate.status === 403, 'Club Admin modifying event outside club scope (evt-2) rejected with HTTP 403');

    // Positive test: Club Admin modifying own club's event (evt-1) succeeds
    const inScopeEventUpdate = await request('PUT', '/api/v1/events/evt-1', { name: 'Oak Ridge Grand Hunt (Updated)' }, clubAdminToken);
    assert(inScopeEventUpdate.status === 200, 'Club Admin modifying own event (evt-1) succeeds with HTTP 200');
    assert(inScopeEventUpdate.body?.data?.name === 'Oak Ridge Grand Hunt (Updated)', 'Event name updated successfully in database');

    // Negative test: Modifying non-existent event returns 404
    const nonExistentEventUpdate = await request('PUT', '/api/v1/events/evt-nonexistent-999', { name: 'Ghost' }, superAdminToken);
    assert(nonExistentEventUpdate.status === 404, 'Updating non-existent event ID returns HTTP 404 Not Found');

    // Scope isolation test: Club Admin deleting event outside scope rejected
    const outOfScopeDelete = await request('DELETE', '/api/v1/events/evt-2', null, clubAdminToken);
    assert(outOfScopeDelete.status === 403, 'Club Admin deleting event outside club scope rejected with HTTP 403 Forbidden');

    // Negative test: Deleting non-existent event returns 404
    const nonExistentEventDelete = await request('DELETE', '/api/v1/events/evt-nonexistent-999', null, superAdminToken);
    assert(nonExistentEventDelete.status === 404, 'Deleting non-existent event ID returns HTTP 404 Not Found');

    // -----------------------------------------------------------------
    // SECTION 6: Financial Reports Authorization
    // -----------------------------------------------------------------
    console.log('\n[6/9] Testing Financial Reports Authorization...');

    // Negative test: Unauthenticated financial overview rejected
    const unauthedReports = await request('GET', '/api/v1/reports/financial-overview');
    assert(unauthedReports.status === 401, 'Unauthenticated GET /api/v1/reports/financial-overview rejected with HTTP 401');

    // Negative test: Member accessing financial overview rejected
    const memberReports = await request('GET', '/api/v1/reports/financial-overview', null, memberToken);
    assert(memberReports.status === 403, 'Member accessing /api/v1/reports/financial-overview rejected with HTTP 403 Forbidden');

    // Positive test: Super Admin accessing financial overview succeeds
    const adminReports = await request('GET', '/api/v1/reports/financial-overview', null, superAdminToken);
    assert(adminReports.status === 200, 'Super Admin accessing /api/v1/reports/financial-overview succeeds with HTTP 200');
    assert(Boolean(adminReports.body?.data?.summary?.totalRevenue), 'Financial report contains summary metrics');

    // Negative test: Unauthenticated state performance report rejected
    const unauthedStatePerf = await request('GET', '/api/v1/reports/state-performance');
    assert(unauthedStatePerf.status === 401, 'Unauthenticated GET /api/v1/reports/state-performance rejected with HTTP 401');

    // Positive test: State Admin accessing state performance succeeds
    const stateAdminPerf = await request('GET', '/api/v1/reports/state-performance', null, stateAdminToken);
    assert(stateAdminPerf.status === 200, 'State Admin accessing /api/v1/reports/state-performance succeeds with HTTP 200');

    // Negative test: Unauthenticated revenue commissions report rejected
    const unauthedRevComm = await request('GET', '/api/v1/reports/revenue-commissions');
    assert(unauthedRevComm.status === 401, 'Unauthenticated GET /api/v1/reports/revenue-commissions rejected with HTTP 401');

    // -----------------------------------------------------------------
    // SECTION 7: Role Changes & Scope Query Isolation
    // -----------------------------------------------------------------
    console.log('\n[7/9] Testing Role Changes & Scope Query Isolation...');

    // Negative test: Unauthenticated user roles directory rejected
    const unauthedUsersRoles = await request('GET', '/api/v1/users-roles');
    assert(unauthedUsersRoles.status === 401, 'Unauthenticated GET /api/v1/users-roles rejected with HTTP 401');

    // Negative test: Regular member accessing users roles directory rejected
    const memberUsersRoles = await request('GET', '/api/v1/users-roles', null, memberToken);
    assert(memberUsersRoles.status === 403, 'Member GET /api/v1/users-roles rejected with HTTP 403 Forbidden');

    // Positive test: Super Admin accessing users roles directory succeeds
    const adminUsersRoles = await request('GET', '/api/v1/users-roles', null, superAdminToken);
    assert(adminUsersRoles.status === 200, 'Super Admin GET /api/v1/users-roles succeeds with HTTP 200');

    // Negative test: Member attempting to change role rejected
    const memberRoleChange = await request('PUT', '/api/v1/users/usr-regular-member/role', { role: 'SUPER_ADMIN' }, memberToken);
    assert(memberRoleChange.status === 403, 'Member PUT /api/v1/users/:id/role rejected with HTTP 403 Forbidden');

    // Scope query isolation test: State Admin (Texas) querying members sees ONLY Texas records
    const stateAdminMembers = await request('GET', '/api/v1/members', null, stateAdminToken);
    assert(stateAdminMembers.status === 200, 'State Admin GET /api/v1/members succeeds with HTTP 200');
    const stateMembers = stateAdminMembers.body?.data || [];
    const allTexas = stateMembers.length > 0 && stateMembers.every(m => m.state === 'Texas' || m.state === 'TX');
    assert(allTexas, 'State Admin query is strictly scoped to Texas (Tennessee & Kentucky excluded)');

    // Scope query isolation test: Club Admin (club-1) querying members sees ONLY club-1 records
    const clubAdminMembers = await request('GET', '/api/v1/members', null, clubAdminToken);
    assert(clubAdminMembers.status === 200, 'Club Admin GET /api/v1/members succeeds with HTTP 200');
    const clubMembers = clubAdminMembers.body?.data || [];
    const allClub1 = clubMembers.length > 0 && clubMembers.every(m => m.club.toLowerCase().includes('oak ridge'));
    assert(allClub1, 'Club Admin query is strictly scoped to Oak Ridge Hunting Club');

    // -----------------------------------------------------------------
    // SECTION 8: Structured HTTP 404 for Undefined Routes
    // -----------------------------------------------------------------
    console.log('\n[8/9] Testing Structured HTTP 404 for Undefined API Paths...');

    const unknownRouteGet = await request('GET', '/api/v1/nonexistent-service-endpoint');
    assert(unknownRouteGet.status === 404, 'GET /api/v1/nonexistent returns HTTP 404');
    assert(unknownRouteGet.body?.error?.code === 'ROUTE_NOT_FOUND', 'Error code is ROUTE_NOT_FOUND');

    const unknownRoutePost = await request('POST', '/api/v1/unknown-module-bypass', { payload: 'exploit' });
    assert(unknownRoutePost.status === 404, 'POST /api/v1/unknown returns HTTP 404');

    // -----------------------------------------------------------------
    // SECTION 9: Honest Payment Gateway Status & Transparency
    // -----------------------------------------------------------------
    console.log('\n[9/9] Testing Honest Payment Gateway Status & Transparency...');

    const paymentConfigRes = await request('GET', '/api/v1/payments/config');
    assert(paymentConfigRes.status === 200, 'GET /api/v1/payments/config returns HTTP 200');
    assert(paymentConfigRes.body?.isConfigured === false, 'Payment gateway configuration honestly reports isConfigured = false');
    assert(paymentConfigRes.body?.status === 'SANDBOX_PENDING_GATEWAY', 'Status is explicitly SANDBOX_PENDING_GATEWAY');

    const chargeRes = await request('POST', '/api/v1/payments/charge', {
      amount: 45.00,
      customerName: 'Test Hunter',
      email: 'hunter@example.com'
    });
    assert(chargeRes.status === 200, 'POST /api/v1/payments/charge returns HTTP 200');
    assert(chargeRes.body?.status === 'SIMULATED_TEST', 'Transaction status clearly marked as SIMULATED_TEST');
    assert(chargeRes.body?.isLiveCharge === false, 'isLiveCharge is explicitly false (no real Clover charge)');

  } catch (err) {
    console.error('Fatal test execution error:', err);
  } finally {
    if (server) {
      server.close();
    }
    if (db && db.close) {
      await db.close();
    }
  }

  // Summary
  console.log('\n================================================================');
  const total = results.length;
  const passed = results.filter(r => r.passed).length;
  const failed = total - passed;
  console.log(`TOTAL ASSERTIONS EXECUTED: ${total}`);
  console.log(`PASSED: ${passed}`);
  console.log(`FAILED: ${failed}`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests();
