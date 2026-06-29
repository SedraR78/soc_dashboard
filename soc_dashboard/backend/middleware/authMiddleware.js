module.exports = (authService) => {
  return (req, res, next) => {
    try {
      const authHeader = req.headers['authorization'];
      console.log('📍 AUTH HEADER:', authHeader ? '✅ YES' : '❌ NO');

      if (!authHeader) {
        return res.status(401).json({ error: 'No token provided' });
      }

      const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
      console.log('🔐 TOKEN:', token.substring(0, 20) + '...');

      const decoded = authService.verifyToken(token);
      req.user = decoded;
      console.log('✅ TOKEN VERIFIED:', decoded.email);
      next();
    } catch (err) {
      console.error('❌ AUTH ERROR:', err.message);
      res.status(401).json({ error: 'Invalid token' });
    }
  };
};
