class Incident {
  constructor(
    id,
    timestamp,
    attackType,
    sourceIP,
    targetResource,
    severity = 'medium',
    status = 'open'
  ) {
    this.id = id;
    this.timestamp = timestamp || new Date().toISOString();
    this.attackType = attackType;
    this.sourceIP = sourceIP;
    this.targetResource = targetResource;
    this.severity = severity;
    this.status = status;
    this.detectedBy = 'IDS_RULE_001';
    this.description = '';
    this.comments = [];
  }
}

module.exports = Incident;
