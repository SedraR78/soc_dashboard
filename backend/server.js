require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const db = require('./db');
const AuthService = require('./services/AuthService');
const IDSService = require('./services/IDSService');
const ThreatAnalysisService = require('./services/ThreatAnalysisService');
const ReportService = require('./services/ReportService');
const TerminalService = require('./services/TerminalService');
const authMiddleware = require('./middleware/authMiddleware');
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const threatsRoutes = require('./routes/threats');
const idsRoutes = require('./routes/ids');
const redteamRoutes = require('./routes/redteam');
const reportRoutes = require('./routes/reports');
const terminalRoutes = require('./routes/terminal');

const app = express();
const PORT = process.env.PORT || 8001;
const JWT_SECRET = process.env.JWT_SECRET || 'holberton_soc_secret_2026';

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(morgan('dev'));

const authService = new AuthService(JWT_SECRET);
const idsService = new IDSService();
const threatAnalysisService = new ThreatAnalysisService(idsService);
const reportService = new ReportService(threatAnalysisService, idsService);
const terminalService = new TerminalService(threatAnalysisService);

const authMW = authMiddleware(authService);

app.use('/api/auth', authRoutes(authService));
app.use('/api/dashboard', dashboardRoutes(db, authMW));
app.use('/api/threats', threatsRoutes(threatAnalysisService, authMW));
app.use('/api/ids', idsRoutes(db, authMW));
app.use('/api/red-team', redteamRoutes(db, authMW));
app.use('/api/reports', reportRoutes(reportService, authMW));
app.use('/api/terminal', terminalRoutes(terminalService, authMW));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'SOC Backend', port: PORT });
});

app.listen(PORT, () => {
  console.log(`SOC Backend running on http://localhost:${PORT}`);
});
