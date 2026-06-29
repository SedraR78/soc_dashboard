const express = require('express');
const router = express.Router();

module.exports = (threatAnalysisService, authMiddleware) => {
  router.get('/ip/:ipAddress', authMiddleware, async (req, res) => {
    try {
      const { ipAddress } = req.params;
      const ipRegex = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
      if (!ipRegex.test(ipAddress)) return res.status(400).json({ error: 'Format IP invalide' });
      const analysis = await threatAnalysisService.analyzeIP(ipAddress);
      res.json(analysis);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post('/block', authMiddleware, (req, res) => {
    try {
      const { ipAddress } = req.body;
      if (!ipAddress) return res.status(400).json({ error: 'IP address required' });
      threatAnalysisService.blockIP(ipAddress);
      res.json({ success: true, message: `IP ${ipAddress} bloquée` });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
