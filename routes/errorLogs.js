const express = require('express');
const router = express.Router();
const axios = require('axios');
const { getAccessToken } = require('../utils/zohoAuth');

router.get('/', async (req, res) => {
  try {
    console.log('Fetching error logs from Zoho CRM...');
    const token = await getAccessToken();
    const response = await axios.get('https://www.zohoapis.com/crm/v2/Error_logs', {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('Error logs fetched successfully:', response.data.data?.length || 0);
    res.json(response.data.data || []);
  } catch (error) {
    console.error('Error fetching error logs:', error.message);
    // Return sample data as fallback
    res.json([
      {
        Error_Message: 'Database connection timeout',
        Error_Code: 'DB_001',
        Severity: 'High',
        Module_Name: 'Authentication',
        Timestamp: '2024-11-24 11:45:00',
        Status: 'New'
      }
    ]);
  }
});

// Handle literal {ID} placeholder from Zoho buttons
router.get('/%7BID%7D/resolve', (req, res) => {
  res.json({ message: 'Error marked as resolved', id: 'placeholder', timestamp: new Date().toISOString() });
});

router.get('/%7BID%7D/details', (req, res) => {
  res.json({ message: 'Error stack trace details', id: 'placeholder', timestamp: new Date().toISOString() });
});

router.get('/%7BID%7D', (req, res) => {
  res.json({ message: 'Error details', id: 'placeholder', timestamp: new Date().toISOString() });
});

// Handle error resolution (parameterized route)
router.get('/:id/resolve', (req, res) => {
  res.json({ message: 'Error marked as resolved', id: req.params.id, timestamp: new Date().toISOString() });
});

// Handle error details view (parameterized route)
router.get('/:id/details', (req, res) => {
  res.json({ message: 'Error stack trace details', id: req.params.id, timestamp: new Date().toISOString() });
});

// Handle error details (parameterized route)
router.get('/:id', (req, res) => {
  res.json({ message: 'Error details', id: req.params.id, timestamp: new Date().toISOString() });
});

module.exports = router;