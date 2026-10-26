const db = require('../db');

const getMembers = async (req, res) => {
  try {
    const { club, state } = req.query;
    let query = 'SELECT * FROM `Member` WHERE 1=1';
    const params = [];

    if (club) {
      query += ' AND LOWER(club) LIKE ?';
      params.push(`%${club.toLowerCase()}%`);
    }
    if (state) {
      query += ' AND (LOWER(state) LIKE ? OR LOWER(state) = ?)';
      params.push(`%${state.toLowerCase()}%`, state.toLowerCase());
    }

    const [rows] = await db.query(query, params);

    return res.json({
      success: true,
      data: rows,
      count: rows.length,
      message: 'Members fetched directly from MySQL database `club`'
    });
  } catch (err) {
    console.error('[Members Controller Error - getMembers]:', err.message);
    return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
  }
};

const createMember = async (req, res) => {
  try {
    const memberData = req.body;
    const name = memberData.name || `${memberData.firstName || 'Member'} ${memberData.lastName || ''}`.trim();
    const email = (memberData.email || '').trim().toLowerCase();
    const phone = memberData.phone || '';
    const state = memberData.state || memberData.selectedState || 'Tennessee';
    const club = memberData.club || memberData.selectedClub || 'Oak Ridge Hunting Club';
    const status = memberData.status || 'Active';
    const duesAmount = Number(memberData.duesAmount || memberData.amountPaid || memberData.price) || 35.0;
    const joinDate = memberData.joined || memberData.joinDate || new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    const id = memberData.id || `mem-${Date.now()}`;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_INPUT', message: 'Name and email are required to register a member' }
      });
    }

    await db.query(
      `INSERT INTO \`Member\` (id, name, email, phone, state, club, status, duesAmount, joinDate)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         name = VALUES(name), phone = VALUES(phone), state = VALUES(state), club = VALUES(club), status = VALUES(status), duesAmount = VALUES(duesAmount)`,
      [id, name, email, phone, state, club, status, duesAmount, joinDate]
    );

    const [rows] = await db.query('SELECT * FROM `Member` WHERE id = ?', [id]);
    return res.status(201).json({
      success: true,
      data: rows[0] || { id, name, email, state, club, status },
      message: `Member "${name}" registered successfully in database`
    });
  } catch (err) {
    console.error('[Members Controller Error - createMember]:', err.message);
    return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
  }
};

const updateMemberStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_INPUT', message: 'Status is required' }
      });
    }

    const [existing] = await db.query('SELECT id FROM `Member` WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: `Member #${id} not found` }
      });
    }

    await db.query('UPDATE `Member` SET `status` = ? WHERE `id` = ?', [status, id]);

    return res.json({
      success: true,
      memberId: id,
      status,
      message: `Member ${id} status updated to ${status} successfully`
    });
  } catch (err) {
    console.error('[Members Controller Error - updateMemberStatus]:', err.message);
    return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
  }
};

module.exports = {
  getMembers,
  createMember,
  updateMemberStatus
};

