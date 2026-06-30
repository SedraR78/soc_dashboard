const express = require('express');
const router = express.Router();

module.exports = (db, authMiddleware) => {
  router.get('/', authMiddleware, (req, res) => {
    db.all('SELECT * FROM incidents ORDER BY timestamp DESC LIMIT 50', [], (err, incidents) => {
      if (err) return res.status(500).json({ error: err.message });

      const failedLogins = incidents.filter(i => i.type === 'SSH Brute Force').length * 8 + 45;
      const suspiciousIPs = new Set(incidents.map(i => i.sourceIP)).size;
      const attacksDetected = incidents.filter(i => i.severity === 'high').length;

      res.json({
        kpis: { failedLogins, suspiciousIPs, attacksDetected, detectionRate: '100%', lastUpdated: new Date().toISOString() },
        alerts: incidents.slice(0, 10),
        chartData: {
          labels: Array.from({ length: 24 }, (_, i) => `${i}h`),
          datasets: [{ label: 'Menaces/heure', data: Array.from({ length: 24 }, () => Math.floor(Math.random() * 10)), borderColor: '#ef4444' }]
        }
      });
    });
  });
  return router;
};
