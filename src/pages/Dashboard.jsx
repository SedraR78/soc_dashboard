import React from 'react';
import { KPICards } from '../components/KPICards';
import { AlertTable } from '../components/AlertTable';
import { Map } from '../components/Map';
import mockData from '../mockData.json';

export function Dashboard() {
  // TODO 1: Pass mockData.kpis to KPICards
  // TODO 2: Pass mockData.alerts to AlertTable
  // TODO 3: Include Map component
  // TODO 4: Wrap in container with padding

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">SOC Dashboard</h1>
      
      {/* TODO: Replace these with actual components */}
        <KPICards data={mockData.kpis} />
        <AlertTable alerts={mockData.alerts} />
        <Map />
    </div>
  );
}
