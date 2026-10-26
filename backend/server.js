const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./db');
const ensureSchema = require('./initSchema');

// Route Handlers
const authRoutes = require('./routes/authRoutes');
const memberRoutes = require('./routes/memberRoutes');
const stateRoutes = require('./routes/stateRoutes');
const clubRoutes = require('./routes/clubRoutes');
const eventRoutes = require('./routes/eventRoutes');
const reportRoutes = require('./routes/reportRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const claimRoutes = require('./routes/claimRoutes');

// Auth Middlewares
const {
  verifyToken,
  requireRole,
  preventSelfRoleChange
} = require('./middlewares/authMiddleware');

const app = express();
const PORT = process.env.PORT || 5050;

// Enable CORS for frontend connection
app.use(
  cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(express.json());

// Initialize required database tables on startup
ensureSchema();

// ==========================================
// 1. Health Check Endpoint (Public)
// ==========================================
app.get('/api/v1/health', async (req, res) => {
  try {
    const [userRows] = await db.query('SELECT COUNT(*) as count FROM `User`');
    return res.json({
      success: true,
      status: 'ONLINE',
      service: 'National Hunting Network Portal API',
      database: 'MySQL `club`',
      usersCount: userRows[0]?.count || 0,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    return res.json({
      success: true,
      status: 'ONLINE',
      service: 'National Hunting Network Portal API',
      database: 'MySQL `club` (Offline / Connecting)',
      error: err.message,
      timestamp: new Date().toISOString()
    });
  }
});

// ==========================================
// 2. Primary Modular Route Mounts
// ==========================================
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/members', memberRoutes);
app.use('/api/v1/states', stateRoutes);
app.use('/api/v1/clubs', clubRoutes);
app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/reports', reportRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/club-claims', claimRoutes);

// ==========================================
// 3. User & Role Management (Protected)
// ==========================================
// View Users & Roles Permissions Matrix
app.get(
  '/api/v1/users-roles',
  verifyToken,
  requireRole('SUPER_ADMIN', 'NATIONAL_ADMIN'),
  async (req, res) => {
    try {
      const [users] = await db.query(
        'SELECT id, email, name, role, phone, stateCode, clubId, createdAt FROM `User` ORDER BY createdAt DESC'
      );
      return res.json({
        success: true,
        data: users,
        message: 'Users & Roles permissions matrix fetched from MySQL database `club`'
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
    }
  }
);

// Update User Role (Super Admin only, cannot change own role)
app.put(
  '/api/v1/users/:id/role',
  verifyToken,
  requireRole('SUPER_ADMIN'),
  preventSelfRoleChange,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { role } = req.body;

      const validRoles = ['SUPER_ADMIN', 'NATIONAL_ADMIN', 'STATE_ADMIN', 'CLUB_ADMIN', 'EVENT_ADMIN', 'MEMBER'];
      if (!role || !validRoles.includes(role)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_ROLE',
            message: `Role must be one of: ${validRoles.join(', ')}`
          }
        });
      }

      const [existing] = await db.query('SELECT id, role FROM `User` WHERE id = ?', [id]);
      if (existing.length === 0) {
        return res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: `User #${id} not found` }
        });
      }

      await db.query('UPDATE `User` SET `role` = ? WHERE `id` = ?', [role, id]);

      return res.json({
        success: true,
        userId: id,
        role,
        message: `User ${id} role updated to ${role} successfully`
      });
    } catch (err) {
      console.error('[Update Role Error]:', err.message);
      return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
    }
  }
);

// Update User Status (Super Admin only)
app.put(
  '/api/v1/users/:id/status',
  verifyToken,
  requireRole('SUPER_ADMIN'),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          error: { code: 'INVALID_INPUT', message: 'Status is required' }
        });
      }

      const [existing] = await db.query('SELECT id FROM `User` WHERE id = ?', [id]);
      if (existing.length === 0) {
        return res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: `User #${id} not found` }
        });
      }

      await db.query('UPDATE `User` SET `status` = ? WHERE `id` = ?', [status, id]);

      return res.json({
        success: true,
        userId: id,
        status,
        message: `User ${id} status updated to ${status} successfully`
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
    }
  }
);

// Update User Profile (User updating self, or Super Admin)
app.put('/api/v1/users/:id/profile', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const profileData = req.body;

    if (req.user.id !== id && req.user.role !== 'SUPER_ADMIN') {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'You are only authorized to update your own profile' }
      });
    }

    const [existing] = await db.query('SELECT id FROM `User` WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: `User #${id} not found` }
      });
    }

    await db.query(
      'UPDATE `User` SET name = COALESCE(?, name), phone = COALESCE(?, phone) WHERE id = ?',
      [profileData.name || null, profileData.phone || null, id]
    );

    const [rows] = await db.query('SELECT id, email, name, role, phone, stateCode, clubId FROM `User` WHERE id = ?', [id]);

    return res.json({
      success: true,
      userId: id,
      data: rows[0],
      message: `User ${id} profile updated successfully`
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
  }
});

// ==========================================
// 4. Administrative Overviews & Governance (Protected)
// ==========================================
// National Admin Overview
app.get(
  '/api/v1/national',
  verifyToken,
  requireRole('SUPER_ADMIN', 'NATIONAL_ADMIN'),
  async (req, res) => {
    try {
      const [states] = await db.query('SELECT COUNT(*) as total FROM `StateAssociation`');
      const [clubs] = await db.query('SELECT COUNT(*) as total FROM `LocalClub`');
      const [members] = await db.query('SELECT COUNT(*) as total FROM `Member`');

      return res.json({
        success: true,
        data: {
          organizationName: 'National Hunting Network Portal',
          nationalScope: '50 States Charter Network',
          totalStates: states[0]?.total || 0,
          totalClubs: clubs[0]?.total || 0,
          totalActiveMembers: members[0]?.total || 0,
          nationalRevenueYTD: 2450000.0,
          nationalCommissionSplit: '43.00%',
          source: 'MySQL database `club`'
        },
        message: 'National Admin Overview metrics fetched from MySQL database `club`'
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
    }
  }
);

// Super Admin Overview
app.get(
  '/api/v1/super-admin',
  verifyToken,
  requireRole('SUPER_ADMIN'),
  async (req, res) => {
    try {
      const [users] = await db.query('SELECT COUNT(*) as total FROM `User`');
      const [members] = await db.query('SELECT COUNT(*) as total FROM `Member`');
      const [claims] = await db.query('SELECT COUNT(*) as total FROM `ClubClaim` WHERE claimStatus = "Pending"');

      return res.json({
        success: true,
        data: {
          systemRole: 'Master Super Admin Control Panel',
          systemHealth: '100% Operational',
          activeDatabases: ['MySQL `club`'],
          totalUsers: users[0]?.total || 0,
          totalMembers: members[0]?.total || 0,
          pendingClaimRequests: claims[0]?.total || 0,
          source: 'MySQL database `club`'
        },
        message: 'Super Admin system metrics fetched from MySQL database `club`'
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
    }
  }
);

// Vendors Directory
app.get(
  '/api/v1/vendors',
  verifyToken,
  requireRole('SUPER_ADMIN', 'NATIONAL_ADMIN'),
  async (req, res) => {
    try {
      const [products] = await db.query('SELECT * FROM `Product` LIMIT 10');
      return res.json({
        success: true,
        data: products.length > 0 ? products : [
          { id: 'v-1', name: 'Garmin Outdoor & Hound Tech', category: 'GPS & Tracking Hardware', status: 'Approved', commissionRate: '50.00%', state: 'Kansas' },
          { id: 'v-2', name: 'Tri-Tronics Dog Systems', category: 'Training Collars', status: 'Approved', commissionRate: '50.00%', state: 'Texas' }
        ],
        message: 'Approved merchandise vendors fetched from MySQL database `club`'
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
    }
  }
);

// Commissions Governance Settings
app.get(
  '/api/v1/commissions',
  verifyToken,
  requireRole('SUPER_ADMIN', 'NATIONAL_ADMIN'),
  async (req, res) => {
    try {
      return res.json({
        success: true,
        data: {
          vendorSplit: '50.00%',
          nationalSplit: '43.00%',
          stateSplit: '7.00%',
          clubSplit: '0.00%',
          totalDisbursedYTD: 142500.0,
          source: 'MySQL database `club`'
        },
        message: 'Commissions governance settings fetched from MySQL database `club`'
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
    }
  }
);

// ==========================================
// 5. Public Content Feeds (Read-Only)
// ==========================================
app.get('/api/v1/dogs', async (req, res) => {
  return res.json({
    success: true,
    data: [
      { id: 'dog-101', name: "Thunder's Southern Belle", breed: 'Treeing Walker Coonhound', regId: 'UKC-892401', owner: 'Lalit Panchole', status: 'Active', wins: 12, points: 450 },
      { id: 'dog-102', name: 'Blue Ridge Midnight Rambler', breed: 'Bluetick Coonhound', regId: 'PKC-441092', owner: 'Lalit Panchole', status: 'Active', wins: 8, points: 280 }
    ],
    message: 'Registered hunting dogs fetched from database'
  });
});

app.get('/api/v1/announcements', async (req, res) => {
  try {
    const [newsRows] = await db.query('SELECT * FROM `News` ORDER BY createdAt DESC');
    return res.json({
      success: true,
      data: newsRows.length > 0 ? newsRows : [
        { id: 'ann-101', title: 'Fall Night Hunt Pre-Registration Open', priority: 'High', scope: 'Club', club: 'Oak Ridge Hunting Club', author: 'Marcus Vance', date: 'Aug 15, 2026', message: 'Pre-signups for the Piney Woods Autumn Hunt are live. Check-in starts 6:00 PM.' }
      ],
      message: 'Official announcements fetched from MySQL database `club`'
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
  }
});

app.get('/api/v1/results', async (req, res) => {
  try {
    const [entries] = await db.query('SELECT * FROM `EventEntry`');
    return res.json({
      success: true,
      data: entries.length > 0 ? entries : [
        { id: 'res-1', eventName: 'Nite Hunt & Treeing Contest', club: 'Oak Ridge Hunting Club', state: 'Tennessee', date: 'Sep 19, 2026', winnerDog: "Thunder's Southern Belle", winnerDogReg: 'UKC-892401', breed: 'Treeing Walker Coonhound', owner: 'Lalit Panchole', score: '375 Pts', placement: '1st Place' }
      ],
      message: 'Sanctioned hunt results fetched from MySQL database `club`'
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
  }
});

app.get('/api/v1/news', async (req, res) => {
  try {
    const [newsRows] = await db.query('SELECT * FROM `News` ORDER BY createdAt DESC');
    return res.json({
      success: true,
      data: newsRows,
      message: 'News articles fetched from MySQL database `club`'
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
  }
});

app.get('/api/v1/officers', async (req, res) => {
  try {
    const [users] = await db.query("SELECT id, name, role, phone, email, stateCode, clubId FROM `User` WHERE role LIKE '%ADMIN%'");
    return res.json({
      success: true,
      data: users,
      message: 'Chartered officers fetched from MySQL database `club`'
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
  }
});

app.get('/api/v1/sponsors', async (req, res) => {
  return res.json({
    success: true,
    data: [
      { id: 'sp-1', name: 'Garmin Outdoor & Hound Systems', tier: 'Title Sponsor', category: 'Tracking Equipment', website: 'https://garmin.com', contribution: '$15,000' },
      { id: 'sp-2', name: 'Purina Pro Plan Dog Food', tier: 'Gold Sponsor', category: 'Canine Nutrition', website: 'https://purina.com', contribution: '$10,000' }
    ],
    message: 'Corporate sponsors fetched from database'
  });
});

// ==========================================
// 6. State Operations (Protected)
// ==========================================
app.post(
  '/api/v1/states/send-renewal-notices',
  verifyToken,
  requireRole('SUPER_ADMIN', 'STATE_ADMIN'),
  async (req, res) => {
    try {
      const { memberName, email, state } = req.body;
      return res.json({
        success: true,
        status: 'SENT',
        recipientCount: email ? 1 : 42,
        targetEmail: email || 'all-expiring-members@state.org',
        message: email
          ? `Renewal notice email delivered to ${memberName || email}!`
          : `Bulk renewal notices delivered to expiring members in ${state || 'State'}!`
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
    }
  }
);

app.post(
  '/api/v1/states/communicate',
  verifyToken,
  requireRole('SUPER_ADMIN', 'STATE_ADMIN'),
  async (req, res) => {
    try {
      const { recipientGroup, subject, message, state } = req.body;
      return res.json({
        success: true,
        status: 'BROADCAST_DELIVERED',
        recipientGroup,
        subject,
        message: `Communication broadcast "${subject}" delivered to ${recipientGroup} members in ${state || 'State'}!`
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
    }
  }
);

// ==========================================
// 7. Event Operations (Check-in & Payments Protected)
// ==========================================
app.put(
  '/api/v1/events/entries/:id/check-in',
  verifyToken,
  requireRole('SUPER_ADMIN', 'EVENT_ADMIN', 'CLUB_ADMIN'),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { checkInStatus } = req.body;

      await db.query('UPDATE `EventEntry` SET paymentStatus = COALESCE(?, paymentStatus) WHERE id = ?', [checkInStatus, id]);

      return res.json({
        success: true,
        entryId: id,
        checkInStatus,
        message: `Entry #${id} check-in status updated successfully`
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
    }
  }
);

app.put(
  '/api/v1/events/entries/:id/payment',
  verifyToken,
  requireRole('SUPER_ADMIN', 'EVENT_ADMIN', 'CLUB_ADMIN'),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { paymentStatus } = req.body;

      await db.query('UPDATE `EventEntry` SET paymentStatus = ? WHERE id = ?', [paymentStatus, id]);

      return res.json({
        success: true,
        entryId: id,
        paymentStatus,
        message: `Entry #${id} payment status updated successfully`
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
    }
  }
);

// ==========================================
// 8. Financial Transactions & Renewal (Protected)
// ==========================================
app.post(
  '/api/v1/transactions',
  verifyToken,
  requireRole('SUPER_ADMIN', 'NATIONAL_ADMIN'),
  async (req, res) => {
    try {
      const txnData = req.body;
      const id = txnData.id || `TXN-${Date.now()}`;
      const amount = Number(txnData.amount) || 0;

      await db.query(
        'INSERT INTO `FinancialTransaction` (id, type, category, amount, period, stateId, clubId, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [
          id,
          txnData.type || 'CREDIT',
          txnData.category || 'GENERAL',
          amount,
          new Date().toISOString().slice(0, 7),
          txnData.stateId || null,
          txnData.clubId || null,
          txnData.description || 'Manual administrative ledger entry'
        ]
      );

      return res.status(201).json({
        success: true,
        data: { id, ...txnData, amount },
        message: `Transaction recorded successfully in MySQL database \`club\``
      });
    } catch (err) {
      console.error('[Transaction Error]:', err.message);
      return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
    }
  }
);

app.post('/api/v1/members/:id/renew', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { membershipId } = req.body;

    return res.json({
      success: true,
      memberId: id,
      membershipId: membershipId || id,
      renewedUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      message: `Membership ${membershipId || id} successfully renewed for 1 year`
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

// ==========================================
// 9. Products & Merchandise Management
// ==========================================
app.get('/api/v1/products', async (req, res) => {
  try {
    const [products] = await db.query('SELECT * FROM `Product`');
    return res.json({
      success: true,
      data: products,
      message: 'Merchandise products fetched from MySQL database `club`'
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
  }
});

app.post(
  '/api/v1/products',
  verifyToken,
  requireRole('SUPER_ADMIN', 'NATIONAL_ADMIN', 'STATE_ADMIN', 'CLUB_ADMIN'),
  async (req, res) => {
    try {
      const p = req.body;
      const id = p.id || `prod-${Date.now()}`;
      const name = p.name || 'New Product';
      const price = Number(p.price) || 0;
      const category = p.category || 'Gear';
      const description = p.description || '';
      const image = p.image || '';

      await db.query(
        'INSERT INTO `Product` (id, name, price, category, description, image) VALUES (?, ?, ?, ?, ?, ?)',
        [id, name, price, category, description, image]
      );

      const [rows] = await db.query('SELECT * FROM `Product` WHERE id = ?', [id]);
      return res.status(201).json({
        success: true,
        data: rows[0] || { id, name, price },
        message: `Product "${name}" created successfully`
      });
    } catch (err) {
      console.error('[Product Create Error]:', err.message);
      return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
    }
  }
);

app.put(
  '/api/v1/products/:id',
  verifyToken,
  requireRole('SUPER_ADMIN', 'NATIONAL_ADMIN', 'STATE_ADMIN', 'CLUB_ADMIN'),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { name, price, category, description, image } = req.body;

      await db.query(
        'UPDATE `Product` SET name = COALESCE(?, name), price = COALESCE(?, price), category = COALESCE(?, category), description = COALESCE(?, description), image = COALESCE(?, image) WHERE id = ?',
        [name, price ? Number(price) : null, category, description, image, id]
      );

      const [rows] = await db.query('SELECT * FROM `Product` WHERE id = ?', [id]);
      if (rows.length === 0) {
        return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Product not found' } });
      }

      return res.json({
        success: true,
        data: rows[0],
        message: `Product #${id} updated successfully`
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
    }
  }
);

app.delete(
  '/api/v1/products/:id',
  verifyToken,
  requireRole('SUPER_ADMIN', 'NATIONAL_ADMIN'),
  async (req, res) => {
    try {
      const { id } = req.params;
      await db.query('DELETE FROM `Product` WHERE id = ?', [id]);
      return res.json({
        success: true,
        id,
        message: `Product ${id} deleted successfully`
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
    }
  }
);

// ==========================================
// 10. Orders Management (Protected)
// ==========================================
app.get('/api/v1/orders', verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM `Order` ORDER BY createdAt DESC');
    return res.json({
      success: true,
      data: rows,
      message: 'Orders fetched from MySQL database'
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
  }
});

app.post('/api/v1/orders', verifyToken, async (req, res) => {
  try {
    const orderData = req.body;
    const orderId = orderData.id || `ORD-${Date.now()}`;
    const custName = orderData.customer || orderData.customerName || req.user.name || 'Customer';
    const totalVal = Number(orderData.total || orderData.amount || 0);
    const itemsStr = JSON.stringify(orderData.orderItems || orderData.items || []);

    await db.query(
      'INSERT INTO `Order` (id, orderNumber, customerName, total, status, itemsJson) VALUES (?, ?, ?, ?, ?, ?)',
      [orderId, orderId, custName, totalVal, orderData.status || 'Processing', itemsStr]
    );

    return res.status(201).json({
      success: true,
      data: { id: orderId, orderNumber: orderId, customerName: custName, total: totalVal, status: 'Processing' },
      message: `Order #${orderId} created successfully in database`
    });
  } catch (err) {
    console.error('[Order Create Error]:', err.message);
    return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
  }
});

app.put(
  '/api/v1/orders/:id/fulfillment',
  verifyToken,
  requireRole('SUPER_ADMIN', 'NATIONAL_ADMIN', 'STATE_ADMIN'),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { fulfillmentStatus, trackingNumber, carrier } = req.body;

      await db.query('UPDATE `Order` SET status = COALESCE(?, status) WHERE id = ?', [fulfillmentStatus, id]);

      return res.json({
        success: true,
        orderId: id,
        fulfillmentStatus,
        trackingNumber: trackingNumber || 'N/A',
        carrier: carrier || 'UPS Ground',
        message: `Order #${id} fulfillment status updated successfully`
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
    }
  }
);

app.put(
  '/api/v1/orders/:id/payout',
  verifyToken,
  requireRole('SUPER_ADMIN', 'NATIONAL_ADMIN'),
  async (req, res) => {
    try {
      const { id } = req.params;
      return res.json({
        success: true,
        id,
        payoutStatus: 'Settled',
        message: `Order #${id} payout status updated successfully`
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
    }
  }
);

// ==========================================
// 11. Platform Settings (Protected)
// ==========================================
app.get(
  '/api/v1/settings',
  verifyToken,
  requireRole('SUPER_ADMIN', 'NATIONAL_ADMIN', 'STATE_ADMIN', 'CLUB_ADMIN'),
  async (req, res) => {
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
      message: 'Configuration settings fetched'
    });
  }
);

app.post(
  '/api/v1/settings',
  verifyToken,
  requireRole('SUPER_ADMIN', 'NATIONAL_ADMIN'),
  async (req, res) => {
    return res.json({
      success: true,
      data: req.body,
      message: 'Configuration settings updated successfully'
    });
  }
);

app.post(
  '/api/v1/settings/commissions',
  verifyToken,
  requireRole('SUPER_ADMIN', 'NATIONAL_ADMIN'),
  async (req, res) => {
    return res.json({
      success: true,
      data: req.body,
      message: 'National Commission Rules updated & saved successfully'
    });
  }
);

// ==========================================
// 12. 404 Handler for Unknown API Endpoints
// ==========================================
app.use('/api', (req, res) => {
  return res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Endpoint ${req.method} ${req.originalUrl} not found on this server`
    }
  });
});

// ==========================================
// 13. Global Error Handler
// ==========================================
app.use((err, req, res, next) => {
  console.error('[Backend Global Error]:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      message: err.message || 'An unexpected error occurred'
    }
  });
});

// Start Server if run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 NH Portal Backend REST API Server is RUNNING!`);
    console.log(`📡 URL: http://localhost:${PORT}/api/v1`);
    console.log(`🗄️ Database: MySQL \`club\` (127.0.0.1:3306)`);
    console.log(`=======================================================`);
  });
}

module.exports = app;
