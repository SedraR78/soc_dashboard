const express = require('express');
const router = express.Router();

module.exports = (terminalService, authMiddleware) => {
  router.post('/execute', authMiddleware, (req, res) => {
    try {
      const { command } = req.body;
      if (!command) return res.status(400).json({ error: 'Commande requise' });
      const result = terminalService.executeCommand(command);
      res.json({
        command,
        ...result,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
