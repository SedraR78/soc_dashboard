import React from 'react';
import { KPICards } from '../components/KPICards';
import { AlertTable } from '../components/AlertTable';
import { Map } from '../components/Map';
import mockData from '../mockData.json';
import { Chart } from '../components/Chart';
export function Dashboard() {
return (
  <div className="min-h-screen bg-slate-950 text-white p-8">
    <div className="container mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-blue-400">SOC Dashboard</h1>
      
      <KPICards data={mockData.kpis} />
      <AlertTable alerts={mockData.alerts} />
      <Chart data={mockData.chartData} />
      <Map data={mockData.mapData} />
    </div>
  </div>
);
}
