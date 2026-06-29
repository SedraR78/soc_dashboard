import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001';

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('analyst@holberton.io');
  const [password, setPassword] = useState('Holberton2024!');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password
      });

      console.log('✅ LOGIN RESPONSE:', response.data);

      localStorage.setItem('soc_token', response.data.token);
      localStorage.setItem('soc_user', JSON.stringify(response.data.user));

      console.log('✅ TOKEN STORED:', localStorage.getItem('soc_token'));

      navigate('/dashboard');
    } catch (err) {
      console.error('❌ LOGIN ERROR:', err);
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ background: 'rgba(30, 41, 59, 0.8)', padding: '40px', borderRadius: '12px', border: '1px solid rgba(148, 163, 184, 0.2)', width: '100%', maxWidth: '400px' }}>
        <h1 style={{ textAlign: 'center', color: '#f1f5f9', marginBottom: '30px', fontSize: '28px', fontWeight: '700' }}>🛡️ Holberton SOC</h1>
        <p style={{ textAlign: 'center', color: '#94a3b8', marginBottom: '30px' }}>Cyber Threat Intelligence Dashboard</p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#94a3b8', display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '12px', background: '#1e293b', border: '1px solid rgba(148, 163, 184, 0.3)', borderRadius: '6px', color: '#f1f5f9', fontSize: '14px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#94a3b8', display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '12px', background: '#1e293b', border: '1px solid rgba(148, 163, 184, 0.3)', borderRadius: '6px', color: '#f1f5f9', fontSize: '14px', boxSizing: 'border-box' }}
            />
          </div>

          {error && <div style={{ color: '#ef4444', marginBottom: '20px', padding: '12px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '6px', fontSize: '14px' }}>❌ {error}</div>}

          <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: '600', fontSize: '14px', opacity: loading ? 0.7 : 1 }}>
            {loading ? '⏳ Loading...' : '✅ Login'}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: '#64748b', marginTop: '20px', fontSize: '12px' }}>Demo Credentials:<br />analyst@holberton.io / Holberton2024!</p>
      </div>
    </div>
  );
}
