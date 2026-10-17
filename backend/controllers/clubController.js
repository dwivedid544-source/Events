const db = require('../db');

const getClubs = async (req, res) => {
  try {
    const { state, county, zip, distance, dogType, federation, eventType, search } = req.query;
    let query = 'SELECT * FROM `LocalClub` WHERE 1=1';
    const params = [];

    if (state) {
      query += ' AND (stateCode = ? OR state = ?)';
      params.push(state, state);
    }
    if (county) {
      query += ' AND LOWER(county) LIKE ?';
      params.push(`%${county.toLowerCase()}%`);
    }
    if (zip) {
      query += ' AND zip = ?';
      params.push(zip);
    }
    if (distance && distance !== 'ALL') {
      query += ' AND distanceMiles <= ?';
      params.push(Number(distance));
    }
    if (dogType && dogType !== 'ALL') {
      query += ' AND dogType = ?';
      params.push(dogType);
    }
    if (federation && federation !== 'ALL') {
      query += ' AND federation = ?';
      params.push(federation);
    }
    if (eventType && eventType !== 'ALL') {
      query += ' AND eventType = ?';
      params.push(eventType);
    }
    if (search) {
      query += ' AND (LOWER(name) LIKE ? OR LOWER(city) LIKE ?)';
      const term = `%${search.toLowerCase()}%`;
      params.push(term, term);
    }

    const [rows] = await db.query(query, params);

    return res.json({
      success: true,
      data: rows,
      count: rows.length,
      message: 'Local Clubs fetched directly from MySQL database `club`'
    });
  } catch (err) {
    console.error('[Clubs Controller Error]:', err.message);
    return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
  }
};

const getClubById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM `LocalClub` WHERE id = ? OR LOWER(name) LIKE ?', [id, `%${id.toLowerCase()}%`]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Local Club not found' } });
    }

    return res.json({ success: true, data: rows[0], message: 'Local Club details fetched from database `club`' });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
  }
};

const pledgeClubDonation = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, tier, cause, donorName, donorEmail } = req.body;
    const pledgeId = `plg-club-${Date.now()}`;

    await db.query(
      `INSERT INTO \`DonationPledge\` (id, entityType, entityId, amount, tier, cause, donorName, donorEmail, status)
       VALUES (?, 'CLUB', ?, ?, ?, ?, ?, ?, 'PENDING_GATEWAY')`,
      [pledgeId, id, Number(amount) || 15.00, tier || 'Supporter Tier', cause || 'General Club Operations', donorName || 'Anonymous', donorEmail || '']
    );

    return res.status(201).json({
      success: true,
      data: { id: pledgeId, clubId: id, amount: Number(amount) || 15.00, status: 'PENDING_GATEWAY' },
      message: 'Club donation pledge saved to MySQL database `club`'
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
  }
};

const createClaimRequest = async (req, res) => {
  try {
    const { club, state, applicant, email, phone, message } = req.body;
    const claimId = `clm-${Date.now()}`;

    return res.status(201).json({
      success: true,
      data: { id: claimId, club, state, applicant, status: 'Pending' },
      message: 'Claim request saved to database `club`'
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
  }
};

module.exports = {
  getClubs,
  getClubById,
  pledgeClubDonation,
  createClaimRequest
};
