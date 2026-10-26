const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../db');
const { getJwtSecret } = require('../middlewares/authMiddleware');

const register = async (req, res) => {
  try {
    const { name, email, password, role, phone, stateCode, clubId } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_INPUT', message: 'Name, email, and password are required' }
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const [existing] = await db.query('SELECT id FROM `User` WHERE LOWER(email) = ?', [cleanEmail]);
    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        error: { code: 'EMAIL_EXISTS', message: 'Email address is already registered' }
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userId = `usr-${Date.now()}`;

    // Verify whether this email has an approved administrator claim
    const [approvedClaims] = await db.query(
      'SELECT club, state FROM `ClubClaim` WHERE LOWER(email) = ? AND claimStatus = "Approved" ORDER BY createdAt DESC LIMIT 1',
      [cleanEmail]
    );

    let assignedRole = 'MEMBER';
    let assignedState = stateCode || 'TX';
    if (approvedClaims.length > 0) {
      const claim = approvedClaims[0];
      const isState = claim.club && (
        claim.club.toLowerCase().includes('state association') ||
        claim.club.toLowerCase().includes('state hound') ||
        claim.club.toLowerCase().includes('state chapter')
      );
      assignedRole = isState ? 'STATE_ADMIN' : 'CLUB_ADMIN';
      assignedState = (claim.state || assignedState).toUpperCase();
      console.log(`[Register] User ${cleanEmail} registered with verified approved claim -> Role: ${assignedRole}, State: ${assignedState}`);
    }

    await db.query(
      `INSERT INTO \`User\` (id, email, passwordHash, name, role, phone, stateCode, clubId)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, cleanEmail, passwordHash, name.trim(), assignedRole, phone || '', assignedState, clubId || 'club-1']
    );

    const token = jwt.sign(
      { id: userId, name: name.trim(), email: cleanEmail, role: assignedRole, stateCode: assignedState, clubId: clubId || 'club-1' },
      getJwtSecret(),
      { expiresIn: '24h' }
    );

    return res.status(201).json({
      success: true,
      data: {
        user: { id: userId, name: name.trim(), email: cleanEmail, role: assignedRole, stateCode: assignedState },
        token
      },
      message: 'Account created successfully in MySQL database `club`'
    });

  } catch (err) {
    console.error('[Register Auth Error]:', err.message);
    return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_INPUT', message: 'Email and password are required' }
      });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const [rows] = await db.query('SELECT * FROM `User` WHERE LOWER(email) = ?', [cleanEmail]);
    const user = rows[0];

    if (!user) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' }
      });
    }

    if (!user.passwordHash) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Account requires password configuration' }
      });
    }

    const isMatch = await bcrypt.compare(String(password), user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' }
      });
    }

    const tokenPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role || 'MEMBER',
      stateCode: user.stateCode || null,
      clubId: user.clubId || null
    };

    const token = jwt.sign(
      tokenPayload,
      getJwtSecret(),
      { expiresIn: '24h' }
    );

    return res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role || 'MEMBER',
          phone: user.phone || '',
          stateCode: user.stateCode || null,
          clubId: user.clubId || null
        },
        token
      },
      message: 'Login successful via MySQL database `club`'
    });
  } catch (err) {
    console.error('[Login Auth Error]:', err.message);
    return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
  }
};

const getProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
      });
    }

    const [rows] = await db.query(
      'SELECT id, email, name, role, phone, stateCode, clubId, createdAt FROM `User` WHERE id = ?',
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'USER_NOT_FOUND', message: 'User profile not found in database' }
      });
    }

    return res.json({
      success: true,
      data: rows[0],
      message: 'Member profile fetched from MySQL database `club`'
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
  }
};

module.exports = {
  register,
  login,
  getProfile
};

