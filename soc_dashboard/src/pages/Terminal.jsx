import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001';

export function TerminalPage() {
  const navigate = useNavigate();
  const [mission, setMission] = useState('intro'); // intro | in_progress | complete
  const [output, setOutput] = useState(['Welcome to SOC Terminal\n> Type "help" for commands\n']);
  const [input, setInput] = useState('');
  const [foundPassword, setFoundPassword] = useState(false);
  const [score, setScore] = useState(0);

  const commands = {
    help: () => `
📚 AVAILABLE COMMANDS:
  help          - Show this help
  whoami        - Current user
  ls            - List files
  cat <file>    - Read file content
  nmap          - Port scan simulation
  grep <text>   - Search in files
  netstat       - Network stats
  ps            - Running processes
  clear         - Clear terminal
  submit        - Submit answer (if you found it!)
    `,
    whoami: () => `analyst@soc-machine:~$ whoami\nanalyst`,
    ls: () => `
    analyst@soc-machine:~$ ls -la
    drwxr-xr-x  user  staff  4096 Jun 28 19:00 .
    drwxr-xr-x  root  root   4096 Jun 28 19:00 ..
    -rw-r--r--  user  staff   512 Jun 28 10:30 .bashrc
    -rw-r--r--  user  staff  1024 Jun 28 15:45 notes.txt
    -rw-r--r--  user  staff   256 Jun 28 14:20 config.json
    drwxr-xr-x  user  staff  4096 Jun 28 19:00 .ssh`,
    'cat notes.txt': () => `
    analyst@soc-machine:~$ cat notes.txt
    
    === SECURITY NOTES ===
    Remember: The password is hidden in the config file
    Format: SECURITY_PASSWORD=xxxx
    Hint: Check config.json with grep
    Last updated: 28 Jun
    `,
    'cat config.json': () => `
    {
      "api_key": "sk_live_abc123",
      "database": "postgres://localhost:5432",
      "SECURITY_PASSWORD": "CyberSecure2024!",
      "timeout": 30000
    }`,
    'grep SECURITY_PASSWORD config.json': () => {
      setFoundPassword(true);
      setScore(score + 50);
      return `"SECURITY_PASSWORD": "CyberSecure2024!"\n\n✅ PASSWORD FOUND! Type "submit" to complete mission!`;
    },
    'grep -r "password" .': () => `
    .ssh/id_rsa.pub: password_hash=xxx
    config.json: SECURITY_PASSWORD=CyberSecure2024!
    .bashrc: # password stored securely`,
    nmap: () => `
    Starting Nmap scan on 192.168.1.0/24
    Nmap scan report for 192.168.1.105
    Host is up (0.024s latency)
    
    PORT      STATE  SERVICE
    22/tcp    open   ssh
    80/tcp    open   http
    443/tcp   open   https
    3306/tcp  open   mysql
    5432/tcp  open   postgres`,
    netstat: () => `
    Active Internet connections (tcp only)
    Proto Recv-Q Send-Q Local Addr  Foreign Addr      State
    tcp   0      0      localhost:5432  ESTABLISHED
    tcp   0      0      localhost:3306  ESTABLISHED
    tcp   0      1      192.168.1.1:22  ESTABLISHED`,
    ps: () => `
    PID   COMMAND
    1     /init
    25    sshd
    156   node (soc-backend)
    234   postgres
    256   mysql
    512   python3`,
    clear: () => {
      setOutput([]);
      return '';
    },
    submit: () => {
      if (foundPassword) {
        setMission('complete');
        setScore(score + 100);
        return '✅ MISSION COMPLETE! Password verified!\nScore: ' + (score + 100) + ' points';
      }
      return '❌ Password not found yet!';
    }
  };

  const executeCommand = () => {
    if (!input.trim()) return;

    const cmd = input.toLowerCase().trim();
    const newOutput = [...output, `analyst@soc-machine:~$ ${input}`];

    if (cmd in commands) {
      const result = commands[cmd]();
      newOutput.push(result || '');
    } else if (cmd.startsWith('cat ') || cmd.startsWith('grep ')) {
      const fullCmd = input.trim();
      if (fullCmd in commands) {
        newOutput.push(commands[fullCmd]());
      } else {
        newOutput.push(`bash: ${input}: command not found`);
      }
    } else {
      newOutput.push(`bash: ${input}: command not found`);
    }

    setOutput(newOutput);
    setInput('');
  };

  const navButtons = [
    { label: '🛡️ Dashboard', path: '/dashboard', color: '#3b82f6' },
    { label: '🔍 IP Analysis', path: '/ip-analysis', color: '#f59e0b' },
    { label: '🎯 Red Team', path: '/red-team', color: '#ef4444' },
    { label: '📋 Reports', path: '/reports', color: '#10b981' }
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: '40px 24px', fontFamily: "'Courier New', monospace" }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#00ff9d', fontSize: '28px', fontWeight: '700', margin: 0 }}>💻 SOC Terminal</h1>
          <button onClick={() => { localStorage.clear(); window.location.href = '/'; }} style={{ padding: '10px 20px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Logout</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px', marginBottom: '30px' }}>
          {navButtons.map((btn, i) => (
            <button key={i} onClick={() => navigate(btn.path)} style={{ padding: '12px 16px', background: `${btn.color}15`, border: `2px solid ${btn.color}`, borderRadius: '6px', color: '#f1f5f9', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }} onMouseEnter={(e) => { e.target.style.transform = 'translateY(-2px)'; }} onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; }}>{btn.label}</button>
          ))}
        </div>

        <div style={{ background: '#0f172a', border: '2px solid #00ff9d', borderRadius: '8px', padding: '20px', marginBottom: '20px', minHeight: '400px', maxHeight: '500px', overflowY: 'auto', fontFamily: "'Courier New', monospace", color: '#00ff9d', fontSize: '13px', lineHeight: '1.6' }}>
          {mission === 'intro' && (
            <div>
              <p style={{ color: '#ef4444', fontWeight: 'bold' }}>🎯 MISSION BRIEFING:</p>
              <p>You are a SOC analyst. A security breach has been detected.</p>
              <p>OBJECTIVE: Find the hidden password in the system files</p>
              <p>COMMANDS AVAILABLE: help, whoami, ls, cat, grep, nmap, netstat, ps</p>
              <p style={{ color: '#10b981' }}>Good luck! Type "help" to start.</p>
            </div>
          )}
          {output.map((line, i) => (
            <div key={i} style={{ whiteSpace: 'pre-wrap', color: line.includes('✅') ? '#10b981' : line.includes('❌') ? '#ef4444' : '#00ff9d' }}>
              {line}
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '10px' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && executeCommand()}
            placeholder="analyst@soc-machine:~$ "
            style={{ padding: '12px', background: '#1e293b', border: '2px solid #00ff9d', borderRadius: '6px', color: '#00ff9d', fontFamily: "'Courier New', monospace", fontSize: '13px' }}
          />
          <button onClick={executeCommand} style={{ padding: '12px 24px', background: '#00ff9d', color: '#0f172a', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>Execute</button>
        </div>

        {foundPassword && mission !== 'complete' && (
          <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(16, 185, 129, 0.2)', border: '2px solid #10b981', borderRadius: '6px', color: '#10b981' }}>
            ✅ PASSWORD FOUND! Type "submit" to complete the mission!
          </div>
        )}

        {mission === 'complete' && (
          <div style={{ marginTop: '20px', padding: '20px', background: 'rgba(16, 185, 129, 0.2)', border: '2px solid #10b981', borderRadius: '6px', color: '#10b981', textAlign: 'center' }}>
            <h2>🎉 MISSION COMPLETE!</h2>
            <p>Score: {score} points</p>
            <button onClick={() => navigate('/dashboard')} style={{ padding: '10px 20px', background: '#10b981', color: '#0f172a', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Back to Dashboard</button>
          </div>
        )}
      </div>
    </div>
  );
}
