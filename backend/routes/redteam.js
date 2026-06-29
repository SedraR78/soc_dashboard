const express = require('express');

module.exports = (redTeamService, authMiddleware) => {
  const router = express.Router();

  router.post('/simulate', authMiddleware, async (req, res) => {
    try {
      const { attackType } = req.body;
      console.log('🎯 Red Team Simulation:', attackType);
      console.log('🔐 User authenticated:', req.user);

      const result = redTeamService.simulateAttack(attackType);
      res.json(result);
    } catch (error) {
      console.error('❌ RedTeam Error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};
