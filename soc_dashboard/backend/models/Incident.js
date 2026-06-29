const db = require('../db');

class Incident {
  constructor(id, timestamp, attackType, sourceIP, targetResource, severity = 'medium', status = 'open', detectedBy = 'IDS_RULE_001', description = '', comments = []) {
    this.id = id;
    this.timestamp = timestamp || new Date().toISOString();
    this.attackType = attackType;
    this.sourceIP = sourceIP;
    this.targetResource = targetResource;
    this.severity = severity;
    this.status = status;
    this.detectedBy = detectedBy;
    this.description = description;
    this.comments = comments;
  }

  toJSON() {
    return {
      id: this.id,
      timestamp: this.timestamp,
      attackType: this.attackType,
      sourceIP: this.sourceIP,
      targetResource: this.targetResource,
      severity: this.severity,
      status: this.status,
      detectedBy: this.detectedBy,
      description: this.description,
      comments: this.comments
    };
  }

  static create(attackType, sourceIP, targetResource, severity = 'medium', status = 'open', description = '') {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO incidents (type, sourceIP, severity, status, description) VALUES (?, ?, ?, ?, ?)`,
        [attackType, sourceIP, severity, status, description],
        function(err) {
          if (err) reject(err);
          else resolve(new Incident(this.lastID, new Date().toISOString(), attackType, sourceIP, targetResource, severity, status));
        }
      );
    });
  }

  static getAll() {
    return new Promise((resolve, reject) => {
      db.all(`SELECT * FROM incidents ORDER BY timestamp DESC`, (err, rows) => {
        if (err) reject(err);
        else resolve(rows.map(row => new Incident(row.id, row.timestamp, row.type, row.sourceIP, '', row.severity, row.status, 'IDS_RULE_001', row.description)));
      });
    });
  }

  static getRecent(limit = 10) {
    return new Promise((resolve, reject) => {
      db.all(`SELECT * FROM incidents ORDER BY timestamp DESC LIMIT ?`, [limit], (err, rows) => {
        if (err) reject(err);
        else resolve(rows.map(row => new Incident(row.id, row.timestamp, row.type, row.sourceIP, '', row.severity, row.status)));
      });
    });
  }

  static getBySeverity(severity) {
    return new Promise((resolve, reject) => {
      db.all(`SELECT * FROM incidents WHERE severity = ? ORDER BY timestamp DESC`, [severity], (err, rows) => {
        if (err) reject(err);
        else resolve(rows.map(row => new Incident(row.id, row.timestamp, row.type, row.sourceIP, '', row.severity, row.status)));
      });
    });
  }

  updateStatus(newStatus) {
    return new Promise((resolve, reject) => {
      db.run(`UPDATE incidents SET status = ? WHERE id = ?`, [newStatus, this.id], (err) => {
        if (err) reject(err);
        else {
          this.status = newStatus;
          resolve(this);
        }
      });
    });
  }

  static count() {
    return new Promise((resolve, reject) => {
      db.get(`SELECT COUNT(*) as count FROM incidents`, (err, row) => {
        if (err) reject(err);
        else resolve(row.count);
      });
    });
  }
}

module.exports = Incident;
