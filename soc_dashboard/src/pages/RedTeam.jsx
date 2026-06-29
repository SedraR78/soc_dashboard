import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001';

export function RedTeamPage() {
  const navigate = useNavigate();
  const [selectedAttack, setSelectedAttack] = useState('ssh');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const attacks = [
    { id: 'ssh', label: '🔓 SSH Brute Force', color: '#10b981', desc: 'Test SSH authentication security' },
    { id: 'portscan', label: '📡 Port Scan', color: '#3b82f6', desc: 'Scan open network ports' },
    { id: 'sqli', label: '💉 SQL Injection', color: '#f59e0b', desc: 'Test SQL injection vulnerabilities' },
    { id: 'ddos', label: '⚡ DDoS Attack', color: '#ef4444', desc: 'Simulate DDoS simulation' }
  ];

  const launchSimulation = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('soc_token');
      const response = await axios.post(`${API_URL}/api/red-team/simulate`, 
        { attackType: selectedAttack },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setResult(response.data);
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const navButtons = [
    { label: '🛡️ Dashboard', path: '/dashboard', color: '#3b82f6' },
    { label: '💻 Terminal', path: '/terminal', color: '#3b82f6' },
    { label: '🔍 IP Analysis', path: '/ip-analysis', color: '#f59e0b' },
    { label: '📋 Reports', path: '/reports', color: '#10b981' }
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: '40px 24px', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <h1 style={{ color: '#f1f5f9', fontSize: '32px', fontWeight: '700', margin: 0 }}>🎯 Red Team Simulation</h1>
          <button onClick={() => { localStorage.clear(); window.location.href = '/'; }} style={{ padding: '10px 20px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Logout</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px', marginBottom: '40px' }}>
          {navButtons.map((btn, i) => (
            <button key={i} onClick={() => navigate(btn.path)} style={{
              padding: '12px 16px', background: `${btn.color}15`, border: `2px solid ${btn.color}`, borderRadius: '6px', color: '#f1f5f9', cursor: 'pointer', fontSize: '12px', fontWeight: '600', transition: 'all 0.3s ease'
            }} onMouseEnter={(e) => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = `0 8px 16px ${btn.color}30`; }} onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = 'none'; }}>{btn.label}</button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '40px' }}>
          {attacks.map((attack) => (
            <div key={attack.id} onClick={() => setSelectedAttack(attack.id)} style={{
              padding: '20px', background: selectedAttack === attack.id ? `linear-gradient(135deg, ${attack.color}30 0%, ${attack.color}10 100%)` : 'rgba(30, 41, 59, 0.5)', border: `2px solid ${selectedAttack === attack.id ? attack.color : 'transparent'}`, borderRadius: '8px', cursor: 'pointer', transition: 'all 0.3s ease'
            }}>
              <p style={{ fontSize: '18px', fontWeight: '700', color: attack.color, margin: '0 0 8px 0' }}>{attack.label}</p>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>{attack.desc}</p>
            </div>
          ))}
        </div>

        <button onClick={launchSimulation} disabled={loading} style={{
          width: '100%', padding: '16px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, transition: 'all 0.3s ease'
        }} onMouseEnter={(e) => { if (!loading) { e.target.style.background = '#dc2626'; e.target.style.boxShadow = '0 12px 24px rgba(239, 68, 68, 0.4)'; } }} onMouseLeave={(e) => { e.target.style.background = '#ef4444'; e.target.style.boxShadow = 'none'; }}>
          {loading ? '⏳ Running...' : '🚀 Launch Simulation'}
        </button>

        {result && (
          <div style={{ marginTop: '40px', background: 'rgba(16, 185, 129, 0.1)', padding: '24px', borderRadius: '8px', border: '2px solid #10b981' }}>
            <h2 style={{ color: '#10b981', marginTop: 0 }}>✅ Simulation Complete</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div>
                <p style={{ color: '#94a3b8', fontSize: '12px', margin: '0 0 4px 0', fontWeight: '600', textTransform: 'uppercase' }}>Simulation ID</p>
                <p style={{ color: '#f1f5f9', fontSize: '14px', fontFamily: 'monospace', margin: 0 }}>{result.simulationId}</p>
              </div>
              <div>
                <p style={{ color: '#94a3b8', fontSize: '12px', margin: '0 0 4px 0', fontWeight: '600', textTransform: 'uppercase' }}>Type</p>
                <p style={{ color: '#f1f5f9', fontSize: '14px', margin: 0 }}>{result.attackType}</p>
              </div>
              <div>
                <p style={{ color: '#94a3b8', fontSize: '12px', margin: '0 0 4px 0', fontWeight: '600', textTransform: 'uppercase' }}>Status</p>
                <p style={{ color: '#10b981', fontSize: '14px', fontWeight: '600', margin: 0 }}>Completed</p>
              </div>
              <div>
                <p style={{ color: '#94a3b8', fontSize: '12px', margin: '0 0 4px 0', fontWeight: '600', textTransform: 'uppercase' }}>Detection Rate</p>
                <p style={{ color: '#10b981', fontSize: '14px', fontWeight: '600', margin: 0 }}>{result.detectionRate}%</p>
              </div>
            </div>
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #10b98133' }}>
              <p style={{ color: '#94a3b8', fontSize: '12px', margin: '0 0 8px 0', fontWeight: '600', textTransform: 'uppercase' }}>Incidents Created</p>
              <p style={{ color: '#f1f5f9', fontSize: '16px', fontWeight: '700', margin: 0 }}>{result.incidentsCreated} incidents logged in system</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
