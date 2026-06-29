const express = require('express');
const router = express.Router();

module.exports = (redTeamService, authMiddleware) => {
  router.post('/simulate', authMiddleware, (req, res) => {
    try {
      const { attackType, targetIP } = req.body;
      if (!attackType) return res.status(400).json({ error: 'attackType requis' });
      const supportedTypes = ['ssh', 'portscan', 'sqli', 'ddos'];
      if (!supportedTypes.includes(attackType)) {
        return res.status(400).json({ error: `Type invalide. Supportés: ${supportedTypes.join(', ')}` });
      }
      const result = redTeamService.simulate(attackType, targetIP);
      res.json({ success: true, ...result });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
