import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AlertTable } from '../components/AlertTable';
import { Chart } from '../components/Chart';
import { KPICards } from '../components/KPICards';
import { Map } from '../components/Map';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001';

export function Dashboard() {
  const navigate = useNavigate();
  const [kpis, setKpis] = useState({ failedLogins: 0, suspiciousIPs: 0, attacksDetected: 0, detectionRate: '0%', lastUpdated: new Date().toISOString() });
  const [alerts, setAlerts] = useState([]);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(fetchDashboard, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem('soc_token');
      if (!token) { window.location.href = '/'; return; }
      const response = await axios.get(`${API_URL}/api/dashboard`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setKpis(response.data.kpis || {});
      setAlerts(response.data.alerts || []);
      setChartData(response.data.chartData || {});
    } catch (err) {
      if (err.response?.status === 401) { localStorage.clear(); window.location.href = '/'; }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => { localStorage.clear(); window.location.href = '/'; };

  const navButtons = [
    { label: 'Terminal', path: '/terminal', color: '#3b82f6' },
    { label: 'IP Analysis', path: '/ip-analysis', color: '#f59e0b' },
    { label: 'Red Team', path: '/red-team', color: '#ef4444' },
    { label: 'Reports', path: '/reports', color: '#10b981' }
  ];

  if (loading) return <div style={{ padding: '40px', color: '#f1f5f9', minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>Loading...</div>;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: '40px 24px', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <h1 style={{ color: '#f1f5f9', fontSize: '32px', fontWeight: '700', margin: 0 }}>SOC Dashboard</h1>
          <button onClick={handleLogout} style={{ padding: '10px 20px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Logout</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '40px' }}>
          {navButtons.map((btn, i) => (
            <button key={i} onClick={() => navigate(btn.path)}
              style={{ padding: '16px 24px', background: `linear-gradient(135deg, ${btn.color}20 0%, ${btn.color}05 100%)`, border: `2px solid ${btn.color}`, borderRadius: '8px', color: '#f1f5f9', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}
              onMouseEnter={(e) => { e.target.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; }}>
              {btn.label}
            </button>
          ))}
        </div>

        <KPICards data={kpis} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '30px' }}>
          <AlertTable alerts={alerts} />
          <Chart data={chartData} />
        </div>
        <div style={{ marginTop: '30px' }}><Map /></div>
      </div>
    </div>
  );
}
