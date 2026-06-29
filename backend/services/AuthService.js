const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

class AuthService {
  constructor(jwtSecret) {
    this.jwtSecret = jwtSecret;
    console.log('🔐 AuthService initialized with JWT_SECRET:', jwtSecret ? '✅ YES' : '❌ NO');
  }

  async login(email, password) {
    const user = await User.findByEmail(email);
    
    if (!user) {
      console.log(`❌ User not found: ${email}`);
      throw new Error('Utilisateur introuvable');
    }

    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) {
      console.log(`❌ Wrong password for: ${email}`);
      throw new Error('Mot de passe incorrect');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      this.jwtSecret,
      { expiresIn: '30m' }
    );

    await User.updateLastLogin(user.id);
    console.log(`🎉 LOGIN SUCCESS: ${email}`);
    return { token, expiresIn: 1800, user: { id: user.id, email: user.email, name: user.name, role: user.role } };
  }

  verifyToken(token) {
    try {
      console.log('🔐 Verifying with JWT_SECRET:', this.jwtSecret ? '✅ YES' : '❌ NO');
      return jwt.verify(token, this.jwtSecret);
    } catch (err) {
      console.error('❌ JWT VERIFY ERROR:', err.message);
      throw new Error('Token invalide ou expiré');
    }
  }
}

module.exports = AuthService;
