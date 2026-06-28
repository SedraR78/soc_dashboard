const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

module.exports = (idsService, authMiddleware) => {
  router.post('/upload-logs', authMiddleware, upload.single('file'), (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ error: 'Aucun fichier' });
      const content = req.file.buffer.toString('utf-8');
      const parseResult = idsService.parseLogFile(content);
      const incidents = idsService.createIncidentsFromDetections(parseResult.detections);
      res.json({
        linesProcessed: parseResult.linesProcessed,
        anomaliesFound: parseResult.anomaliesFound,
        incidentsCreated: incidents.length
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get('/alerts', authMiddleware, (req, res) => {
    try {
      const { severity, limit = 50 } = req.query;
      let alerts = idsService.getIncidents(parseInt(limit));
      if (severity) alerts = alerts.filter(a => a.severity === severity);
      res.json({ totalCount: alerts.length, alerts });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
