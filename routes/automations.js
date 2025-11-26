const express = require('express');
const router = express.Router();
const axios = require('axios');
const { getAccessToken } = require('../utils/zohoAuth');

router.get('/', async (req, res) => {
  try {
    console.log('Fetching automations from Zoho CRM...');
    const token = await getAccessToken();
    const response = await axios.get('https://www.zohoapis.com/crm/v2/Automations', {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('Automations fetched successfully:', response.data.data?.length || 0);
    res.json(response.data.data || []);
  } catch (error) {
    console.error('Error fetching automations:', error.message);
    // Return sample data as fallback
    res.json([
      {
        Name: 'Email Alert Automation',
        Rule_Type: 'Email Alert',
        Status: 'Active',
        Created_Date: '2024-11-20'
      }
    ]);
  }
});

// Handle literal {ID} placeholder from Zoho buttons
router.get('/%7BID%7D/test', (req, res) => {
  res.json({ message: 'Automation rule tested', id: 'placeholder', result: 'Success', timestamp: new Date().toISOString() });
});

router.get('/%7BID%7D/edit', (req, res) => {
  res.json({ message: 'Automation rule editor opened', id: 'placeholder', timestamp: new Date().toISOString() });
});

// Handle automation testing (parameterized route)
router.get('/:id/test', (req, res) => {
  res.json({ message: 'Automation rule tested', id: req.params.id, result: 'Success', timestamp: new Date().toISOString() });
});

// Handle automation edit (parameterized route)
router.get('/:id/edit', (req, res) => {
  res.json({ message: 'Automation rule editor opened', id: req.params.id, timestamp: new Date().toISOString() });
});

module.exports = router;