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

const createEvent = async (req, res) => {
  try {
    const data = req.body;
    const id = data.id || `evt-${Date.now()}`;
    const name = data.name || 'Sanctioned Hunt Event';
    const federation = data.federation || 'UKC (United Kennel Club)';
    const sport = data.sport || 'Coonhounds';
    const type = data.type || 'Nite Hunt';
    const club = data.club || 'Oak Ridge Hunting Club';
    const clubId = data.clubId || 'club-1';
    const state = data.state || 'Tennessee';
    const stateCode = data.stateCode || (state === 'Tennessee' ? 'TN' : 'TN');
    const city = data.city || 'Knoxville';
    const date = data.date || 'October 15, 2026';
    const fee = Number(data.fee) || 30.0;
    const entriesCount = Number(data.entriesCount !== undefined ? data.entriesCount : (data.entries || 0));
    const maxCapacity = Number(data.maxCapacity) || 50;
    const status = data.status || 'Registration Open';
    const deadline = data.deadline || 'Oct 14, 2026';
    const address = data.address || '1420 Hunting Ridge Rd, Knoxville, TN 37901';
    const description = data.description || 'Sanctioned hunt event.';
    const startTime = data.startTime || '7:00 PM';

    await db.query(
      `INSERT INTO \`Event\` (id, name, federation, sport, type, club, clubId, state, stateCode, city, date, fee, entriesCount, maxCapacity, status, deadline, address, description, startTime)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, name, federation, sport, type, club, clubId, state, stateCode, city, date, fee, entriesCount, maxCapacity, status, deadline, address, description, startTime]
    );

    const newEvt = {
      id,
      name,
      federation,
      sport,
      type,
      club,
      clubId,
      state,
      stateCode,
      city,
      date,
      fee,
      entriesCount,
      entries: entriesCount,
      maxCapacity,
      status,
      deadline,
      address,
      description,
      startTime
    };

    return res.status(201).json({
      success: true,
      data: newEvt,
      message: `Event "${name}" created directly in MySQL database \`club\``
    });
  } catch (err) {
    console.error('[Create Event Error]:', err.message);
    return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
  }
};

const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const fields = [];
    const params = [];

    const allowed = [
      'name',
      'federation',
      'sport',
      'type',
      'club',
      'clubId',
      'state',
      'stateCode',
      'city',
      'date',
      'fee',
      'entriesCount',
      'maxCapacity',
      'status',
      'deadline',
      'address',
      'description',
      'startTime'
    ];

    for (const key of allowed) {
      if (data[key] !== undefined) {
        fields.push(`\`${key}\` = ?`);
        params.push(data[key]);
      }
    }

    if (fields.length > 0) {
      params.push(id);
      await db.query(`UPDATE \`Event\` SET ${fields.join(', ')} WHERE id = ?`, params);
    }

    const [rows] = await db.query('SELECT * FROM `Event` WHERE id = ?', [id]);

    return res.json({
      success: true,
      data: rows[0] || { id, ...data },
      message: `Event "${data.name || id}" updated in MySQL database \`club\``
    });
  } catch (err) {
    console.error('[Update Event Error]:', err.message);
    return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM `EventEntry` WHERE eventId = ?', [id]);
    await db.query('DELETE FROM `Event` WHERE id = ?', [id]);

    return res.json({
      success: true,
      message: `Event "${id}" removed from MySQL database \`club\``
    });
  } catch (err) {
    console.error('[Delete Event Error]:', err.message);
    return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
  }
};

module.exports = {
  getEvents,
  getEventById,
  getEntries,
  preSignUpEntry,
  createEvent,
  updateEvent,
  deleteEvent
};
