const express = require('express');

const ATTACK_TYPES = {
  ssh: { type: 'SSH Brute Force', severity: 'high', description: 'SSH Brute Force simulation - 25 login attempts detected' },
  portscan: { type: 'Port Scan', severity: 'medium', description: 'Port Scan detected on network' },
  sqli: { type: 'SQL Injection', severity: 'high', description: 'SQL Injection attack detected on login endpoint' },
  ddos: { type: 'DDoS Attack', severity: 'critical', description: 'DDoS attack simulation - server flooded' }
};

module.exports = (db, authMiddleware) => {
  const router = express.Router();

  router.post('/simulate', authMiddleware, (req, res) => {
    const { attackType } = req.body;
    if (!attackType) return res.status(400).json({ error: 'attackType requis' });

    const attack = ATTACK_TYPES[attackType];
    if (!attack) return res.status(400).json({ error: 'attackType invalide' });

    const sourceIP = `203.0.113.${Math.floor(Math.random() * 200) + 40}`;

    db.run(
      'INSERT INTO incidents (type, sourceIP, severity, status, description) VALUES (?, ?, ?, ?, ?)',
      [attack.type, sourceIP, attack.severity, 'open', attack.description],
      function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ simulationId: `SIM-${Date.now()}`, attackType, detectionRate: 100, incidentsCreated: 1, incidentId: this.lastID, status: 'completed', timestamp: new Date().toISOString() });
      }
    );
  });

  return router;
};
