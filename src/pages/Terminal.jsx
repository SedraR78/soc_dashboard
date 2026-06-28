import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export function TerminalPage() {
  const [command, setCommand] = useState('');
  const [output, setOutput] = useState('Welcome to SOC Terminal\n> ');
  const [loading, setLoading] = useState(false);

  const handleExecute = async (e) => {
    e.preventDefault();
    if (!command.trim()) return;

    setLoading(true);
    const newOutput = output + command + '\n';

    try {
      const token = localStorage.getItem('soc_token');
      const response = await axios.post(
        `${API_URL}/api/terminal/execute`,
        { command },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      const result = response.data.output || 'Command executed';
      setOutput(newOutput + result + '\n> ');
    } catch (err) {
      setOutput(newOutput + `Error: ${err.response?.data?.error || err.message}\n> `);
    } finally {
      setLoading(false);
      setCommand('');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      padding: '40px 24px',
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h1 style={{ color: '#f1f5f9', marginBottom: '20px' }}>🖥️ Terminal</h1>
        <div style={{
          background: '#0f172a',
          border: '1px solid rgba(148, 163, 184, 0.3)',
          borderRadius: '8px',
          padding: '20px',
          fontFamily: "'Courier New', monospace",
          color: '#00ff9d',
          minHeight: '400px',
          marginBottom: '20px',
          overflow: 'auto',
          whiteSpace: 'pre-wrap'
        }}>
          {output}
        </div>
        <form onSubmit={handleExecute} style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder="Type a command (help, nmap, whois, dig, ping, status)..."
            style={{
              flex: 1,
              padding: '12px',
              background: '#1e293b',
              border: '1px solid rgba(148, 163, 184, 0.3)',
              borderRadius: '6px',
              color: '#f1f5f9',
              fontFamily: "'Courier New', monospace"
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '12px 24px',
              background: '#00ff9d',
              color: '#000',
              border: 'none',
              borderRadius: '6px',
              fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1
            }}
          >
            {loading ? 'Executing...' : 'Execute'}
          </button>
        </form>
      </div>
    </div>
  );
}
