import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export function RedTeamPage() {
  const [selectedAttack, setSelectedAttack] = useState('ssh');
  const [simResult, setSimResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSimulate = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('soc_token');
      const response = await axios.post(
        `${API_URL}/api/red-team/simulate`,
        { attackType: selectedAttack },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setSimResult(response.data);
    } catch (err) {
      console.error('Simulation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const attacks = [
    { id: 'ssh', name: 'SSH Brute Force', icon: '🔓' },
    { id: 'portscan', name: 'Port Scan', icon: '📡' },
    { id: 'sqli', name: 'SQL Injection', icon: '💾' },
    { id: 'ddos', name: 'DDoS Attack', icon: '⚡' }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      padding: '40px 24px',
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h1 style={{ color: '#f1f5f9', marginBottom: '30px' }}>🎯 Red Team Simulation</h1>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px',
          marginBottom: '30px'
        }}>
          {attacks.map(attack => (
            <button
              key={attack.id}
              onClick={() => setSelectedAttack(attack.id)}
              style={{
                padding: '20px',
                background: selectedAttack === attack.id ? '#00ff9d' : '#1e293b',
                color: selectedAttack === attack.id ? '#000' : '#f1f5f9',
                border: `2px solid ${selectedAttack === attack.id ? '#00ff9d' : 'rgba(148, 163, 184, 0.3)'}`,
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ fontSize: '24px', marginBottom: '10px' }}>{attack.icon}</div>
              {attack.name}
            </button>
          ))}
        </div>

        <button
          onClick={handleSimulate}
          disabled={loading}
          style={{
            width: '100%',
            padding: '15px',
            background: '#ef4444',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontWeight: '700',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginBottom: '30px'
          }}
        >
          {loading ? '⏳ Simulating Attack...' : '🚀 Launch Simulation'}
        </button>

        {simResult && (
          <div style={{
            background: '#1e293b',
            border: '2px solid #00ff9d',
            borderRadius: '8px',
            padding: '20px'
          }}>
            <h2 style={{ color: '#00ff9d', marginBottom: '15px' }}>✅ Simulation Complete</h2>
            <div style={{ color: '#f1f5f9', lineHeight: '1.8' }}>
              <p><strong>Simulation ID:</strong> {simResult.simulationId}</p>
              <p><strong>Type:</strong> {simResult.type}</p>
              <p><strong>Status:</strong> {simResult.status}</p>
              <p><strong>Detection Rate:</strong> {simResult.detectionRate}%</p>
              <p><strong>Incidents Created:</strong> {simResult.incidentsCreated}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
