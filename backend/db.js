const path = require('path');

let pool;

if (process.env.NODE_ENV === 'test') {
  // STRICT SAFEGUARD: Refuse execution if connected to remote/Railway database
  const host = (process.env.DB_HOST || '').toLowerCase();
  const dbUrl = (process.env.DATABASE_URL || '').toLowerCase();
  if (host.includes('rlwy.net') || host.includes('railway') || dbUrl.includes('rlwy.net') || dbUrl.includes('railway')) {
    throw new Error('FATAL SECURITY VIOLATION: Test suite attempted to connect to remote/Railway database. Execution blocked.');
  }

  // Use dedicated local isolated SQLite database for all test runs
  const sqlite3 = require('sqlite3').verbose();
  const testDbFile = path.resolve(__dirname, 'tests', 'test_isolated.sqlite');
  const sqliteDb = new sqlite3.Database(testDbFile);

  // Compatible mysql2/promise interface
  pool = {
    isTestDatabase: true,
    dbPath: testDbFile,
    _sqlite: sqliteDb,
    query: (sql, params = []) => {
      return new Promise((resolve, reject) => {
        const trimmed = (sql || '').trim();
        const upper = trimmed.toUpperCase();
        const safeParams = (params || []).map(p => (p === undefined ? null : p));

        if (upper.startsWith('SELECT') || upper.startsWith('PRAGMA') || upper.startsWith('EXPLAIN')) {
          sqliteDb.all(trimmed, safeParams, (err, rows) => {
            if (err) return reject(err);
            resolve([rows || [], []]);
          });
        } else {
          sqliteDb.run(trimmed, safeParams, function (err) {
            if (err) return reject(err);
            resolve([{ affectedRows: this ? this.changes : 0, insertId: this ? this.lastID : null }, []]);
          });
        }
      });
    },
    close: () => {
      return new Promise((resolve, reject) => {
        sqliteDb.close((err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }
  };
} else {
  const mysql = require('mysql2/promise');
  pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'club',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
}

module.exports = pool;

