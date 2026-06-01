import React, { useState } from 'react';

export function AlertTable({ alerts }) {
  const [hoveredAlert, setHoveredAlert] = useState(null);

  const getSeverityColor = (severity) => {
    const colors = {
      'critical': '#ef4444',
      'high': '#f59e0b',
      'medium': '#eab308',
      'low': '#10b981'
    };
    return colors[severity.toLowerCase()] || '#3b82f6';
  };

  return (
    <div style={{ marginTop: '32px', marginBottom: '32px' }}>
      <h2 style={{
        fontSize: 'clamp(20px, 4vw, 24px)',
        fontWeight: '600',
        marginBottom: '16px',
        color: '#f1f5f9',
        margin: '0 0 16px 0'
      }}>
        Security Alerts
      </h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {alerts.map((alert, i) => {
          const color = getSeverityColor(alert.severity);
          const isHovered = hoveredAlert === i;
          
          return (
            <div
              key={alert.id}
              onMouseEnter={() => setHoveredAlert(i)}
              onMouseLeave={() => setHoveredAlert(null)}
              style={{
                padding: '16px',
                borderLeft: `3px solid ${color}`,
                backgroundColor: 'rgba(30, 41, 59, 0.5)',
                borderRadius: '8px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '16px',
                transition: 'all 0.3s ease',
                transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
                boxShadow: isHovered ? `inset 0 0 12px ${color}15` : 'none'
              }}
            >
              <div>
                <p style={{ fontSize: '11px', color: '#64748b', margin: '0 0 4px 0', fontWeight: '600' }}>TIME</p>
                <p style={{ fontSize: '14px', fontWeight: '500', color: '#f1f5f9', margin: 0 }}>{alert.timestamp}</p>
              </div>
              <div>
                <p style={{ fontSize: '11px', color: '#64748b', margin: '0 0 4px 0', fontWeight: '600' }}>TYPE</p>
                <p style={{ fontSize: '14px', fontWeight: '500', color: '#f1f5f9', margin: 0 }}>{alert.type}</p>
              </div>
              <div>
                <p style={{ fontSize: '11px', color: '#64748b', margin: '0 0 4px 0', fontWeight: '600' }}>SOURCE IP</p>
                <p style={{ fontSize: '14px', fontWeight: '500', fontFamily: 'monospace', color: color, margin: 0 }}>{alert.sourceIP}</p>
              </div>
              <div>
                <p style={{ fontSize: '11px', color: '#64748b', margin: '0 0 4px 0', fontWeight: '600' }}>SEVERITY</p>
                <p style={{ fontSize: '14px', fontWeight: '600', color: color, margin: 0, textTransform: 'uppercase' }}>{alert.severity}</p>
              </div>
              <div>
                <p style={{ fontSize: '11px', color: '#64748b', margin: '0 0 4px 0', fontWeight: '600' }}>STATUS</p>
                <p style={{ fontSize: '14px', fontWeight: '500', color: '#f1f5f9', margin: 0 }}>{alert.status}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
