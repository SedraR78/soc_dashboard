const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

class AuthService {
  constructor(jwtSecret) {
    this.jwtSecret = jwtSecret;
  }

  async login(email, password) {
    const user = await User.findByEmail(email);
    if (!user) throw new Error('Utilisateur introuvable');

    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) throw new Error('Mot de passe incorrect');

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      this.jwtSecret,
      { expiresIn: '30m' }
    );

    await User.updateLastLogin(user.id);
    return { token, expiresIn: 1800, user: { id: user.id, email: user.email, name: user.name, role: user.role } };
  }

  async register(email, password, name) {
    const bcryptjs = require('bcryptjs');
    const hashed = await bcryptjs.hash(password, 10);
    const user = await User.create(email, hashed, name);
    return { message: 'Utilisateur créé', user };
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (err) {
      throw new Error('Token invalide ou expiré');
    }
  }
}

module.exports = AuthService;
