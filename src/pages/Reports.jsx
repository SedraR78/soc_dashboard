import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export function ReportsPage() {
  const [incidentId, setIncidentId] = useState('1');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('soc_token');
      const response = await axios.post(
        `${API_URL}/api/reports/generate`,
        { incidentId: parseInt(incidentId) },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setReport(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate report');
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
        <h1 style={{ color: '#f1f5f9', marginBottom: '20px' }}>📊 Generate Report</h1>
        
        <form onSubmit={handleGenerate} style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
          <input
            type="number"
            value={incidentId}
            onChange={(e) => setIncidentId(e.target.value)}
            placeholder="Incident ID..."
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
            {loading ? 'Generating...' : 'Generate'}
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

        {report && (
          <div style={{
            background: '#1e293b',
            border: '1px solid rgba(148, 163, 184, 0.3)',
            borderRadius: '8px',
            padding: '20px',
            color: '#f1f5f9',
            whiteSpace: 'pre-wrap',
            fontFamily: "'Courier New', monospace",
            fontSize: '12px',
            maxHeight: '600px',
            overflow: 'auto'
          }}>
            {report.content}
          </div>
        )}
      </div>
    </div>
  );
}
