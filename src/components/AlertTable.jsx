import React from 'react';

export function AlertTable({ alerts }) {
  // Function to get severity color
  const getSeverityColor = (severity) => {
    switch(severity.toLowerCase()) {
      case 'critical':
        return 'bg-red-900 bg-opacity-20 border-l-4 border-red-500 text-red-400';
      case 'high':
        return 'bg-orange-900 bg-opacity-20 border-l-4 border-orange-500 text-orange-400';
      case 'medium':
        return 'bg-yellow-900 bg-opacity-20 border-l-4 border-yellow-500 text-yellow-400';
      case 'low':
        return 'bg-green-900 bg-opacity-20 border-l-4 border-green-500 text-green-400';
      default:
        return 'bg-gray-900 bg-opacity-20 border-l-4 border-gray-500 text-gray-400';
    }
  };

  return (
    <div className="mt-8 p-8">
      <h2 className="text-2xl font-bold mb-4 text-white">Recent Alerts</h2>
      
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div 
            key={alert.id} 
            className={`p-4 rounded ${getSeverityColor(alert.severity)} hover:shadow-lg transition`}
          >
            <div className="grid grid-cols-5 gap-4">
              <div>
                <p className="text-xs text-gray-400 uppercase">Time</p>
                <p className="font-semibold">{alert.timestamp}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase">Type</p>
                <p className="font-semibold">{alert.type}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase">Source IP</p>
                <p className="font-mono">{alert.sourceIP}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase">Severity</p>
                <p className="font-semibold uppercase">{alert.severity}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase">Status</p>
                <p className="font-semibold">{alert.status}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
