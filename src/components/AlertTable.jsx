import React from 'react';

export function AlertTable({ alerts }) {
  return (
    <div className="mt-8 p-8">
      <h2 className="text-2xl font-bold mb-4">Recent Alerts</h2>
      
      <table className="w-full border-collapse border border-gray-300">
        {/* Table header */}
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2 text-left">Timestamp</th>
            <th className="border p-2 text-left">Type</th>
            <th className="border p-2 text-left">Source IP</th>
            <th className="border p-2 text-left">Severity</th>
            <th className="border p-2 text-left">Status</th>
          </tr>
        </thead>

        {/* Loop through all alerts and create a row for each */}
        <tbody>
          {alerts.map((alert) => (
            <tr key={alert.id}>
              <td className="border p-2">{alert.timestamp}</td>
              <td className="border p-2">{alert.type}</td>
              <td className="border p-2">{alert.sourceIP}</td>
              <td className="border p-2">{alert.severity}</td>
              <td className="border p-2">{alert.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
