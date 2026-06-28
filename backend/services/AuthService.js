const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthService {
  constructor(jwtSecret) {
    this.jwtSecret = jwtSecret;
    this.users = [
      {
        id: 1,
        email: 'analyst@holberton.io',
        password: '$2a$10$YIjlrJxnVknEEYnSH8.f2eXAi3w9oYJpJ2q9m8U3D8Z1G9q8K2P1m',
        name: 'Sedra Analyst',
        role: 'analyst',
        createdAt: new Date(),
        lastLogin: null
      }
    ];
  }

  async login(email, password) {
    const user = this.users.find(u => u.email === email);
    if (!user) throw new Error('Utilisateur introuvable');
    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) throw new Error('Mot de passe incorrect');
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      this.jwtSecret,
      { expiresIn: '30m' }
    );
    user.lastLogin = new Date();
    return { token, expiresIn: 1800, user: this.sanitizeUser(user) };
  }

  async register(email, password, name) {
    if (this.users.find(u => u.email === email)) {
      throw new Error('Email déjà utilisé');
    }
    const hashedPassword = await bcryptjs.hash(password, 10);
    const newUser = {
      id: this.users.length + 1,
      email,
      password: hashedPassword,
      name,
      role: 'analyst',
      createdAt: new Date(),
      lastLogin: new Date()
    };
    this.users.push(newUser);
    const token = jwt.sign(
      { id: newUser.id, email, name },
      this.jwtSecret,
      { expiresIn: '30m' }
    );
    return { token, expiresIn: 1800, user: this.sanitizeUser(newUser) };
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (err) {
      throw new Error('Token invalide ou expiré');
    }
  }

  sanitizeUser(user) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

module.exports = AuthService;
