const db = require('../db');
const bcryptjs = require('bcryptjs');

class User {
  constructor(id, email, password, name, role = 'analyst', createdAt = null, lastLogin = null) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.name = name;
    this.role = role;
    this.createdAt = createdAt || new Date();
    this.lastLogin = lastLogin;
  }

  toJSON() {
    const { password, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }

  static create(email, password, name, role = 'analyst') {
    return new Promise((resolve, reject) => {
      bcryptjs.hash(password, 10, (err, hashedPassword) => {
        if (err) return reject(err);
        
        db.run(
          `INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)`,
          [email, hashedPassword, name, role],
          function(error) {
            if (error) reject(error);
            else resolve(new User(this.lastID, email, hashedPassword, name, role));
          }
        );
      });
    });
  }

  static findByEmail(email) {
    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, row) => {
        if (err) reject(err);
        else resolve(row ? new User(row.id, row.email, row.password, row.name, row.role, row.createdAt, row.lastLogin) : null);
      });
    });
  }

  static findById(id) {
    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM users WHERE id = ?`, [id], (err, row) => {
        if (err) reject(err);
        else resolve(row ? new User(row.id, row.email, row.password, row.name, row.role, row.createdAt, row.lastLogin) : null);
      });
    });
  }

  updateLastLogin() {
    return new Promise((resolve, reject) => {
      db.run(`UPDATE users SET lastLogin = CURRENT_TIMESTAMP WHERE id = ?`, [this.id], (err) => {
        if (err) reject(err);
        else {
          this.lastLogin = new Date();
          resolve(this);
        }
      });
    });
  }
}

module.exports = User;
