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
    if (result.count === 0) {
      const mockIncidents = [
        ['SSH Brute Force', '192.168.1.105', 'high', 'open'],
        ['Port Scan', '10.0.0.54', 'medium', 'investigating'],
        ['SQL Injection', '172.16.0.22', 'high', 'open']
      ];
      mockIncidents.forEach(inc => {
        db.run(
          `INSERT INTO incidents (type, sourceIP, severity, status) VALUES (?, ?, ?, ?)`,
          inc
        );
      });
      console.log('✅ Mock incidents populated');
    }
  });
});

module.exports = db;
