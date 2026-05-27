import React, { useState } from 'react';

export function AlertTable({ alerts }) {
  const [hoveredAlert, setHoveredAlert] = useState(null);

  const getSeverityColor = (severity) => {
    switch(severity.toLowerCase()) {
      case 'critical': return '#ff0000';
      case 'high': return '#ff6b00';
      case 'medium': return '#ffff00';
      case 'low': return '#00ff41';
      default: return '#00d4ff';
    }
  };

  return (
    <div style={{ marginTop: '32px', marginBottom: '32px' }}>
      <h2 style={{
        fontSize: 'clamp(20px, 4vw, 28px)',
        fontWeight: 'bold',
        marginBottom: '16px',
        color: '#00ff41',
        letterSpacing: '1px'
      }}>
        ▶ RECENT ALERTS
      </h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
                borderLeft: `4px solid ${color}`,
                backgroundColor: 'rgba(10, 14, 39, 0.7)',
                border: `1px solid ${color}`,
                borderRadius: '4px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '16px',
                boxShadow: isHovered ? `0 0 20px ${color}` : `0 0 5px ${color}`,
                transition: 'all 0.3s ease',
                transform: isHovered ? 'translateX(10px)' : 'translateX(0)',
                color: color
              }}
            >
              <div>
                <p style={{ fontSize: '12px', color: '#888', marginBottom: '4px', textTransform: 'uppercase' }}>TIME</p>
                <p style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>{alert.timestamp}</p>
              </div>
              <div>
                <p style={{ fontSize: '12px', color: '#888', marginBottom: '4px', textTransform: 'uppercase' }}>TYPE</p>
                <p style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>{alert.type}</p>
              </div>
              <div>
                <p style={{ fontSize: '12px', color: '#888', marginBottom: '4px', textTransform: 'uppercase' }}>IP</p>
                <p style={{ fontSize: '16px', fontWeight: 'bold', fontFamily: 'monospace', margin: 0 }}>{alert.sourceIP}</p>
              </div>
              <div>
                <p style={{ fontSize: '12px', color: '#888', marginBottom: '4px', textTransform: 'uppercase' }}>SEVERITY</p>
                <p style={{ fontSize: '16px', fontWeight: 'bold', margin: 0, textTransform: 'uppercase' }}>{alert.severity}</p>
              </div>
              <div>
                <p style={{ fontSize: '12px', color: '#888', marginBottom: '4px', textTransform: 'uppercase' }}>STATUS</p>
                <p style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>{alert.status}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
