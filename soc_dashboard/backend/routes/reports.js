const express = require('express');
const router = express.Router();

module.exports = (reportService, authMiddleware) => {
  router.post('/generate', authMiddleware, async (req, res) => {
    try {
      const { incidentId } = req.body;
      if (!incidentId) return res.status(400).json({ error: 'incidentId requis' });
      const report = await reportService.generateReport(incidentId);
      res.json({ success: true, ...report });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  return router;
};
