import React from 'react';

export function KPICards({ data }) {
  const cardStyle = {
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    textAlign: 'left'
  };

  const redCard = { ...cardStyle, backgroundColor: '#ef4444', color: 'white' }; 
  const orangeCard = { ...cardStyle, backgroundColor: '#f97316', color: 'white' };
  const yellowCard = { ...cardStyle, backgroundColor: '#eab308', color: 'white' };
  const blueCard = { ...cardStyle, backgroundColor: '#3b82f6', color: 'white' };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px' }}>
      
      <div style={redCard}>
        <p style={{ fontSize: '14px', marginBottom: '8px' }}>Failed Logins</p>
        <p style={{ fontSize: '36px', fontWeight: 'bold' }}>{data.failedLogins}</p>
      </div>

      <div style={orangeCard}>
        <p style={{ fontSize: '14px', marginBottom: '8px' }}>Suspicious IPs</p>
        <p style={{ fontSize: '36px', fontWeight: 'bold' }}>{data.suspiciousIPs}</p>
      </div>

      <div style={yellowCard}>
        <p style={{ fontSize: '14px', marginBottom: '8px' }}>Attacks Detected</p>
        <p style={{ fontSize: '36px', fontWeight: 'bold' }}>{data.attacksDetected}</p>
      </div>

      <div style={blueCard}>
        <p style={{ fontSize: '14px', marginBottom: '8px' }}>Last Updated</p>
        <p style={{ fontSize: '20px', fontWeight: 'bold' }}>{data.lastUpdated}</p>
      </div>

    </div>
  );
}
