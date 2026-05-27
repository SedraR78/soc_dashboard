import React from 'react';
import { KPICards } from '../components/KPICards';
import { AlertTable } from '../components/AlertTable';
import { Map } from '../components/Map';
import mockData from '../mockData.json';

export function Dashboard() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">SOC Dashboard</h1>
      
      {/* KPI Cards showing numbers */}
      <KPICards data={mockData.kpis} />
      
      {/* Table of recent alerts */}
      <AlertTable alerts={mockData.alerts} />
      
      {/* Map placeholder */}
      <Map />
    </div>
  );
}
