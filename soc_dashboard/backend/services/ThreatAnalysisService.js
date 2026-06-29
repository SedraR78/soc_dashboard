class ThreatAnalysisService {
  constructor(idsService) {
    this.idsService = idsService;
    this.ipCache = new Map();
    this.initializeIpDatabase();
  }

  initializeIpDatabase() {
    this.ipDatabase = {
      '192.168.1.105': {
        country: 'Russia',
        city: 'Moscow',
        latitude: 55.7558,
        longitude: 37.6173,
        isp: 'Yandex Cloud',
        abuseConfidenceScore: 94,
        dangerScore: 85,
        isBlacklisted: true
      },
      '10.0.0.54': {
        country: 'Japan',
        city: 'Tokyo',
        latitude: 35.6762,
        longitude: 139.6503,
        isp: 'NTT Communications',
        abuseConfidenceScore: 55,
        dangerScore: 62,
        isBlacklisted: false
      }
    };
  }

  async analyzeIP(ipAddress) {
    if (this.ipCache.has(ipAddress)) return this.ipCache.get(ipAddress);
    let ipData = this.ipDatabase[ipAddress];
    if (!ipData) ipData = this.generateRandomIPData(ipAddress);
    const relatedIncidents = this.idsService.incidents.filter(i => i.sourceIP === ipAddress);
    const result = {
      ip: ipAddress,
      ...ipData,
      incidentsCount: relatedIncidents.length,
      incidents: relatedIncidents.slice(0, 10)
    };
    this.ipCache.set(ipAddress, result);
    return result;
  }

  generateRandomIPData(ip) {
    const countries = [
      { name: 'China', city: 'Shanghai', lat: 31.23, lng: 121.47 },
      { name: 'Brazil', city: 'São Paulo', lat: -23.55, lng: -46.63 }
    ];
    const country = countries[Math.floor(Math.random() * countries.length)];
    const score = Math.floor(Math.random() * 100);
    return {
      country: country.name,
      city: country.city,
      latitude: country.lat,
      longitude: country.lng,
      isp: `ISP-${Math.random().toString(36).substring(7).toUpperCase()}`,
      abuseConfidenceScore: score,
      dangerScore: score,
      isBlacklisted: score > 70
    };
  }

  isBlacklisted(ipAddress) {
    const ipData = this.ipDatabase[ipAddress];
    return ipData ? ipData.isBlacklisted : false;
  }

  blockIP(ipAddress) {
    if (!this.ipDatabase[ipAddress]) {
      this.ipDatabase[ipAddress] = this.generateRandomIPData(ipAddress);
    }
    this.ipDatabase[ipAddress].isBlacklisted = true;
    this.ipCache.delete(ipAddress);
  }
}

module.exports = ThreatAnalysisService;
