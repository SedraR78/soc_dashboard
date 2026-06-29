import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export function IPAnalysisPage() {
  const [ipAddress, setIpAddress] = useState('192.168.1.105');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('soc_token');
      const response = await axios.get(
        `${API_URL}/api/threats/ip/${ipAddress}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setAnalysis(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to analyze IP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      padding: '40px 24px',
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h1 style={{ color: '#f1f5f9', marginBottom: '20px' }}>🔍 IP Analysis</h1>
        
        <form onSubmit={handleAnalyze} style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
          <input
            type="text"
            value={ipAddress}
            onChange={(e) => setIpAddress(e.target.value)}
            placeholder="Enter IP address..."
            style={{
              flex: 1,
              padding: '12px',
              background: '#1e293b',
              border: '1px solid rgba(148, 163, 184, 0.3)',
              borderRadius: '6px',
              color: '#f1f5f9'
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '12px 24px',
              background: '#00ff9d',
              color: '#000',
              border: 'none',
              borderRadius: '6px',
              fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </form>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid #ef4444',
            borderRadius: '6px',
            padding: '12px',
            color: '#ef4444',
            marginBottom: '20px'
          }}>
            {error}
          </div>
        )}

        {analysis && (
          <div style={{
            background: '#1e293b',
            border: '1px solid rgba(148, 163, 184, 0.3)',
            borderRadius: '8px',
            padding: '20px'
          }}>
            <h2 style={{ color: '#00ff9d', marginBottom: '15px' }}>IP: {analysis.ip}</h2>
            <div style={{ color: '#f1f5f9', lineHeight: '1.8' }}>
              <p>🌍 <strong>Location:</strong> {analysis.city}, {analysis.country}</p>
              <p>🗺️ <strong>Coordinates:</strong> {analysis.latitude}°N, {analysis.longitude}°E</p>
              <p>🏢 <strong>ISP:</strong> {analysis.isp}</p>
              <p>⚠️ <strong>Danger Score:</strong> {analysis.dangerScore}/100</p>
              <p>🚨 <strong>Blacklisted:</strong> {analysis.isBlacklisted ? '✅ YES' : '❌ NO'}</p>
              <p>📊 <strong>Incidents:</strong> {analysis.incidentsCount} related incidents</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
