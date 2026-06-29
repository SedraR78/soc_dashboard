module.exports = (authService) => {
  return (req, res, next) => {
    try {
      const authHeader = req.headers['authorization'];
      console.log('📍 AUTH HEADER:', authHeader ? '✅ YES' : '❌ NO');
      console.log('🔐 authService available:', authService ? '✅ YES' : '❌ NO');

      if (!authHeader) {
        return res.status(401).json({ error: 'No token provided' });
      }

      const token = authHeader.replace('Bearer ', '');
      console.log('🎫 Token to verify:', token.substring(0, 50) + '...');

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
