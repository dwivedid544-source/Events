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
    console.error('[Members Controller Error]:', err.message);
    return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
  }
};

module.exports = {
  getMembers
};
