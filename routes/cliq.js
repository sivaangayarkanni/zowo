const express = require('express');
const router = express.Router();

// Handle /zowo-status command
router.post('/status', async (req, res) => {
  try {
    const healthData = await getSystemHealth();
    const response = {
      text: `🏥 ZOWO Health Status\n\n` +
            `System Health: ${healthData.score}/100\n` +
            `Active Workflows: ${healthData.activeWorkflows}\n` +
            `Recent Errors: ${healthData.recentErrors}\n` +
            `Status: ${healthData.status}`
    };
    res.json(response);
  } catch (error) {
    res.json({ text: "❌ Error fetching health status" });
  }
});

// Handle /zowo-alerts command
router.post('/alerts', async (req, res) => {
  try {
    const alerts = await getRecentAlerts();
    let alertText = "🚨 Recent Alerts:\n\n";
    
    if (alerts.length === 0) {
      alertText += "✅ No recent alerts";
    } else {
      alerts.slice(0, 5).forEach(alert => {
        alertText += `• ${alert.type}: ${alert.message}\n`;
      });
    }
    
    res.json({ text: alertText });
  } catch (error) {
    res.json({ text: "❌ Error fetching alerts" });
  }
});

// Handle /zowo-report command
router.post('/report', async (req, res) => {
  try {
    const report = await generateQuickReport();
    const response = {
      text: `📊 ZOWO Quick Report\n\n` +
            `Workflows Today: ${report.workflowsToday}\n` +
            `Success Rate: ${report.successRate}%\n` +
            `Avg Response Time: ${report.avgResponseTime}ms\n` +
            `Total Errors: ${report.totalErrors}`
    };
    res.json(response);
  } catch (error) {
    res.json({ text: "❌ Error generating report" });
  }
});

// Handle /zowo-workflows command
router.post('/workflows', async (req, res) => {
  try {
    const workflows = await getActiveWorkflows();
    let workflowText = "🔄 Active Workflows:\n\n";
    
    if (workflows.length === 0) {
      workflowText += "✅ No active workflows";
    } else {
      workflows.forEach(wf => {
        workflowText += `• ${wf.name}: ${wf.status}\n`;
      });
    }
    
    res.json({ text: workflowText });
  } catch (error) {
    res.json({ text: "❌ Error fetching workflows" });
  }
});

// Handle /zowo-errors command
router.post('/errors', async (req, res) => {
  try {
    const errors = await getRecentErrors();
    let errorText = "🚫 Recent Errors:\n\n";
    
    if (errors.length === 0) {
      errorText += "✅ No recent errors";
    } else {
      errors.slice(0, 5).forEach(err => {
        errorText += `• ${err.workflow}: ${err.message}\n`;
      });
    }
    
    res.json({ text: errorText });
  } catch (error) {
    res.json({ text: "❌ Error fetching errors" });
  }
});

// Handle /zowo-performance command
router.post('/performance', async (req, res) => {
  try {
    const perf = await getPerformanceMetrics();
    const response = {
      text: `⚡ Performance Metrics\n\n` +
            `CPU Usage: ${perf.cpuUsage}%\n` +
            `Memory Usage: ${perf.memoryUsage}%\n` +
            `API Response Time: ${perf.apiResponseTime}ms\n` +
            `Database Queries: ${perf.dbQueries}/min`
    };
    res.json(response);
  } catch (error) {
    res.json({ text: "❌ Error fetching performance data" });
  }
});

// Handle /zowo-help command
router.post('/help', async (req, res) => {
  const helpText = `🤖 ZOWO Bot Commands:\n\n` +
                   `• /zowo-status - Get CRM health status\n` +
                   `• /zowo-alerts - View recent alerts\n` +
                   `• /zowo-report - Generate quick report\n` +
                   `• /zowo-workflows - List active workflows\n` +
                   `• /zowo-errors - Show recent errors\n` +
                   `• /zowo-performance - Get performance metrics\n` +
                   `• /zowo-help - Show this help message`;
  
  res.json({ text: helpText });
});

// Webhook for sending notifications to Cliq
router.post('/webhook', async (req, res) => {
  const { type, message, severity } = req.body;
  
  const notification = {
    text: `🔔 ZOWO Alert\n\n` +
          `Type: ${type}\n` +
          `Severity: ${severity}\n` +
          `Message: ${message}`
  };
  
  // Send to Cliq channel
  await sendToCliq(notification);
  res.json({ status: "sent" });
});

// Helper functions
async function getSystemHealth() {
  // Mock data - replace with actual health check
  return {
    score: 85,
    activeWorkflows: 12,
    recentErrors: 2,
    status: "Good"
  };
}

async function getRecentAlerts() {
  // Mock data - replace with actual alerts
  return [
    { type: "Workflow", message: "Lead assignment failed" },
    { type: "Performance", message: "Response time high" }
  ];
}

async function generateQuickReport() {
  // Mock data - replace with actual reporting
  return {
    workflowsToday: 45,
    successRate: 92,
    avgResponseTime: 250,
    totalErrors: 3
  };
}

async function getActiveWorkflows() {
  // Mock data - replace with actual workflow data
  return [
    { name: "Lead Assignment", status: "Running" },
    { name: "Email Automation", status: "Paused" },
    { name: "Deal Updates", status: "Running" }
  ];
}

async function getRecentErrors() {
  // Mock data - replace with actual error data
  return [
    { workflow: "Lead Assignment", message: "API timeout" },
    { workflow: "Email Automation", message: "Template not found" }
  ];
}

async function getPerformanceMetrics() {
  // Mock data - replace with actual performance data
  return {
    cpuUsage: 45,
    memoryUsage: 62,
    apiResponseTime: 180,
    dbQueries: 150
  };
}

async function sendToCliq(message) {
  // Implement Cliq API call
  console.log("Sending to Cliq:", message);
}

module.exports = router;