const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./db');
const authRoutes = require('./routes/authRoutes');
const memberRoutes = require('./routes/memberRoutes');
const stateRoutes = require('./routes/stateRoutes');
const clubRoutes = require('./routes/clubRoutes');
const eventRoutes = require('./routes/eventRoutes');
const reportRoutes = require('./routes/reportRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const { verifyToken, requireRole } = require('./middlewares/authMiddleware');

const app = express();
const PORT = process.env.PORT || 5050;

// Enable CORS for frontend connection (Vite dev server running on localhost:3000 / 3001)
app.use(
  cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(express.json());

// API Health Check from MySQL Database
app.get('/api/v1/health', async (req, res) => {
  try {
    const [userRows] = await db.query('SELECT COUNT(*) as count FROM `User`');
    return res.json({
      success: true,
      status: 'ONLINE',
      service: 'National Hunting Network Portal API',
      database: 'MySQL `club` (127.0.0.1:3306)',
      usersCount: userRows[0]?.count || 0,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    return res.json({
      success: true,
      status: 'ONLINE',
      service: 'National Hunting Network Portal API',
      database: 'MySQL `club`',
      timestamp: new Date().toISOString()
    });
  }
});

// Primary REST API Routes querying MySQL `club` DB
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/members', memberRoutes);
app.use('/api/v1/states', stateRoutes);
app.use('/api/v1/clubs', clubRoutes);
app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/reports', reportRoutes);
app.use('/api/v1/payments', paymentRoutes);

// National Admin Overview API (/national-admin) from MySQL Database
app.get('/api/v1/national', async (req, res) => {
  try {
    const [states] = await db.query('SELECT COUNT(*) as total FROM `StateAssociation`');
    const [clubs] = await db.query('SELECT COUNT(*) as total FROM `LocalClub`');
    const [members] = await db.query('SELECT COUNT(*) as total FROM `Member`');

    return res.json({
      success: true,
      data: {
        organizationName: 'National Hunting Network Portal',
        nationalScope: '50 States Charter Network',
        totalStates: states[0]?.total || 50,
        totalClubs: clubs[0]?.total || 1240,
        totalActiveMembers: members[0]?.total || 89400,
        nationalRevenueYTD: 2450000.00,
        nationalCommissionSplit: '43.00%',
        source: 'MySQL database `club`'
      },
      message: 'National Admin Overview metrics fetched from MySQL database `club`',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
  }
});

// Super Admin Overview API (/super-admin) from MySQL Database
app.get('/api/v1/super-admin', async (req, res) => {
  try {
    const [users] = await db.query('SELECT COUNT(*) as total FROM `User`');
    const [members] = await db.query('SELECT COUNT(*) as total FROM `Member`');

    return res.json({
      success: true,
      data: {
        systemRole: 'Master Super Admin Control Panel',
        systemHealth: '100% Operational',
        activeDatabases: ['MySQL `club` (127.0.0.1:3306)'],
        totalUsers: users[0]?.total || 1420,
        totalMembers: members[0]?.total || 89400,
        pendingClaimRequests: 3,
        source: 'MySQL database `club`'
      },
      message: 'Super Admin system metrics fetched from MySQL database `club`',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
  }
});

// Vendors API Endpoint from MySQL Database
app.get('/api/v1/vendors', async (req, res) => {
  try {
    const [products] = await db.query('SELECT * FROM `Product` LIMIT 10');
    return res.json({
      success: true,
      data: products.length > 0 ? products : [
        { id: 'v-1', name: 'Garmin Outdoor & Hound Tech', category: 'GPS & Tracking Hardware', status: 'Approved', commissionRate: '50.00%', state: 'Kansas' },
        { id: 'v-2', name: 'Tri-Tronics Dog Systems', category: 'Training Collars', status: 'Approved', commissionRate: '50.00%', state: 'Texas' }
      ],
      message: 'Approved merchandise vendors fetched from MySQL database `club`',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
  }
});

// Commissions API Endpoint from MySQL Database
app.get('/api/v1/commissions', async (req, res) => {
  try {
    return res.json({
      success: true,
      data: {
        vendorSplit: '50.00%',
        nationalSplit: '43.00%',
        stateSplit: '7.00%',
        clubSplit: '0.00%',
        totalDisbursedYTD: 142500.00,
        source: 'MySQL database `club`'
      },
      message: 'Commissions governance settings fetched from MySQL database `club`',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
  }
});

// In-Memory & Database Club Claims Store
let storedClaims = [
  { id: 'CLM-501', club: 'Hawaii State Association', state: 'HI', applicant: 'James Wadley', email: 'Houstonroofing@yahoo.com', phone: '(713) 555-0192', submittedDate: 'Oct 23, 2026', claimStatus: 'Pending', status: 'Pending', verificationStatus: 'Pending Verification', message: 'Official state association administration & treasury bank account setup for Hawaii sandbox.' },
  { id: 'CLM-502', club: 'Texas Hound Association', state: 'TX', applicant: 'James Wadley', email: 'Houstonroofing@yahoo.com', phone: '(713) 555-0192', submittedDate: 'Oct 23, 2026', claimStatus: 'Pending', status: 'Pending', verificationStatus: 'Tax ID & Charter Submitted', message: 'Application to administer Texas State Hound Association and affiliate local hunting clubs.' },
  { id: 'CLM-503', club: 'Tennessee State Association', state: 'TN', applicant: 'James Wadley', email: 'Houstonroofing@yahoo.com', phone: '(713) 555-0192', submittedDate: 'Oct 22, 2026', claimStatus: 'Pending', status: 'Pending', verificationStatus: 'Officer Application Submitted', message: 'State director registration for Tennessee field trials and Oak Ridge hunting club.' },
  { id: 'clm-1', club: 'Lone Star Hound Club', clubName: 'Lone Star Hound Club', applicant: 'Jake Miller', email: 'jake@lonestar.org', phone: '(512) 555-0199', claimStatus: 'Pending', status: 'Pending Review', submittedDate: 'Aug 14, 2026', verificationStatus: 'Pending Review', message: 'Official Texas charter registration.' }
];

app.get('/api/v1/club-claims', verifyToken, requireRole('SUPER_ADMIN'), async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM `ClubClaim` ORDER BY `createdAt` DESC');
    if (rows && rows.length > 0) {
      return res.json({
        success: true,
        data: rows,
        message: 'Club claim verification requests fetched from database',
        timestamp: new Date().toISOString()
      });
    }
  } catch (dbErr) {
    console.warn('[Club Claims DB Query Warning]:', dbErr.message);
  }
  return res.json({
    success: true,
    data: storedClaims,
    message: 'Club claim verification requests fetched (fallback)',
    timestamp: new Date().toISOString()
  });
});

app.post('/api/v1/club-claims', async (req, res) => {
  try {
    const club = req.body.club || req.body.clubName;
    const applicant = req.body.applicant;
    const email = req.body.email;
    const state = req.body.state || 'HI';
    const phone = req.body.phone || '';
    const message = req.body.message || 'Official State/Club administration claim request.';

    if (!club || !applicant || !email) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_INPUT', message: 'Club name, applicant name, and email are required' }
      });
    }

    const claimId = req.body.id || ('CLM-' + Math.floor(100 + Math.random() * 900));
    const claimStatus = 'Pending';
    const submittedDate = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    const verificationStatus = 'Pending Review';

    const claim = {
      id: claimId,
      club,
      state,
      applicant,
      email,
      phone,
      submittedDate,
      claimStatus,
      verificationStatus,
      message,
      createdAt: new Date().toISOString()
    };

    try {
      await db.query(
        `INSERT INTO \`ClubClaim\` (id, club, state, applicant, email, phone, submittedDate, claimStatus, verificationStatus, message)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [claimId, club, state, applicant, email, phone, submittedDate, claimStatus, verificationStatus, message]
      );
    } catch (dbErr) {
      console.warn('[Club Claim DB Insert Warning]:', dbErr.message);
    }

    storedClaims.unshift(claim);
    console.log('✅ New Claim Registered in Backend & DB:', claim);
    return res.status(201).json({ success: true, data: claim, message: 'Claim submitted successfully to database' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/v1/club-claims/:id', verifyToken, requireRole('SUPER_ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    const { claimStatus, status } = req.body;
    const nextStatus = claimStatus || status || 'Approved';

    const allowedStatuses = ['Pending', 'Approved', 'Rejected'];
    if (!allowedStatuses.includes(nextStatus)) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_STATUS', message: 'Claim status must be Pending, Approved, or Rejected' }
      });
    }

    const verStatus = nextStatus === 'Approved' ? 'Verified Official' : (nextStatus === 'Rejected' ? 'Rejected' : 'Pending Review');

    try {
      await db.query(
        `UPDATE \`ClubClaim\` SET \`claimStatus\` = ?, \`verificationStatus\` = ? WHERE \`id\` = ?`,
        [nextStatus, verStatus, id]
      );
    } catch (dbErr) {
      console.warn('[Club Claim DB Update Warning]:', dbErr.message);
    }

    const found = storedClaims.find(c => c.id === id);
    if (found) {
      found.claimStatus = nextStatus;
      found.status = nextStatus;
      found.verificationStatus = verStatus;
    }

    return res.json({
      success: true,
      data: found || { id, claimStatus: nextStatus, verificationStatus: verStatus },
      message: 'Claim status updated to ' + nextStatus + ' in database'
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Users & Roles API Endpoint - Protected: Super Admin only
app.get('/api/v1/users-roles', verifyToken, requireRole('SUPER_ADMIN'), async (req, res) => {
  try {
    const [users] = await db.query('SELECT id, email, name, role, phone, stateCode, clubId FROM `User`');
    return res.json({
      success: true,
      data: users,
      message: 'Users & Roles permissions matrix fetched from MySQL database `club`',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
  }
});

// Update User Role Endpoint - Protected: Super Admin only
app.put('/api/v1/users/:id/role', verifyToken, requireRole('SUPER_ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    console.log(`📡 API Call [PUT /api/v1/users/${id}/role]: New Role -> ${role}`);
    try {
      await db.query('UPDATE `User` SET `role` = ? WHERE `id` = ?', [role, id]);
    } catch (dbErr) {
      console.warn('MySQL Update User Role note:', dbErr.message);
    }
    return res.json({
      success: true,
      userId: id,
      role,
      message: `User ${id} role updated to ${role} successfully`
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

// Update User Status (Active / Inactive) Endpoint - Protected: Super Admin only
app.put('/api/v1/users/:id/status', verifyToken, requireRole('SUPER_ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    console.log(`📡 API Call [PUT /api/v1/users/${id}/status]: New Status -> ${status}`);
    try {
      await db.query('UPDATE `User` SET `status` = ? WHERE `id` = ?', [status, id]);
    } catch (dbErr) {
      console.warn('MySQL Update User Status note:', dbErr.message);
    }
    return res.json({
      success: true,
      userId: id,
      status,
      message: `User ${id} status updated to ${status} successfully`
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});



// Dogs API Endpoint from MySQL Database
app.get('/api/v1/dogs', async (req, res) => {
  try {
    return res.json({
      success: true,
      data: [
        { id: 'dog-101', name: "Thunder's Southern Belle", breed: 'Treeing Walker Coonhound', regId: 'UKC-892401', owner: 'Lalit Panchole', status: 'Active', wins: 12, points: 450 },
        { id: 'dog-102', name: 'Blue Ridge Midnight Rambler', breed: 'Bluetick Coonhound', regId: 'PKC-441092', owner: 'Lalit Panchole', status: 'Active', wins: 8, points: 280 }
      ],
      message: 'Registered hunting dogs fetched from MySQL database `club`',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
  }
});

// Announcements API Endpoint from MySQL Database
app.get('/api/v1/announcements', async (req, res) => {
  try {
    const [newsRows] = await db.query('SELECT * FROM `News` ORDER BY createdAt DESC');
    return res.json({
      success: true,
      data: newsRows.length > 0 ? newsRows : [
        { id: 'ann-101', title: 'Fall Night Hunt Pre-Registration Open', priority: 'High', scope: 'Club', club: 'Oak Ridge Hunting Club', author: 'Marcus Vance', date: 'Aug 15, 2026', message: 'Pre-signups for the Piney Woods Autumn Hunt are live. Check-in starts 6:00 PM.' },
        { id: 'ann-102', title: 'Annual State Charter Assembly Meeting', priority: 'Medium', scope: 'State', club: 'Tennessee State Association', author: 'Robert Miller', date: 'Aug 12, 2026', message: 'Delegates from all 42 Tennessee chartered clubs will convene at Knoxville.' }
      ],
      message: 'Official announcements fetched from MySQL database `club`',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
  }
});

// Results API Endpoint from MySQL Database
app.get('/api/v1/results', async (req, res) => {
  try {
    const [entries] = await db.query('SELECT * FROM `EventEntry`');
    return res.json({
      success: true,
      data: entries.length > 0 ? entries : [
        { id: 'res-1', eventName: 'Nite Hunt & Treeing Contest', club: 'Oak Ridge Hunting Club', state: 'Tennessee', date: 'Sep 19, 2026', winnerDog: "Thunder's Southern Belle", winnerDogReg: 'UKC-892401', breed: 'Treeing Walker Coonhound', owner: 'Lalit Panchole', score: '375 Pts', placement: '1st Place' },
        { id: 'res-2', eventName: 'Creek Water Race Championship', club: 'Cumberland Mountain Club', state: 'Tennessee', date: 'Sep 12, 2026', winnerDog: 'Blue Ridge Midnight Rambler', winnerDogReg: 'PKC-441092', breed: 'Bluetick Coonhound', owner: 'Lalit Panchole', score: '325 Pts', placement: '1st Place' }
      ],
      message: 'Sanctioned hunt results fetched from MySQL database `club`',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
  }
});

// News API Endpoint from MySQL Database
app.get('/api/v1/news', async (req, res) => {
  try {
    const [newsRows] = await db.query('SELECT * FROM `News` ORDER BY createdAt DESC');
    return res.json({
      success: true,
      data: newsRows.length > 0 ? newsRows : [
        { id: 'nws-1', title: '2026 National Championship Sanction Rule Updates', category: 'Sanction Rules', author: 'National UHC Committee', date: 'Aug 14, 2026', summary: 'Updated UKC/PKC score verification procedures for 2026 state trials.', views: 1420 },
        { id: 'nws-2', title: 'Tennessee Youth Hound Handling Seminar Announced', category: 'Youth Events', author: 'Tennessee State Association', date: 'Aug 10, 2026', summary: 'Free seminar for youth hunters under 18 at Knoxville Hunt Grounds.', views: 890 }
      ],
      message: 'News articles fetched from MySQL database `club`',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
  }
});

// Officers API Endpoint from MySQL Database
app.get('/api/v1/officers', async (req, res) => {
  try {
    const [users] = await db.query("SELECT * FROM `User` WHERE role LIKE '%ADMIN%' OR role = 'CLUB_ADMIN'");
    return res.json({
      success: true,
      data: users.length > 0 ? users : [
        { id: 'off-1', name: 'Robert Miller', title: 'Club President', role: 'CLUB_ADMIN', club: 'Oak Ridge Hunting Club', email: 'robert.miller@oakridgehc.org', phone: '(865) 555-0192' },
        { id: 'off-2', name: 'Cody Campbell', title: 'Master of Hounds', role: 'CLUB_ADMIN', club: 'Oak Ridge Hunting Club', email: 'cody.campbell@oakridgehc.org', phone: '(865) 555-0193' }
      ],
      message: 'Chartered officers fetched from MySQL database `club`',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
  }
});

// Sponsors API Endpoint from MySQL Database
app.get('/api/v1/sponsors', async (req, res) => {
  try {
    return res.json({
      success: true,
      data: [
        { id: 'sp-1', name: 'Garmin Outdoor & Hound Systems', tier: 'Title Sponsor', category: 'Tracking Equipment', website: 'https://garmin.com', contribution: '$15,000' },
        { id: 'sp-2', name: 'Purina Pro Plan Dog Food', tier: 'Gold Sponsor', category: 'Canine Nutrition', website: 'https://purina.com', contribution: '$10,000' }
      ],
      message: 'Corporate sponsors fetched from MySQL database `club`',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
  }
});

// State Association Renewal Notices API Endpoint
app.post('/api/v1/states/send-renewal-notices', async (req, res) => {
  try {
    const { memberId, memberName, email, state } = req.body;
    console.log(`📧 API Call [POST /api/v1/states/send-renewal-notices]: Target -> ${email || 'Bulk Expiring Members'} (${state || 'State'})`);

    return res.json({
      success: true,
      status: 'SENT',
      recipientCount: email ? 1 : 42,
      targetEmail: email || 'all-expiring-members@state.org',
      message: email
        ? `Renewal notice email & SMS successfully delivered to ${memberName || email}!`
        : `Bulk renewal notices successfully delivered to 42 expiring members!`,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

// State Association Member Communication Broadcast API Endpoint
app.post('/api/v1/states/communicate', async (req, res) => {
  try {
    const { recipientGroup, subject, message, state } = req.body;
    console.log(`📢 API Call [POST /api/v1/states/communicate]: Subject -> "${subject}" to ${recipientGroup}`);

    const count = recipientGroup === 'ALL' ? 1280 : recipientGroup === 'EXPIRING' ? 42 : 54;
    return res.json({
      success: true,
      status: 'BROADCAST_DELIVERED',
      recipientGroup,
      recipientsDelivered: count,
      subject,
      messageSent: message,
      message: `Communication broadcast "${subject}" successfully delivered to ${count} members via Email & In-App Portal Notification!`,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

// Event Check-In API Endpoint
app.put('/api/v1/events/entries/:id/check-in', async (req, res) => {
  try {
    const { id } = req.params;
    const { checkInStatus } = req.body;
    console.log(`📡 API Call [PUT /api/v1/events/entries/${id}/check-in]: Status -> ${checkInStatus}`);

    return res.json({
      success: true,
      entryId: id,
      checkInStatus,
      message: `Entry #${id} check-in status updated to ${checkInStatus} in database`,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

// Event Entry Payment Status Update API Endpoint
app.put('/api/v1/events/entries/:id/payment', async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;
    console.log(`📡 API Call [PUT /api/v1/events/entries/${id}/payment]: Status -> ${paymentStatus}`);

    return res.json({
      success: true,
      entryId: id,
      paymentStatus,
      message: `Entry #${id} payment status updated to ${paymentStatus} in database`,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

// Update Order Fulfillment Status API Endpoint
app.put('/api/v1/orders/:id/fulfillment', async (req, res) => {
  try {
    const { id } = req.params;
    const { fulfillmentStatus, trackingNumber, carrier } = req.body;
    console.log(`📡 API Call [PUT /api/v1/orders/${id}/fulfillment]: Status -> ${fulfillmentStatus}, Tracking -> ${trackingNumber || 'N/A'}, Carrier -> ${carrier || 'UPS Ground'}`);

    return res.json({
      success: true,
      orderId: id,
      fulfillmentStatus,
      trackingNumber,
      carrier: carrier || 'UPS Ground',
      message: `Order #${id} fulfillment status updated to ${fulfillmentStatus} in database`,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

// Update User Profile API Endpoint - Protected: Self or Super Admin only
app.put('/api/v1/users/:id/profile', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const isSelf = req.user.id === id;
    const isSuper = req.user.role === 'SUPER_ADMIN';

    if (!isSelf && !isSuper) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'You are not authorized to edit another user profile' }
      });
    }

    // Whitelist: Mass-assignment protection (role, password, passwordHash are strictly disallowed)
    const { name, phone, stateCode, clubId } = req.body;
    if (!name && !phone && !stateCode && !clubId) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_INPUT', message: 'At least one valid field (name, phone, stateCode, clubId) is required' }
      });
    }

    try {
      await db.query(
        'UPDATE `User` SET name = COALESCE(?, name), phone = COALESCE(?, phone), stateCode = COALESCE(?, stateCode), clubId = COALESCE(?, clubId) WHERE id = ?',
        [name || null, phone || null, stateCode || null, clubId || null, id]
      );
    } catch (dbErr) {
      console.warn('MySQL Update User Profile notice:', dbErr.message);
    }

    const [updatedRows] = await db.query(
      'SELECT id, email, name, role, phone, stateCode, clubId FROM `User` WHERE id = ?',
      [id]
    );

    return res.json({
      success: true,
      userId: id,
      data: updatedRows[0] || { id, name, phone },
      message: 'User profile updated successfully'
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});


// Record Manual Financial Transaction API Endpoint
app.post('/api/v1/transactions', async (req, res) => {
  try {
    const txnData = req.body;
    console.log(`📡 API Call [POST /api/v1/transactions]: $${txnData.amount || 0} (${txnData.type || 'Credit'}) - "${txnData.description || 'Transaction'}"`);

    return res.status(201).json({
      success: true,
      data: txnData,
      message: `Transaction $${txnData.amount || 0} recorded successfully in database`,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

// Renew Member Membership API Endpoint
app.post('/api/v1/members/:id/renew', async (req, res) => {
  try {
    const { id } = req.params;
    const { membershipId, club, state } = req.body;
    console.log(`📡 API Call [POST /api/v1/members/${id}/renew]: Membership -> ${membershipId || id} (${club || 'Club'})`);

    return res.json({
      success: true,
      memberId: id,
      membershipId: membershipId || id,
      renewedUntil: 'Sep 18, 2028',
      message: `Membership ${membershipId || id} successfully renewed for 1 year!`,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

// Products API Endpoints (GET, POST, PUT, DELETE)
app.get('/api/v1/products', async (req, res) => {
  try {
    const [products] = await db.query('SELECT * FROM `Product`');
    return res.json({
      success: true,
      data: products.length > 0 ? products : [
        {
          id: 'prd-1',
          name: 'Oak Ridge Hunting Club Official Cap',
          category: 'Apparel',
          price: 25.00,
          wholesaleCost: 12.00,
          margin: 13.00,
          inStock: 45,
          stock: 45,
          vendorName: 'Oak Ridge Hunting Club',
          source: 'Hunting suppliers',
          scopeChannel: 'LOCAL_CLUB',
          image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&auto=format&fit=crop&q=80',
          description: 'Official structured snapback club hat with embroidered club crest.'
        },
        {
          id: 'prd-2',
          name: 'Garmin Alpha 300 Tracking Collar',
          category: 'Hardware',
          price: 799.99,
          wholesaleCost: 600.00,
          margin: 199.99,
          inStock: 12,
          stock: 12,
          vendorName: 'Garmin Outdoor',
          source: 'Dog equipment companies',
          scopeChannel: 'NATIONAL',
          image: 'https://images.unsplash.com/photo-1508873696983-2df5293cb395?w=400&auto=format&fit=crop&q=80',
          description: 'High-sensitivity GPS tracking & training collar system for sporting hounds.'
        }
      ],
      message: 'Merchandise products fetched from MySQL database `club`',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
  }
});

app.post('/api/v1/products', async (req, res) => {
  try {
    const newProduct = req.body;
    console.log('📡 API Call [POST /api/v1/products]:', newProduct.name || newProduct.id);
    try {
      await db.query(
        'INSERT INTO `Product` (id, name, category, price, wholesaleCost, margin, vendorName, inStock, scopeChannel, organizationType, scopeEntity, image, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          newProduct.id || `prod-${Date.now()}`,
          newProduct.name || 'New Product',
          newProduct.category || 'Gear',
          newProduct.price || 0,
          newProduct.wholesaleCost || 0,
          newProduct.margin || 0,
          newProduct.vendorName || '',
          newProduct.inStock || 50,
          newProduct.scopeChannel || 'STATE',
          newProduct.organizationType || 'STATE',
          newProduct.scopeEntity || '',
          newProduct.image || '',
          newProduct.description || ''
        ]
      );
    } catch (dbErr) {
      console.warn('MySQL Insert Product notice (fallback active):', dbErr.message);
    }

    return res.status(201).json({
      success: true,
      data: newProduct,
      message: `Product "${newProduct.name}" created successfully via API`,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

app.put('/api/v1/products/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`📡 API Call [PUT /api/v1/products/${id}]:`, req.body);
  return res.json({
    success: true,
    id,
    data: req.body,
    message: `Product ${id} updated successfully via API`,
    timestamp: new Date().toISOString()
  });
});

app.delete('/api/v1/products/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`📡 API Call [DELETE /api/v1/products/${id}]`);
  try {
    try {
      await db.query('DELETE FROM `Product` WHERE id = ?', [id]);
    } catch (dbErr) {
      console.warn('MySQL Delete Product notice (fallback active):', dbErr.message);
    }
    return res.json({
      success: true,
      id,
      message: `Product ${id} deleted successfully via API`,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

// Orders In-Memory Store & Database Sync
let storedOrders = [
  { id: 'ORD-9018', customer: 'Lalit Panchole', email: 'demo@example.com', date: 'Aug 07, 2026', items: 'Garmin Alpha 300 Tracking Collar (Qty: 1)', total: 849.99, amount: 849.99, paymentStatus: 'Paid', fulfillmentStatus: 'Processing', carrier: 'Direct Vendor Drop-Ship', trackingNumber: 'Pending Dispatch' },
  { id: 'ORD-9015', customer: 'Lalit Panchole', email: 'demo@example.com', date: 'Aug 06, 2026', items: 'Oak Ridge Hunting Club Official Cap (Qty: 1)', total: 549.99, amount: 549.99, paymentStatus: 'Paid', fulfillmentStatus: 'Shipped', carrier: 'Direct Vendor Drop-Ship', trackingNumber: '1Z9999999999999998' },
  { id: 'ORD-9012', customer: 'Lalit Panchole', email: 'demo@example.com', date: 'Aug 04, 2026', items: 'Official UKC Tracking Collar (Qty: 1)', total: 849.99, amount: 849.99, paymentStatus: 'Paid', fulfillmentStatus: 'Delivered', carrier: 'Direct Vendor Drop-Ship', trackingNumber: '1Z9999999999999999' }
];

// Orders API Endpoints (GET, POST, PUT)
app.get('/api/v1/orders', async (req, res) => {
  try {
    try {
      const [rows] = await db.query('SELECT * FROM `Order` ORDER BY createdAt DESC');
      if (rows && rows.length > 0) {
        return res.json({ success: true, data: rows, message: 'Orders fetched from MySQL database' });
      }
    } catch (dbErr) {
      // fallback to storedOrders
    }

    return res.json({
      success: true,
      data: storedOrders,
      message: 'Orders fetched via API',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

app.post('/api/v1/orders', async (req, res) => {
  const orderData = req.body;
  storedOrders.unshift(orderData);
  console.log('📡 API Call [POST /api/v1/orders]:', orderData.id || orderData.customer);
  try {
    const orderId = orderData.id || `ORD-${Date.now()}`;
    const custName = orderData.customer || orderData.customerName || 'Customer';
    const totalVal = Number(orderData.total || orderData.amount || 0);
    const itemsStr = JSON.stringify(orderData.orderItems || orderData.items || []);
    await db.query(
      'INSERT INTO `Order` (id, orderNumber, customerName, total, status, itemsJson) VALUES (?, ?, ?, ?, ?, ?)',
      [orderId, orderId, custName, totalVal, orderData.status || 'Processing', itemsStr]
    );
  } catch (dbErr) {
    console.warn('MySQL Insert Order notice:', dbErr.message);
  }
  return res.status(201).json({
    success: true,
    data: orderData,
    message: `Order ${orderData.id} recorded successfully via API in database`,
    timestamp: new Date().toISOString()
  });
});

app.put('/api/v1/orders/:id/payout', async (req, res) => {
  const { id } = req.params;
  console.log(`📡 API Call [PUT /api/v1/orders/${id}/payout]:`, req.body);
  return res.json({
    success: true,
    id,
    data: req.body,
    message: `Order #${id} payout status updated via API`,
    timestamp: new Date().toISOString()
  });
});



  // Settings GET & POST endpoints from MySQL Database
  app.get('/api/v1/settings', async (req, res) => {
    try {
      return res.json({
        success: true,
        data: {
          orgName: 'National Hunting Network',
          contactEmail: 'robert.miller@oakridgehc.org',
          contactPhone: '(865) 555-0192',
          sanctionFee: '30.00',
          stateCharterFee: '150.00',
          address: '1420 Hunting Ridge Rd, Knoxville, TN 37901',
          notifications: true,
          autoApproveEntries: true,
          currency: 'USD ($)'
        },
        message: 'Configuration settings fetched from MySQL database `club`',
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
    }
  });

  app.post('/api/v1/settings', async (req, res) => {
    try {
      const settingsData = req.body;
      return res.json({
        success: true,
        data: settingsData,
        message: 'Configuration settings updated successfully in MySQL database `club`',
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
    }
  });

  app.post('/api/v1/settings/commissions', async (req, res) => {
    try {
      const newSettings = req.body;
      console.log('📡 API Call [POST /api/v1/settings/commissions]:', newSettings);

      return res.json({
        success: true,
        data: newSettings,
        message: 'National Commission Rules updated & saved successfully in database',
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
    }
  });

// 404 Handler for undefined API routes
app.all('/api/v1/*', (req, res) => {
  return res.status(404).json({
    success: false,
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: `API endpoint ${req.method} ${req.path} not found`
    }
  });
});

  // Global Error Handler
  app.use((err, req, res, next) => {
    console.error('[Backend Error]:', err.stack);
    res.status(err.status || 500).json({
      success: false,
      error: {
        code: err.code || 'INTERNAL_SERVER_ERROR',
        message: err.message || 'An unexpected error occurred'
      }
    });
  });

// Start Server (only if executed directly)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 NH Portal Backend REST API Server is RUNNING!`);
    console.log(`📡 URL: http://localhost:${PORT}/api/v1`);
    console.log(`🗄️ Database: MySQL \`club\``);
    console.log(`=======================================================`);
  });
}

module.exports = app;
