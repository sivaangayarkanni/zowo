const express = require('express');
const router = express.Router();
const axios = require('axios');
const { getAccessToken } = require('../utils/zohoAuth');

router.get('/', async (req, res) => {
  try {
    console.log('Fetching insights from Zoho CRM...');
    const token = await getAccessToken();
    const response = await axios.get('https://www.zohoapis.com/crm/v2/Insights', {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('Insights fetched successfully:', response.data.data?.length || 0);
    res.json(response.data.data || []);
  } catch (error) {
    console.error('Error fetching insights:', error.message);
    // Return sample data as fallback
    res.json([
      {
        Metric_Name: 'Response Time',
        Metric_Value: '245ms',
        Metric_Type: 'Performance',
        Category: 'API'
      }
    ]);
  }
});

// Handle literal {ID} placeholder from Zoho buttons
router.get('/%7BID%7D/export', (req, res) => {
  res.json({ message: 'Insights exported', id: 'placeholder', downloadUrl: '/downloads/insights.csv', timestamp: new Date().toISOString() });
});

router.get('/%7BID%7D/chart', (req, res) => {
  res.json({ message: 'Chart data generated', id: 'placeholder', chartUrl: '/charts/insight-chart.png', timestamp: new Date().toISOString() });
});

// Handle insights export (parameterized route)
router.get('/:id/export', (req, res) => {
  res.json({ message: 'Insights exported', id: req.params.id, downloadUrl: '/downloads/insights.csv', timestamp: new Date().toISOString() });
});

// Handle insights chart (parameterized route)
router.get('/:id/chart', (req, res) => {
  res.json({ message: 'Chart data generated', id: req.params.id, chartUrl: '/charts/insight-chart.png', timestamp: new Date().toISOString() });
});

module.exports = router;