import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function Chart({ data }) {
  return (
    <div style={{ marginTop: '32px', padding: '32px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: 'white' }}>Attacks Timeline (24h)</h2>
      
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
          <XAxis dataKey="hour" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #4b5563', borderRadius: '8px' }}
            labelStyle={{ color: 'white' }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="attacks" 
            stroke="#ef4444" 
            strokeWidth={3}
            dot={{ fill: '#ef4444', r: 5 }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
