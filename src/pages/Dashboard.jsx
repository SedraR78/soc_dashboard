import React from 'react';
import { KPICards } from '../components/KPICards';
import { AlertTable } from '../components/AlertTable';
import { Chart } from '../components/Chart';
import { Map } from '../components/Map';
import mockData from '../mockData.json';

export function Dashboard() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      padding: '40px 24px',
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{
            fontSize: 'clamp(32px, 6vw, 48px)',
            fontWeight: '700',
            color: '#f1f5f9',
            margin: 0,
            marginBottom: '8px'
          }}>
            SOC Dashboard
          </h1>
          <p style={{
            fontSize: '14px',
            color: '#64748b',
            margin: 0
          }}>
            Security Operations Center - Real-time threat monitoring
          </p>
        </div>
        
        <KPICards data={mockData.kpis} />
        <AlertTable alerts={mockData.alerts} />
        <Chart data={mockData.chartData} />
        <Map />
      </div>
    </div>
  );
}   
