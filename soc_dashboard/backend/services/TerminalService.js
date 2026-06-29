class TerminalService {
  constructor(threatAnalysisService) {
    this.threatAnalysisService = threatAnalysisService;
    this.commandHistory = [];
    this.blockedCommands = ['rm', 'sudo', 'dd', 'mkfs', 'chmod', 'passwd'];
  }

  executeCommand(command) {
    const trimmedCmd = command.trim();
    if (!this.isCommandAllowed(trimmedCmd)) {
      return { type: 'error', output: `Permission refusée: "${trimmedCmd.split(' ')[0]}"` };
    }
    this.commandHistory.push(trimmedCmd);
    const parts = trimmedCmd.split(/\s+/);
    const baseCmd = parts[0].toLowerCase();

    switch (baseCmd) {
      case 'help':
        return this.cmdHelp();
      case 'nmap':
        return this.cmdNmap(parts[1] || '192.168.1.1');
      case 'whois':
        return this.cmdWhois(parts[1] || '8.8.8.8');
      case 'dig':
        return this.cmdDig(parts[1] || 'google.com');
      case 'ping':
        return this.cmdPing(parts[1] || '8.8.8.8');
      case 'status':
        return this.cmdStatus();
      default:
        return { type: 'error', output: `${baseCmd}: commande introuvable` };
    }
  }

  isCommandAllowed(command) {
    const cmd = command.split(' ')[0].toLowerCase();
    return !this.blockedCommands.includes(cmd);
  }

  cmdHelp() {
    return { type: 'info', output: `Commandes disponibles:\n  nmap <ip>\n  whois <ip>\n  dig <domain>\n  ping <ip>\n  status\n  help` };
  }

  cmdNmap(ip) {
    return { type: 'output', output: `Nmap scan for ${ip}\n22/tcp open ssh\n80/tcp open http\n443/tcp open https` };
  }

  cmdWhois(ip) {
    return { type: 'output', output: `inetnum: ${ip}/24\ncountry: US\norg: Example ISP` };
  }

  cmdDig(domain) {
    return { type: 'output', output: `${domain} has address 8.8.8.8` };
  }

  cmdPing(ip) {
    return { type: 'output', output: `PING ${ip}: 4 packets transmitted, 4 received, 0% loss` };
  }

  cmdStatus() {
    return { type: 'success', output: `SOC Platform Status:\n● Dashboard: ONLINE\n● IDS Engine: ACTIVE\n● Backend API: RUNNING` };
  }
}

module.exports = TerminalService;
