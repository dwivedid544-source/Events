const db = require('../db');

const getEvents = async (req, res) => {
  try {
    const { state, clubId, federation, type } = req.query;
    let query = 'SELECT * FROM `Event` WHERE 1=1';
    const params = [];

    if (state) {
      query += ' AND (stateCode = ? OR state = ?)';
      params.push(state, state);
    }
    if (clubId) {
      query += ' AND (clubId = ? OR LOWER(club) LIKE ?)';
      params.push(clubId, `%${clubId.toLowerCase()}%`);
    }
    if (federation) {
      query += ' AND federation = ?';
      params.push(federation);
    }
    if (type) {
      query += ' AND type = ?';
      params.push(type);
    }

    const [rows] = await db.query(query, params);

    return res.json({
      success: true,
      data: rows,
      count: rows.length,
      message: 'Events fetched directly from MySQL database `club`'
    });
  } catch (err) {
    console.error('[Events Controller Error]:', err.message);
    return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
  }
};

const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM `Event` WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Event not found' } });
    }

    return res.json({ success: true, data: rows[0], message: 'Event details fetched from database `club`' });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
  }
};

const getEntries = async (req, res) => {
  try {
    const { eventId } = req.query;
    let query = 'SELECT * FROM `EventEntry` WHERE 1=1';
    const params = [];

    if (eventId) {
      query += ' AND eventId = ?';
      params.push(eventId);
    }

    const [rows] = await db.query(query, params);

    return res.json({
      success: true,
      data: rows,
      count: rows.length,
      message: 'Event Entries fetched directly from MySQL database `club`'
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
  }
};

const preSignUpEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const { dogId, participant, handlerPhone, entryFee } = req.body;
    const entryId = `ent-${Date.now()}`;
    const confirmationCode = `UHC-${Date.now().toString().slice(-6)}`;

    await db.query(
      `INSERT INTO \`EventEntry\` (id, eventId, dogId, participant, handlerPhone, fee, paymentStatus, confirmationCode)
       VALUES (?, ?, ?, ?, ?, ?, 'Paid', ?)`,
      [entryId, id, dogId || null, participant || 'Handler', handlerPhone || '', Number(entryFee) || 30.00, confirmationCode]
    );

    await db.query('UPDATE `Event` SET entriesCount = entriesCount + 1 WHERE id = ?', [id]);

    return res.status(201).json({
      success: true,
      data: { id: entryId, eventId: id, confirmationCode, status: 'CONFIRMED' },
      message: 'Pre-signup entry saved directly to MySQL database `club`'
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
  }
};

module.exports = {
  getEvents,
  getEventById,
  getEntries,
  preSignUpEntry
};
