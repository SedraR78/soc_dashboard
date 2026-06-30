const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

module.exports = (db, authMiddleware) => {
  router.post('/upload-logs', authMiddleware, upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'Aucun fichier' });

    const content = req.file.buffer.toString('utf-8');
    const lines = content.split('\n').filter(l => l.trim());
    let sshCount = 0;

    lines.forEach(line => {
      const lower = line.toLowerCase();
      if (lower.includes('failed password') || lower.includes('invalid user')) sshCount++;
    });

    if (sshCount >= 5) {
      const ip = content.match(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/)?.[0] || '0.0.0.0';
      db.run(
        'INSERT INTO incidents (type, sourceIP, severity, status, description) VALUES (?, ?, ?, ?, ?)',
        ['SSH Brute Force', ip, 'high', 'open', `${sshCount} tentatives SSH échouées`],
        function(err) {
          if (err) return res.status(500).json({ error: err.message });
          res.json({ linesProcessed: lines.length, anomaliesFound: sshCount, incidentsCreated: 1 });
        }
      );
    } else {
      res.json({ linesProcessed: lines.length, anomaliesFound: sshCount, incidentsCreated: 0 });
    }
  });

  router.get('/alerts', authMiddleware, (req, res) => {
    const { severity, limit = 50 } = req.query;
    let query = 'SELECT * FROM incidents ORDER BY timestamp DESC LIMIT ?';
    const params = [parseInt(limit)];

    if (severity) {
      query = 'SELECT * FROM incidents WHERE severity = ? ORDER BY timestamp DESC LIMIT ?';
      params.unshift(severity);
    }

    db.all(query, params, (err, alerts) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ totalCount: alerts.length, alerts });
    });
  });

  return router;
};
