import React from 'react';

export function KPICards({ data }) {
  return (
    // Grid layout: 4 equal columns with spacing between them
    <div className="grid grid-cols-4 gap-4">

      {/* CARD 1: Failed Logins count */}
      <div className="bg-red-100 p-6 rounded-lg shadow-md">
        {/* Small label at top */}
        <h3 className="text-gray-600 text-sm font-semibold mb-2">Failed Logins</h3>
        {/* Big number from mock data */}
        <p className="text-4xl font-bold text-red-600">{data.failedLogins}</p>
      </div>

      {/* CARD 2: Suspicious IPs count */}
      <div className="bg-orange-100 p-6 rounded-lg shadow-md">
        <h3 className="text-gray-600 text-sm font-semibold mb-2">Suspicious IPs</h3>
        <p className="text-4xl font-bold text-orange-600">{data.suspiciousIPs}</p>
      </div>

      {/* CARD 3: Attacks Detected count */}
      <div className="bg-yellow-100 p-6 rounded-lg shadow-md">
        <h3 className="text-gray-600 text-sm font-semibold mb-2">Attacks Detected</h3>
        <p className="text-4xl font-bold text-yellow-600">{data.attacksDetected}</p>
      </div>

      {/* CARD 4: When was the last update */}
      <div className="bg-blue-100 p-6 rounded-lg shadow-md">
        <h3 className="text-gray-600 text-sm font-semibold mb-2">Last Updated</h3>
        <p className="text-lg font-bold text-blue-600">{data.lastUpdated}</p>
      </div>

    </div>
  );
}
