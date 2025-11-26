require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

// CORS for Zoho Web Tab access
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, ngrok-skip-browser-warning');
  res.header('ngrok-skip-browser-warning', 'true');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Import routes
const workflowsRoute = require('./routes/workflows');
const errorLogsRoute = require('./routes/errorLogs');
const insightsRoute = require('./routes/insights');
const healthRoute = require('./routes/health');
const automationsRoute = require('./routes/automations');
const settingsRoute = require('./routes/settings');
const auditTrailsRoute = require('./routes/auditTrails');
const reportingsRoute = require('./routes/reportings');
const cliqRoute = require('./routes/cliq');

// Root route
app.get('/', (req, res) => {
  res.json({
    message: '🚀 ZOWO Backend API',
    version: '1.0.0',
    endpoints: {
      workflows: '/api/workflows',
      errorLogs: '/api/error_logs',
      insights: '/api/insights',
      healthScore: '/api/health_score',
      automations: '/api/automations',
      settings: '/api/settings',
      auditTrails: '/api/audit_trails',
      reportings: '/api/reportings'
    }
  });
});

// Dashboard configuration endpoint
app.get('/api/config', (req, res) => {
  res.json({
    apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:5000/api',
    refreshInterval: parseInt(process.env.DASHBOARD_REFRESH_INTERVAL) || 30000,
    maxRecords: parseInt(process.env.MAX_RECORDS_DISPLAY) || 5,
    autoRefresh: process.env.ENABLE_AUTO_REFRESH === 'true',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Handle Zoho widget URLs with extra parameters
app.get(/\/dashboard\.html.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get(/\/business-card\.html.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'business-card.html'));
});

app.get(/\/settings\.html.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'settings.html'));
});

app.use('/api/workflows', workflowsRoute);
app.use('/api/error_logs', errorLogsRoute);
app.use('/api/insights', insightsRoute);
app.use('/api/health_score', healthRoute);
app.use('/api/automations', automationsRoute);
app.use('/api/settings', settingsRoute);
app.use('/api/audit_trails', auditTrailsRoute);
app.use('/api/reportings', reportingsRoute);
app.use('/cliq', cliqRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 ZOWO Backend running on http://localhost:${PORT}`));
