class ReportService {
  constructor(threatAnalysisService, idsService) {
    this.threatAnalysisService = threatAnalysisService;
    this.idsService = idsService;
  }

  async generateReport(incidentId) {
    const incident = this.idsService.incidents.find(i => i.id == incidentId);
    if (!incident) throw new Error('Incident not found');
    const ipAnalysis = await this.threatAnalysisService.analyzeIP(incident.sourceIP);
    const report = this.formatReport(incident, ipAnalysis);
    return {
      reportId: `RPT-${Date.now()}`,
      incidentId,
      content: report,
      format: 'text',
      generatedAt: new Date().toISOString()
    };
  }

  formatReport(incident, ipAnalysis) {
    const separator = '═'.repeat(60);
    return `
${separator}
RAPPORT D'INCIDENT — HOLBERTON SOC
${separator}

ID Incident      : ${incident.id}
Type d'attaque   : ${incident.attackType}
Sévérité         : ${incident.severity.toUpperCase()}
IP Source        : ${incident.sourceIP}
Pays/Ville       : ${ipAnalysis.city}, ${ipAnalysis.country}
Score Danger     : ${ipAnalysis.dangerScore}/100
En liste noire   : ${ipAnalysis.isBlacklisted ? 'OUI' : 'NON'}

${separator}
`;
  }
}

module.exports = ReportService;
