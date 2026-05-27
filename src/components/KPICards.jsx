import React, { useState } from 'react';

export function KPICards({ data }) {
  const [hoveredCard, setHoveredCard] = useState(null);

  const cardStyle = (color, isHovered) => ({
    padding: '24px',
    borderRadius: '8px',
    border: `2px solid ${color}`,
    backgroundColor: 'rgba(10, 14, 39, 0.7)',
    boxShadow: isHovered ? `0 0 30px ${color}` : `0 0 10px ${color}`,
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
  });

  const cards = [
    { color: '#00ff41', label: 'Failed Logins', value: data.failedLogins },
    { color: '#ff6b00', label: 'Suspicious IPs', value: data.suspiciousIPs },
    { color: '#ffff00', label: 'Attacks Detected', value: data.attacksDetected },
    { color: '#00d4ff', label: 'Last Updated', value: data.lastUpdated }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
      marginBottom: '32px'
    }}>
      {cards.map((card, i) => (
        <div
          key={i}
          onMouseEnter={() => setHoveredCard(i)}
          onMouseLeave={() => setHoveredCard(null)}
          style={cardStyle(card.color, hoveredCard === i)}
        >
          <p style={{
            fontSize: '14px',
            color: card.color,
            marginBottom: '8px',
            letterSpacing: '1px',
            textTransform: 'uppercase'
          }}>
            {card.label}
          </p>
          <p style={{
            fontSize: 'clamp(28px, 5vw, 48px)',
            fontWeight: 'bold',
            color: card.color,
            textShadow: `0 0 10px ${card.color}`,
            margin: 0
          }}>
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}
