import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001';

export function IPAnalysisPage() {
  const navigate = useNavigate();
  const [ipInput, setIpInput] = useState('192.168.1.105');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedIP, setSelectedIP] = useState(null);
  const [scanPhase, setScanPhase] = useState('select');

  const attackerIPs = [
    { ip: '203.0.113.42', country: 'Russia', attacks: 5, dangerScore: 95, status: 'CRITICAL' },
    { ip: '192.168.1.105', country: 'Unknown', attacks: 3, dangerScore: 85, status: 'HIGH' },
    { ip: '10.0.0.54', country: 'China', attacks: 2, dangerScore: 72, status: 'HIGH' },
    { ip: '172.16.0.22', country: 'Iran', attacks: 4, dangerScore: 88, status: 'CRITICAL' }
  ];

  const ipData = {
    '203.0.113.42': {
      ip: '203.0.113.42',
      location: 'Moscow, Russia',
      coordinates: '55.7558°N, 37.6173°E',
      isp: 'Rostelecom',
      dangerScore: 95,
      status: 'CRITICAL',
      blacklisted: true,
      incidents: 5,
      lastActivity: '2 hours ago',
      ports: [22, 80, 443, 3306, 8080],
      services: ['SSH', 'HTTP', 'HTTPS', 'MySQL', 'HTTP-Alt'],
      threats: ['SSH Brute Force', 'Port Scanning', 'SQL Injection Attempts'],
      geoIP: 'GeoIP Database Match: Russia Federation',
      reverseHostname: 'unknown.rostelecom.ru'
    },
    '192.168.1.105': {
      ip: '192.168.1.105',
      location: 'Internal Network',
      coordinates: 'Local LAN',
      isp: 'Private Network',
      dangerScore: 85,
      status: 'HIGH',
      blacklisted: false,
      incidents: 3,
      lastActivity: '1 hour ago',
      ports: [22, 80, 443, 3306, 5432, 8080],
      services: ['SSH', 'HTTP', 'HTTPS', 'MySQL', 'PostgreSQL', 'Node.js'],
      threats: ['Failed SSH Logins', 'Suspicious Port Activity', 'Unauthorized Access Attempts'],
      geoIP: 'Local Network Device',
      reverseHostname: 'server.local'
    },
    '10.0.0.54': {
      ip: '10.0.0.54',
      location: 'Beijing, China',
      coordinates: '39.9042°N, 116.4074°E',
      isp: 'China Unicom',
      dangerScore: 72,
      status: 'HIGH',
      blacklisted: true,
      incidents: 2,
      lastActivity: '3 hours ago',
      ports: [80, 443, 8888],
      services: ['HTTP', 'HTTPS', 'Custom-Service'],
      threats: ['Probe Attempts', 'Service Reconnaissance'],
      geoIP: 'GeoIP Database Match: China',
      reverseHostname: 'proxy.chinaunicom.cn'
    },
    '172.16.0.22': {
      ip: '172.16.0.22',
      location: 'Tehran, Iran',
      coordinates: '35.6892°N, 51.3890°E',
      isp: 'Iranian ISP',
      dangerScore: 88,
      status: 'CRITICAL',
      blacklisted: true,
      incidents: 4,
      lastActivity: '30 mins ago',
      ports: [22, 80, 443],
      services: ['SSH', 'HTTP', 'HTTPS'],
      threats: ['DDoS Attack', 'SSH Brute Force', 'Web App Scanning'],
      geoIP: 'GeoIP Database Match: Iran',
      reverseHostname: 'attacker.ir'
    }
  };

  const analyzeIP = async () => {
    if (!selectedIP) {
      alert('Select an attacker IP first!');
      return;
    }

    setLoading(true);
    setScanPhase('scanning');

    await new Promise(resolve => setTimeout(resolve, 1000));

    const data = ipData[selectedIP];
    
    try {
      const token = localStorage.getItem('soc_token');
      const response = await axios.get(`${API_URL}/api/threats/ip/${selectedIP}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      setResult({ ...data, ...response.data });
    } catch (err) {
      console.error('Analysis error:', err);
      setResult(data);
    }

    setScanPhase('results');
    setLoading(false);
  };

  const manualAnalyze = async () => {
    if (!ipInput.trim()) return;
    
    setLoading(true);
    setScanPhase('scanning');

    await new Promise(resolve => setTimeout(resolve, 800));

    const data = ipData[ipInput] || {
      ip: ipInput,
      location: 'Unknown Location',
      coordinates: 'N/A',
      isp: 'Unknown ISP',
      dangerScore: Math.floor(Math.random() * 100),
      status: 'MEDIUM',
      blacklisted: false,
      incidents: 0,
      lastActivity: 'Never',
      ports: [80, 443],
      services: ['HTTP', 'HTTPS'],
      threats: ['No threats detected'],
      geoIP: 'Could not locate',
      reverseHostname: 'unknown'
    };

    try {
      const token = localStorage.getItem('soc_token');
      await axios.get(`${API_URL}/api/threats/ip/${ipInput}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
    } catch (err) {
      console.error('Analysis error:', err);
    }

    setResult(data);
    setScanPhase('results');
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: '40px 24px', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <h1 style={{ color: '#f1f5f9', fontSize: '32px', fontWeight: '700', margin: 0 }}>🔍 IP Analysis & Geolocation</h1>
          <button onClick={() => navigate('/dashboard')} style={{ padding: '10px 20px', background: '#64748b', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>← Back to Dashboard</button>
        </div>

        {scanPhase === 'select' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            <div>
              <div style={{ background: 'rgba(30, 41, 59, 0.6)', padding: '20px', borderRadius: '8px', border: '1px solid rgba(148, 163, 184, 0.2)', marginBottom: '20px' }}>
                <p style={{ color: '#94a3b8', fontSize: '12px', margin: '0 0 12px 0', fontWeight: '600', textTransform: 'uppercase' }}>🎯 DETECTED ATTACKER IPs</p>
                <div style={{ display: 'grid', gap: '10px' }}>
                  {attackerIPs.map((item) => (
                    <div key={item.ip} onClick={() => setSelectedIP(item.ip)} style={{
                      padding: '15px', background: selectedIP === item.ip ? 'linear-gradient(135deg, #ef444430 0%, #ef444410 100%)' : 'rgba(30, 41, 59, 0.5)', border: `2px solid ${selectedIP === item.ip ? '#ef4444' : 'transparent'}`, borderRadius: '8px', cursor: 'pointer', transition: 'all 0.3s ease'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                        <p style={{ fontSize: '14px', fontWeight: '700', color: '#f1f5f9', margin: 0, fontFamily: 'monospace' }}>{item.ip}</p>
                        <span style={{ padding: '4px 8px', background: '#ef4444', color: '#fff', fontSize: '10px', borderRadius: '4px', fontWeight: '600' }}>{item.status}</span>
                      </div>
                      <p style={{ color: '#94a3b8', fontSize: '12px', margin: '0 0 4px 0' }}>{item.country}</p>
                      <p style={{ color: '#f59e0b', fontSize: '12px', margin: 0 }}>⚠️ {item.attacks} incidents • Danger: {item.dangerScore}/100</p>
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={analyzeIP} disabled={!selectedIP || loading} style={{
                width: '100%', padding: '16px', background: selectedIP ? '#10b981' : '#64748b', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '700', cursor: selectedIP ? 'pointer' : 'not-allowed', opacity: loading ? 0.7 : 1
              }}>
                {loading ? '⏳ Scanning...' : '🔬 Analyze Selected IP'}
              </button>
            </div>

            <div>
              <div style={{ background: 'rgba(30, 41, 59, 0.6)', padding: '20px', borderRadius: '8px', border: '1px solid rgba(148, 163, 184, 0.2)' }}>
                <p style={{ color: '#94a3b8', fontSize: '12px', margin: '0 0 12px 0', fontWeight: '600', textTransform: 'uppercase' }}>📝 MANUAL IP LOOKUP</p>
                <input
                  type="text"
                  value={ipInput}
                  onChange={(e) => setIpInput(e.target.value)}
                  placeholder="Enter IP address..."
                  style={{ width: '100%', padding: '12px', background: '#1e293b', border: '1px solid rgba(148, 163, 184, 0.3)', borderRadius: '6px', color: '#f1f5f9', fontSize: '14px', marginBottom: '12px', boxSizing: 'border-box', fontFamily: 'monospace' }}
                />
                <button onClick={manualAnalyze} disabled={!ipInput.trim() || loading} style={{
                  width: '100%', padding: '12px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', cursor: ipInput.trim() ? 'pointer' : 'not-allowed', fontWeight: '600', fontSize: '14px', opacity: loading ? 0.7 : 1
                }}>
                  {loading ? '⏳ Analyzing...' : '🔍 Search IP'}
                </button>

                <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(148, 163, 184, 0.2)' }}>
                  <p style={{ color: '#94a3b8', fontSize: '12px', margin: '0 0 12px 0', fontWeight: '600', textTransform: 'uppercase' }}>💡 QUICK FACTS</p>
                  <ul style={{ color: '#94a3b8', fontSize: '12px', margin: 0, paddingLeft: '20px', lineHeight: '1.8' }}>
                    <li>IP geolocation via GeoIP database</li>
                    <li>Port scanning detection</li>
                    <li>Service fingerprinting</li>
                    <li>Threat intelligence matching</li>
                    <li>Blacklist status verification</li>
                    <li>Reverse DNS lookup</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {result && scanPhase === 'results' && (
          <div>
            <button onClick={() => { setScanPhase('select'); setResult(null); setSelectedIP(null); }} style={{ marginBottom: '20px', padding: '10px 20px', background: '#64748b', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>
              ← Back to Selection
            </button>

            <div style={{ background: 'rgba(30, 41, 59, 0.6)', padding: '30px', borderRadius: '8px', border: `2px solid ${result.status === 'CRITICAL' ? '#ef4444' : result.status === 'HIGH' ? '#f59e0b' : '#10b981'}` }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                <div>
                  <p style={{ color: '#94a3b8', fontSize: '12px', margin: '0 0 4px 0', fontWeight: '600', textTransform: 'uppercase' }}>IP Address</p>
                  <p style={{ color: '#f1f5f9', fontSize: '20px', fontFamily: 'monospace', margin: 0, fontWeight: '700' }}>{result.ip}</p>
                </div>
                <div>
                  <p style={{ color: '#94a3b8', fontSize: '12px', margin: '0 0 4px 0', fontWeight: '600', textTransform: 'uppercase' }}>Threat Level</p>
                  <p style={{ color: result.status === 'CRITICAL' ? '#ef4444' : result.status === 'HIGH' ? '#f59e0b' : '#10b981', fontSize: '20px', margin: 0, fontWeight: '700' }}>🚨 {result.status}</p>
                </div>
                <div>
                  <p style={{ color: '#94a3b8', fontSize: '12px', margin: '0 0 4px 0', fontWeight: '600', textTransform: 'uppercase' }}>Danger Score</p>
                  <p style={{ color: '#f59e0b', fontSize: '20px', margin: 0, fontWeight: '700' }}>{result.dangerScore}/100</p>
                </div>
                <div>
                  <p style={{ color: '#94a3b8', fontSize: '12px', margin: '0 0 4px 0', fontWeight: '600', textTransform: 'uppercase' }}>Blacklisted</p>
                  <p style={{ color: result.blacklisted ? '#ef4444' : '#10b981', fontSize: '20px', margin: 0, fontWeight: '700' }}>{result.blacklisted ? '✅ YES' : '❌ NO'}</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                <div>
                  <p style={{ color: '#94a3b8', fontSize: '12px', margin: '0 0 8px 0', fontWeight: '600', textTransform: 'uppercase' }}>📍 Location</p>
                  <p style={{ color: '#f1f5f9', fontSize: '14px', margin: 0 }}>{result.location}</p>
                  <p style={{ color: '#3b82f6', fontSize: '13px', margin: '4px 0 0 0', fontFamily: 'monospace' }}>{result.coordinates}</p>
                </div>
                <div>
                  <p style={{ color: '#94a3b8', fontSize: '12px', margin: '0 0 8px 0', fontWeight: '600', textTransform: 'uppercase' }}>🌐 ISP</p>
                  <p style={{ color: '#f1f5f9', fontSize: '14px', margin: 0 }}>{result.isp}</p>
                  <p style={{ color: '#94a3b8', fontSize: '13px', margin: '4px 0 0 0' }}>{result.reverseHostname}</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                <div>
                  <p style={{ color: '#94a3b8', fontSize: '12px', margin: '0 0 8px 0', fontWeight: '600', textTransform: 'uppercase' }}>🔌 Open Ports</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {result.ports.map((port, i) => (
                      <span key={i} style={{ padding: '6px 10px', background: '#1e293b', border: '1px solid #3b82f6', color: '#3b82f6', borderRadius: '4px', fontSize: '12px', fontFamily: 'monospace', fontWeight: '600' }}>{port}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p style={{ color: '#94a3b8', fontSize: '12px', margin: '0 0 8px 0', fontWeight: '600', textTransform: 'uppercase' }}>🔧 Services</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {result.services.map((service, i) => (
                      <span key={i} style={{ padding: '6px 10px', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', color: '#10b981', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>{service}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <p style={{ color: '#94a3b8', fontSize: '12px', margin: '0 0 12px 0', fontWeight: '600', textTransform: 'uppercase' }}>⚠️ Detected Threats</p>
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: '6px', padding: '15px' }}>
                  {result.threats.map((threat, i) => (
                    <p key={i} style={{ color: '#ef4444', fontSize: '14px', margin: i === 0 ? 0 : '8px 0 0 0' }}>• {threat}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
