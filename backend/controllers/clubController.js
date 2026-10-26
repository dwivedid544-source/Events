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
  const claimController = require('./claimController');
  return claimController.createClaim(req, res);
};

const createClub = async (req, res) => {
  try {
    const data = req.body;
    const id = data.id || `club-${Date.now()}`;
    const name = data.name || 'New Local Hunting Club';
    const city = data.city || '';
    const county = data.county || '';
    const state = data.state || 'Hawaii';
    const stateCode = (data.stateCode || (state === 'Hawaii' ? 'HI' : 'TN')).toUpperCase();
    const stateId = (data.stateId || stateCode.toLowerCase());
    const zip = data.zip || '';
    const distanceMiles = Number(data.distanceMiles) || 15;
    const dogType = data.dogType || 'Treeing Walker Coonhound';
    const federation = data.federation || 'UKC (United Kennel Club)';
    const eventType = data.eventType || 'Nite Hunt';
    const adminName = data.adminName || req.user?.name || '';

    await db.query(
      `INSERT INTO \`LocalClub\` (id, name, city, county, state, stateCode, stateId, zip, distanceMiles, dogType, federation, eventType, adminName)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, name, city, county, state, stateCode, stateId, zip, distanceMiles, dogType, federation, eventType, adminName]
    );

    const [rows] = await db.query('SELECT * FROM `LocalClub` WHERE id = ?', [id]);
    return res.status(201).json({
      success: true,
      data: rows[0] || { id, name, city, state, stateCode },
      message: `Club "${name}" created successfully in MySQL database \`club\``
    });
  } catch (err) {
    console.error('[Create Club Error]:', err.message);
    return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
  }
};

const updateClub = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      city,
      state,
      zip,
      county,
      dogType,
      federation,
      eventType,
      adminName
    } = req.body;

    console.log(`📡 [API Call]: PUT /api/v1/clubs/${id} - Updating club data for: ${name || id}`);

    await db.query(
      `UPDATE \`LocalClub\`
       SET name = COALESCE(?, name),
           city = COALESCE(?, city),
           state = COALESCE(?, state),
           zip = COALESCE(?, zip),
           county = COALESCE(?, county),
           dogType = COALESCE(?, dogType),
           federation = COALESCE(?, federation),
           eventType = COALESCE(?, eventType),
           adminName = COALESCE(?, adminName)
       WHERE id = ?`,
      [name, city, state, zip, county, dogType, federation, eventType, adminName, id]
    );

    const [rows] = await db.query('SELECT * FROM `LocalClub` WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Club not found' } });
    }

    return res.json({
      success: true,
      message: `Club ${rows[0].name} details updated successfully`,
      data: { ...rows[0], updatedAt: new Date().toISOString() }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
  }
};

module.exports = {
  getClubs,
  getClubById,
  pledgeClubDonation,
  createClaimRequest,
  createClub,
  updateClub
};

