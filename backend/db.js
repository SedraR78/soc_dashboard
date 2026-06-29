const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcryptjs = require('bcryptjs');

const DB_PATH = path.join(__dirname, 'soc.db');
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) console.error('DB Error:', err);
  else console.log('✅ SQLite Database Connected');
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT DEFAULT 'analyst',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      lastLogin DATETIME
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS incidents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      sourceIP TEXT NOT NULL,
      severity TEXT NOT NULL,
      status TEXT DEFAULT 'open',
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      description TEXT
    )
  `);

  db.get(`SELECT * FROM users WHERE email = 'analyst@holberton.io'`, (err, row) => {
    if (!row) {
      const hashedPassword = bcryptjs.hashSync('Holberton2024!', 10);
      db.run(
        `INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)`,
        ['analyst@holberton.io', hashedPassword, 'Sedra Analyst', 'analyst'],
        (err) => {
          if (err) console.error('User insert error:', err);
          else console.log('✅ Default user created');
        }
      );
    }
  });

  db.get(`SELECT COUNT(*) as count FROM incidents`, (err, result) => {
    if (result && result.count === 0) {
      const mockIncidents = [
        { type: 'SSH Brute Force', sourceIP: '192.168.1.105', severity: 'high', status: 'open' },
        { type: 'Port Scan', sourceIP: '10.0.0.54', severity: 'medium', status: 'investigating' },
        { type: 'SQL Injection', sourceIP: '172.16.0.22', severity: 'high', status: 'open' },
        { type: 'DDoS Attack', sourceIP: '203.0.113.42', severity: 'critical', status: 'open' },
        { type: 'Malware Detection', sourceIP: '198.51.100.89', severity: 'high', status: 'open' }
      ];
      
      mockIncidents.forEach(inc => {
        db.run(
          `INSERT INTO incidents (type, sourceIP, severity, status) VALUES (?, ?, ?, ?)`,
          [inc.type, inc.sourceIP, inc.severity, inc.status],
          (err) => {
            if (err) console.error('Incident insert error:', err);
          }
        );
      });
      console.log('✅ Mock incidents populated');
    }
  });
});

module.exports = db;
