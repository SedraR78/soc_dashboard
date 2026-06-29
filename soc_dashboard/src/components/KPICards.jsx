import React, { useState } from 'react';

export function KPICards({ data }) {
  const [hoveredCard, setHoveredCard] = useState(null);

  const cards = [
    { color: '#3b82f6', label: 'Failed Logins', value: data.failedLogins },
    { color: '#f59e0b', label: 'Suspicious IPs', value: data.suspiciousIPs },
    { color: '#ef4444', label: 'Attacks Detected', value: data.attacksDetected },
    { color: '#10b981', label: 'Last Updated', value: data.lastUpdated }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '16px',
      marginBottom: '32px'
    }}>
      {cards.map((card, i) => (
        <div
          key={i}
          onMouseEnter={() => setHoveredCard(i)}
          onMouseLeave={() => setHoveredCard(null)}
          style={{
            padding: '24px',
            borderRadius: '12px',
            backgroundColor: 'rgba(30, 41, 59, 0.6)',
            border: `1px solid ${card.color}33`,
            transition: 'all 0.3s ease',
            transform: hoveredCard === i ? 'translateY(-4px)' : 'translateY(0)',
            boxShadow: hoveredCard === i ? `0 12px 24px ${card.color}20` : '0 4px 6px rgba(0,0,0,0.2)'
          }}
        >
          <p style={{
            fontSize: '12px',
            color: '#94a3b8',
            margin: '0 0 12px 0',
            fontWeight: '500',
            letterSpacing: '0.5px',
            textTransform: 'uppercase'
          }}>
            {card.label}
          </p>
          <p style={{
            fontSize: 'clamp(32px, 5vw, 42px)',
            fontWeight: '700',
            color: card.color,
            margin: 0
          }}>
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}
