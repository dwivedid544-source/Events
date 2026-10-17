const db = require('../db');

const getStates = async (req, res) => {
  try {
    const { organization, search } = req.query;
    let query = 'SELECT * FROM `StateAssociation` WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND (LOWER(name) LIKE ? OR LOWER(code) LIKE ? OR LOWER(adminName) LIKE ?)';
      const term = `%${search.toLowerCase()}%`;
      params.push(term, term, term);
    }

    const [rows] = await db.query(query, params);

    // Format organizations as string array for frontend compatibility
    let formatted = rows.map((s) => ({
      ...s,
      organizations: typeof s.organizations === 'string' ? s.organizations.split(',') : (s.organizations || ['UKC', 'PKC'])
    }));

    if (organization && organization !== 'All') {
      formatted = formatted.filter((s) =>
        Array.isArray(s.organizations) && s.organizations.some((org) => org.toUpperCase() === organization.toUpperCase())
      );
    }

    return res.json({
      success: true,
      data: formatted,
      count: formatted.length,
      message: 'States fetched directly from MySQL database `club`'
    });
  } catch (err) {
    console.error('[States Controller Error]:', err.message);
    return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
  }
};

const getStateById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM `StateAssociation` WHERE id = ? OR LOWER(code) = ?', [id, id.toLowerCase()]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'State Association not found' } });
    }

    const state = {
      ...rows[0],
      organizations: typeof rows[0].organizations === 'string' ? rows[0].organizations.split(',') : (rows[0].organizations || ['UKC', 'PKC'])
    };

    return res.json({ success: true, data: state, message: 'State details fetched from database `club`' });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
  }
};

const pledgeStateDonation = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, tier, cause, donorName, donorEmail } = req.body;
    const pledgeId = `plg-state-${Date.now()}`;

    await db.query(
      `INSERT INTO \`DonationPledge\` (id, entityType, entityId, amount, tier, cause, donorName, donorEmail, status)
       VALUES (?, 'STATE', ?, ?, ?, ?, ?, ?, 'PENDING_GATEWAY')`,
      [pledgeId, id, Number(amount) || 25.00, tier || 'Supporter Tier', cause || 'General State Support', donorName || 'Anonymous', donorEmail || '']
    );

    return res.status(201).json({
      success: true,
      data: { id: pledgeId, stateId: id, amount: Number(amount) || 25.00, status: 'PENDING_GATEWAY' },
      message: 'State donation pledge saved to MySQL database `club`'
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
  }
};

module.exports = {
  getStates,
  getStateById,
  pledgeStateDonation
};
