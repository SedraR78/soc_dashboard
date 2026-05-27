import React from 'react';

export function AlertTable({ alerts }) {
  // TODO: Create a table with headers:
  // - Timestamp
  // - Type
  // - Source IP
  // - Severity
  // - Status
  //
  // TODO: Map through alerts array and create a row for each
  //
  // TODO: Color code severity:
  // - critical = bg-red-200, text-red-800
  // - high = bg-orange-200, text-orange-800
  // - medium = bg-yellow-200, text-yellow-800
  // - low = bg-green-200, text-green-800
  //
  // Tailwind classes:
  // - w-full, border-collapse, border
  // - thead bg-gray-200
  // - tbody with tr and td
  // - p-2 (padding in cells)

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Recent Alerts</h2>
      {/* TODO: Create table here */}
      <p>Alerts table will go here</p>
    </div>
  );
}
