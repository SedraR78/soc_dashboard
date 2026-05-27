import React from 'react';

export function AlertTable({ alerts }) {
  const getSeverityStyle = (severity) => {
    switch(severity.toLowerCase()) {
      case 'critical':
        return {
          backgroundColor: '#dc2626',
          borderLeft: '4px solid #991b1b',
          color: 'white'
        };
      case 'high':
        return {
          backgroundColor: '#ea580c',
          borderLeft: '4px solid #9a3412',
          color: 'white'
        };
      case 'medium':
        return {
          backgroundColor: '#ca8a04',
          borderLeft: '4px solid #78350f',
          color: 'white'
        };
      case 'low':
        return {
          backgroundColor: '#16a34a',
          borderLeft: '4px solid #15803d',
          color: 'white'
        };
      default:
        return {
          backgroundColor: '#4b5563',
          borderLeft: '4px solid #1f2937',
          color: 'white'
        };
    }
  };

  return (
    <div style={{ marginTop: '32px', padding: '32px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: 'white' }}>Recent Alerts</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {alerts.map((alert) => (
          <div 
            key={alert.id} 
            style={{
              ...getSeverityStyle(alert.severity),
              padding: '16px',
              borderRadius: '8px',
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '16px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
          >
            <div>
              <p style={{ fontSize: '12px', color: '#e5e7eb', marginBottom: '4px' }}>TIME</p>
              <p style={{ fontWeight: 'bold' }}>{alert.timestamp}</p>
            </div>
            <div>
              <p style={{ fontSize: '12px', color: '#e5e7eb', marginBottom: '4px' }}>TYPE</p>
              <p style={{ fontWeight: 'bold' }}>{alert.type}</p>
            </div>
            <div>
              <p style={{ fontSize: '12px', color: '#e5e7eb', marginBottom: '4px' }}>SOURCE IP</p>
              <p style={{ fontWeight: 'bold', fontFamily: 'monospace' }}>{alert.sourceIP}</p>
            </div>
            <div>
              <p style={{ fontSize: '12px', color: '#e5e7eb', marginBottom: '4px' }}>SEVERITY</p>
              <p style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>{alert.severity}</p>
            </div>
            <div>
              <p style={{ fontSize: '12px', color: '#e5e7eb', marginBottom: '4px' }}>STATUS</p>
              <p style={{ fontWeight: 'bold' }}>{alert.status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
