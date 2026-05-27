import React from 'react';

export function Map() {
  // For now, just a placeholder
  // We'll add Leaflet (real map) later
  
  return (
    <div className="mt-8 p-8">
      {/* Title */}
      <h2 className="text-2xl font-bold mb-4">Attack Locations</h2>
      
      {/* Placeholder for map */}
      <div className="w-full h-96 bg-gray-300 rounded border border-gray-400 flex items-center justify-center">
        <p className="text-gray-600">Map will be here soon (Leaflet integration coming)</p>
      </div>
    </div>
  );
}
