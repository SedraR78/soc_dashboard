class RedTeamService {
  constructor(idsService) {
    this.idsService = idsService;
  }

  simulateSSHBrute(targetIP = '203.0.113.42') {
    const generatedIncidents = [];
    for (let i = 0; i < 3; i++) {
      generatedIncidents.push({
        id: this.idsService.incidents.length + generatedIncidents.length + 1,
        timestamp: new Date().toISOString(),
        attackType: 'SSH Brute Force',
        sourceIP: targetIP,
        targetResource: 'SSH:22',
        severity: 'high',
        status: 'open',
        detectedBy: 'RED_TEAM_SIM',
        description: `[SIM] 25 tentatives SSH échouées de ${targetIP}`
      });
    }
    this.idsService.incidents.unshift(...generatedIncidents);
    return {
      type: 'SSH Brute Force',
      simulatedIP: targetIP,
      logsGenerated: 25,
      incidentsCreated: generatedIncidents.length,
      detectionRate: 100
    };
  }

  simulatePortScan(targetIP = '203.0.113.42') {
    const ports = [22, 80, 443, 3306, 8080, 9000];
    const incident = {
      id: this.idsService.incidents.length + 1,
      timestamp: new Date().toISOString(),
      attackType: 'Port Scan',
      sourceIP: targetIP,
      targetResource: `Multiple Ports (${ports.join(', ')})`,
      severity: 'medium',
      status: 'open',
      detectedBy: 'RED_TEAM_SIM',
      description: `[SIM] Scan de ${ports.length} ports détecté`
    };
    this.idsService.incidents.unshift(incident);
    return {
      type: 'Port Scan',
      simulatedIP: targetIP,
      portsScanned: ports.length,
      detectionRate: 100
    };
  }

  simulate(attackType, targetIP = '203.0.113.42') {
    let result;
    if (attackType === 'ssh') result = this.simulateSSHBrute(targetIP);
    else if (attackType === 'portscan') result = this.simulatePortScan(targetIP);
    else result = this.simulateSSHBrute(targetIP);
    return {
      simulationId: `SIM-${Date.now()}`,
      status: 'completed',
      ...result,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = RedTeamService;
