class IDSService {
  constructor() {
    this.incidents = [];
    this.initializeDemoIncidents();
  }

  initializeDemoIncidents() {
    const now = Date.now();
    this.incidents = [
      {
        id: 1,
        timestamp: new Date(now - 1800000).toISOString(),
        attackType: 'SSH Brute Force',
        sourceIP: '192.168.1.105',
        targetResource: 'SSH:22',
        severity: 'high',
        status: 'open',
        detectedBy: 'IDS_RULE_001',
        description: '25 tentatives SSH échouées en 45 min'
      },
      {
        id: 2,
        timestamp: new Date(now - 3600000).toISOString(),
        attackType: 'Port Scan',
        sourceIP: '10.0.0.54',
        targetResource: 'Multiple',
        severity: 'medium',
        status: 'investigating',
        detectedBy: 'IDS_RULE_002',
        description: 'Scan de 20 ports détecté'
      },
      {
        id: 3,
        timestamp: new Date(now - 5400000).toISOString(),
        attackType: 'SQL Injection',
        sourceIP: '172.16.0.22',
        targetResource: '/api/login',
        severity: 'high',
        status: 'open',
        detectedBy: 'IDS_RULE_003',
        description: 'Tentative SQL injection détectée'
      }
    ];
  }

  parseLogFile(content) {
    const lines = content.split('\n').filter(l => l.trim());
    const detections = {
      sshBruteForce: 0,
      portScan: 0,
      sqlInjection: 0,
      httpSuspect: 0,
      ips: new Set()
    };

    lines.forEach(line => {
      const lower = line.toLowerCase();
      if (lower.includes('failed password') || lower.includes('invalid user')) {
        detections.sshBruteForce++;
        const ip = line.match(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/)?.[0];
        if (ip) detections.ips.add(ip);
      }
      if (lower.includes('connection refused') && lower.includes('port')) {
        detections.portScan++;
      }
      if ((lower.includes('select') && lower.includes('from')) || lower.includes("' or '1'='1")) {
        detections.sqlInjection++;
      }
    });

    return {
      linesProcessed: lines.length,
      detections,
      anomaliesFound: detections.sshBruteForce + detections.portScan + detections.sqlInjection
    };
  }

  createIncidentsFromDetections(detections, sourceIP = '192.168.1.105') {
    const newIncidents = [];
    const now = new Date();

    if (detections.sshBruteForce >= 5) {
      newIncidents.push({
        id: this.incidents.length + newIncidents.length + 1,
        timestamp: now.toISOString(),
        attackType: 'SSH Brute Force',
        sourceIP,
        targetResource: 'SSH:22',
        severity: 'high',
        status: 'open',
        detectedBy: 'IDS_UPLOAD',
        description: `${detections.sshBruteForce} tentatives SSH échouées`
      });
    }

    this.incidents.unshift(...newIncidents);
    return newIncidents;
  }

  getIncidents(limit = 50) {
    return this.incidents.slice(0, limit);
  }
}

module.exports = IDSService;
