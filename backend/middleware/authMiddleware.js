const authMiddleware = (authService) => {
  return (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token manquant' });
      }
      const token = authHeader.substring(7);
      const decoded = authService.verifyToken(token);
      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ error: 'Token invalide ou expiré' });
    }
  };
};

module.exports = authMiddleware;
