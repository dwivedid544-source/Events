/**
 * verify_auth_and_claims.js
 * Comprehensive Verification Test Suite for Backend Authentication,
 * Server-Side Role Enforcement, Persistent Club Claims, and Unknown Route Rejection.
 */

const assert = require('assert');
const app = require('./server');
const db = require('./db');

let server;
let baseUrl;

async function runTests() {
  console.log('===============================================================');
  console.log('🚀 Starting Backend Authentication & Security Verification Suite');
  console.log('===============================================================\n');

  let passed = 0;
  let failed = 0;

  // Start server on an ephemeral port
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://localhost:${port}/api/v1`;
      console.log(`📡 Test server running at ${baseUrl}\n`);
      resolve();
    });
  });

  async function test(name, fn) {
    try {
      process.stdout.write(`• ${name}... `);
      await fn();
      console.log('✅ PASS');
      passed++;
    } catch (err) {
      console.log('❌ FAIL');
      console.error(`  Error: ${err.message}`);
      failed++;
    }
  }

  let superAdminToken = '';
  let memberToken = '';
  let memberEmail = `test_member_${Date.now()}@example.com`;
  let createdClaimId = '';

  try {
    // -------------------------------------------------------------
    // Test 1: Invalid login cannot obtain an admin token (Missing user)
    // -------------------------------------------------------------
    await test('Invalid login cannot obtain admin token (Missing User)', async () => {
      const res = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'nonexistent_user@example.com', password: 'Password123!' })
      });

      assert.strictEqual(res.status, 401, `Expected status 401, got ${res.status}`);
      const json = await res.json();
      assert.strictEqual(json.success, false);
      assert.strictEqual(json.error?.code, 'INVALID_CREDENTIALS');
      assert.strictEqual(json.data, undefined, 'Response should not contain user/token');
    });

    // -------------------------------------------------------------
    // Test 2: Invalid password cannot authenticate
    // -------------------------------------------------------------
    await test('Invalid password cannot authenticate against existing user', async () => {
      const res = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'pancholelalit52@gmail.com', password: 'WrongPassword999!' })
      });

      assert.strictEqual(res.status, 401, `Expected status 401, got ${res.status}`);
      const json = await res.json();
      assert.strictEqual(json.success, false);
      assert.strictEqual(json.error?.code, 'INVALID_CREDENTIALS');
    });

    // -------------------------------------------------------------
    // Test 3: Empty login body rejected
    // -------------------------------------------------------------
    await test('Empty login payload rejected with 400', async () => {
      const res = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });

      assert.strictEqual(res.status, 400);
      const json = await res.json();
      assert.strictEqual(json.error?.code, 'INVALID_INPUT');
    });

    // -------------------------------------------------------------
    // Test 4: Valid test user can authenticate & receive signed token
    // -------------------------------------------------------------
    await test('Valid Super Admin user authenticates and receives JWT', async () => {
      const res = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'pancholelalit52@gmail.com', password: 'Password123!' })
      });

      assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);
      const json = await res.json();
      assert.strictEqual(json.success, true);
      assert.ok(json.data?.token, 'Token must be present in response');
      assert.strictEqual(json.data.user?.role, 'SUPER_ADMIN');
      superAdminToken = json.data.token;
    });

    // -------------------------------------------------------------
    // Test 5: Missing / Malformed tokens cannot access protected operations
    // -------------------------------------------------------------
    await test('Missing token is rejected on protected operations (401)', async () => {
      const res = await fetch(`${baseUrl}/users-roles`);
      assert.strictEqual(res.status, 401);
      const json = await res.json();
      assert.strictEqual(json.error?.code, 'UNAUTHORIZED');
    });

    await test('Malformed/expired token is rejected on protected operations (401)', async () => {
      const res = await fetch(`${baseUrl}/users-roles`, {
        headers: { Authorization: 'Bearer this_is_an_invalid_tampered_token' }
      });
      assert.strictEqual(res.status, 401);
      const json = await res.json();
      assert.strictEqual(json.error?.code, 'INVALID_TOKEN');
    });

    // -------------------------------------------------------------
    // Test 6: Member registration and role restriction
    // -------------------------------------------------------------
    await test('Register member receives MEMBER role and cannot self-escalate', async () => {
      const res = await fetch(`${baseUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test Member',
          email: memberEmail,
          password: 'MemberPassword123!',
          role: 'SUPER_ADMIN' // Malicious attempt to register as Super Admin
        })
      });

      assert.strictEqual(res.status, 201);
      const json = await res.json();
      assert.strictEqual(json.data?.user?.role, 'MEMBER', 'Role must be locked to MEMBER for self-registration');
      memberToken = json.data.token;
    });

    await test('Member cannot access admin-only operations (403 Forbidden)', async () => {
      // 1. Cannot view user roles matrix
      const res1 = await fetch(`${baseUrl}/users-roles`, {
        headers: { Authorization: `Bearer ${memberToken}` }
      });
      assert.strictEqual(res1.status, 403, `Expected 403, got ${res1.status}`);

      // 2. Cannot view Super Admin panel
      const res2 = await fetch(`${baseUrl}/super-admin`, {
        headers: { Authorization: `Bearer ${memberToken}` }
      });
      assert.strictEqual(res2.status, 403);

      // 3. Cannot view club claims list
      const res3 = await fetch(`${baseUrl}/club-claims`, {
        headers: { Authorization: `Bearer ${memberToken}` }
      });
      assert.strictEqual(res3.status, 403);

      // 4. Cannot create a local club
      const res4 = await fetch(`${baseUrl}/clubs`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${memberToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: 'Unauthorized Club' })
      });
      assert.strictEqual(res4.status, 403);
    });

    await test('Member can access permitted member operations', async () => {
      const res = await fetch(`${baseUrl}/auth/profile`, {
        headers: { Authorization: `Bearer ${memberToken}` }
      });
      assert.strictEqual(res.status, 200);
      const json = await res.json();
      assert.strictEqual(json.data?.email, memberEmail);
    });

    // -------------------------------------------------------------
    // Test 7: Authorized administrators can perform permitted actions
    // -------------------------------------------------------------
    await test('Super Admin can access administrative operations', async () => {
      const res1 = await fetch(`${baseUrl}/users-roles`, {
        headers: { Authorization: `Bearer ${superAdminToken}` }
      });
      assert.strictEqual(res1.status, 200);

      const res2 = await fetch(`${baseUrl}/super-admin`, {
        headers: { Authorization: `Bearer ${superAdminToken}` }
      });
      assert.strictEqual(res2.status, 200);

      const res3 = await fetch(`${baseUrl}/club-claims`, {
        headers: { Authorization: `Bearer ${superAdminToken}` }
      });
      assert.strictEqual(res3.status, 200);
    });

    // -------------------------------------------------------------
    // Test 8: User cannot change their own role (Impersonation prevention)
    // -------------------------------------------------------------
    await test('User cannot modify their own role', async () => {
      const res = await fetch(`${baseUrl}/users/usr-lalit/role`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${superAdminToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: 'MEMBER' })
      });

      assert.strictEqual(res.status, 403);
      const json = await res.json();
      assert.strictEqual(json.error?.code, 'FORBIDDEN');
    });

    // -------------------------------------------------------------
    // Test 9: Claim submission persists in MySQL
    // -------------------------------------------------------------
    await test('Claim submission persists in MySQL ClubClaim table', async () => {
      createdClaimId = `CLM-TEST-${Date.now().toString().slice(-4)}`;
      const claimPayload = {
        id: createdClaimId,
        club: 'Hawaii State Association',
        state: 'HI',
        applicant: 'James Wadley Test',
        email: 'james_audit_test@example.com',
        phone: '(808) 555-0199',
        message: 'Official State Association Administration claim for Hawaii sandbox verification.'
      };

      const res = await fetch(`${baseUrl}/club-claims`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(claimPayload)
      });

      assert.strictEqual(res.status, 201);
      const json = await res.json();
      assert.strictEqual(json.data?.id, createdClaimId);

      // Verify directly in MySQL database
      const [rows] = await db.query('SELECT * FROM `ClubClaim` WHERE id = ?', [createdClaimId]);
      assert.strictEqual(rows.length, 1, 'Claim must exist in MySQL');
      assert.strictEqual(rows[0].claimStatus, 'Pending');
      assert.strictEqual(rows[0].applicant, 'James Wadley Test');
      assert.strictEqual(rows[0].state, 'HI');
    });

    // -------------------------------------------------------------
    // Test 10: Claim approval persists and updates status
    // -------------------------------------------------------------
    await test('Claim approval persists and updates state association in MySQL', async () => {
      const res = await fetch(`${baseUrl}/club-claims/${createdClaimId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${superAdminToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ claimStatus: 'Approved' })
      });

      assert.strictEqual(res.status, 200);
      const json = await res.json();
      assert.strictEqual(json.data?.claimStatus, 'Approved');

      // Verify directly from MySQL after write
      const [claimRows] = await db.query('SELECT * FROM `ClubClaim` WHERE id = ?', [createdClaimId]);
      assert.strictEqual(claimRows[0].claimStatus, 'Approved');
      assert.strictEqual(claimRows[0].verificationStatus, 'Verified Official');

      // Verify StateAssociation was updated with new admin name
      const [stateRows] = await db.query('SELECT adminName FROM `StateAssociation` WHERE code = "HI"');
      if (stateRows.length > 0) {
        assert.strictEqual(stateRows[0].adminName, 'James Wadley Test', 'Hawaii adminName must be updated');
      }

      // Verify fresh listing from API shows updated status
      const listRes = await fetch(`${baseUrl}/club-claims`, {
        headers: { Authorization: `Bearer ${superAdminToken}` }
      });
      const listJson = await listRes.json();
      const approvedItem = listJson.data.find((c) => c.id === createdClaimId);
      assert.ok(approvedItem, 'Approved claim must be in claims list');
      assert.strictEqual(approvedItem.claimStatus, 'Approved');
    });

    // -------------------------------------------------------------
    // Test 11: Unknown endpoints return 404 (Wildcards eliminated)
    // -------------------------------------------------------------
    await test('Unknown POST endpoint returns 404 (No fake 201)', async () => {
      const res = await fetch(`${baseUrl}/unknown-nonexistent-endpoint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dummy: 'data' })
      });

      assert.strictEqual(res.status, 404, `Expected 404, got ${res.status}`);
      const json = await res.json();
      assert.strictEqual(json.success, false);
      assert.strictEqual(json.error?.code, 'NOT_FOUND');
    });

    await test('Unknown GET endpoint returns 404 (No fake 200 with empty array)', async () => {
      const res = await fetch(`${baseUrl}/random-unimplemented-module`);
      assert.strictEqual(res.status, 404);
      const json = await res.json();
      assert.strictEqual(json.success, false);
      assert.strictEqual(json.error?.code, 'NOT_FOUND');
    });

    // -------------------------------------------------------------
    // Test 12: Database failure / missing entity error reporting
    // -------------------------------------------------------------
    await test('Updating nonexistent user role returns 404', async () => {
      const res = await fetch(`${baseUrl}/users/nonexistent-usr-9999/role`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${superAdminToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: 'MEMBER' })
      });

      assert.strictEqual(res.status, 404);
      const json = await res.json();
      assert.strictEqual(json.error?.code, 'NOT_FOUND');
    });

    await test('Updating user role with invalid role string returns 400', async () => {
      const res = await fetch(`${baseUrl}/users/some-user-id/role`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${superAdminToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: 'INVALID_ROLE_XYZ' })
      });

      assert.strictEqual(res.status, 400);
      const json = await res.json();
      assert.strictEqual(json.error?.code, 'INVALID_ROLE');
    });

  } finally {
    // Clean up created test data in MySQL
    try {
      if (createdClaimId) {
        await db.query('DELETE FROM `ClubClaim` WHERE id = ?', [createdClaimId]);
      }
      if (memberEmail) {
        await db.query('DELETE FROM `User` WHERE email = ?', [memberEmail]);
      }
      // Reset Hawaii admin name back if modified
      await db.query('UPDATE `StateAssociation` SET adminName = "Hawaii Admin" WHERE code = "HI"');
    } catch (cleanupErr) {
      console.warn('Cleanup warning:', cleanupErr.message);
    }

    if (server) {
      server.close();
    }
    await db.end();
  }

  console.log('\n===============================================================');
  console.log(`📊 Suite Completed: ${passed} PASSED, ${failed} FAILED`);
  console.log('===============================================================\n');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests().catch((err) => {
  console.error('Fatal Test Suite Error:', err);
  process.exit(1);
});
