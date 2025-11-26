const express = require('express');
const router = express.Router();
const axios = require('axios');
const { getAccessToken } = require('../utils/zohoAuth');

router.get('/', async (req, res) => {
  // Return sample data for demo
  res.json([
    {
      Name: 'Email Campaign Workflow',
      Status: 'Active',
      Trigger_Type: 'Scheduled',
      Last_Executed: '2024-11-24 10:30:00',
      Success_Rate: 95
    },
    {
      Name: 'Lead Scoring Workflow', 
      Status: 'Active',
      Trigger_Type: 'Event-based',
      Last_Executed: '2024-11-24 09:15:00',
      Success_Rate: 88
    },
    {
      Name: 'Data Sync Workflow',
      Status: 'Error',
      Trigger_Type: 'Manual',
      Last_Executed: '2024-11-24 08:45:00',
      Success_Rate: 72
    }
  ]);
});

// Handle workflow execution without ID (specific route first)
router.get('/execute', (req, res) => {
  res.json({ message: 'Workflow execution triggered', timestamp: new Date().toISOString() });
});

// Handle literal {ID} placeholder from Zoho buttons
router.get('/%7BID%7D/execute', (req, res) => {
  res.json({ message: 'Workflow executed', id: 'placeholder', timestamp: new Date().toISOString() });
});

router.get('/%7BID%7D/edit', (req, res) => {
  res.json({ message: 'Workflow editor opened', id: 'placeholder', timestamp: new Date().toISOString() });
});

router.get('/%7BID%7D', (req, res) => {
  res.json({ message: 'Workflow details', id: 'placeholder', timestamp: new Date().toISOString() });
});

// Handle execute requests (parameterized route after)
router.get('/:id/execute', (req, res) => {
  res.json({ message: 'Workflow executed', id: req.params.id, timestamp: new Date().toISOString() });
});

// Handle workflow edit (parameterized route after)
router.get('/:id/edit', (req, res) => {
  res.json({ message: 'Workflow editor opened', id: req.params.id, timestamp: new Date().toISOString() });
});

// Handle workflow details (parameterized route after)
router.get('/:id', (req, res) => {
  res.json({ message: 'Workflow details', id: req.params.id, timestamp: new Date().toISOString() });
});

module.exports = router;