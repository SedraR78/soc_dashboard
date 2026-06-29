class RedTeamService {
  constructor(idsService) {
    this.idsService = idsService;
  }

  simulateAttack(attackType) {
    console.log('🎯 Simulating attack:', attackType);
    
    let description = '';
    let incidents = 3;

    if (attackType === 'ssh') {
      description = 'SSH Brute Force attack simulation - 25 login attempts detected';
      incidents = 3;
    } else if (attackType === 'portscan') {
      description = 'Port Scan detected on network - 6 ports scanned';
      incidents = 1;
    } else if (attackType === 'sqli') {
      description = 'SQL Injection attack detected on login endpoint';
      incidents = 2;
    } else if (attackType === 'ddos') {
      description = 'DDoS attack simulation - server flooded with requests';
      incidents = 4;
    }

    // Log incidents to IDS if available
    if (this.idsService && this.idsService.incidents) {
      for (let i = 0; i < incidents; i++) {
        this.idsService.incidents.push({
          id: this.idsService.incidents.length + 1,
          timestamp: new Date().toISOString(),
          attackType: attackType,
          sourceIP: '203.0.113.' + (40 + i),
          severity: i === 0 ? 'critical' : 'high',
          status: 'open',
          description: description
        });
      }
    }

    return {
      simulationId: `SIM-${Date.now()}${Math.floor(Math.random() * 1000000)}`,
      attackType: attackType,
      detectionRate: 100,
      incidentsCreated: incidents,
      status: 'completed',
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = RedTeamService;
