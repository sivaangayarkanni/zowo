const express = require('express');
const router = express.Router();
const axios = require('axios');
const { getAccessToken } = require('../utils/zohoAuth');

router.get('/', async (req, res) => {
  try {
    const token = await getAccessToken();
    const response = await axios.get('https://www.zohoapis.com/crm/v2/zowo__reportings', {
      headers: { Authorization: `Bearer ${token}` }
    });
    res.json(response.data.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch reportings' });
  }
});

// Handle generate without ID (specific route first)
router.get('/generate', (req, res) => {
  res.json({ message: 'Report generation started', timestamp: new Date().toISOString() });
});

// Handle literal {ID} placeholder from Zoho buttons
router.get('/%7BID%7D/generate', (req, res) => {
  res.json({ message: 'Report generation started', id: 'placeholder', timestamp: new Date().toISOString() });
});

router.get('/%7BID%7D/download', (req, res) => {
  res.json({ message: 'Report download ready', id: 'placeholder', downloadUrl: '/downloads/report.pdf', timestamp: new Date().toISOString() });
});

// Handle report generation (parameterized route after)
router.get('/:id/generate', (req, res) => {
  res.json({ message: 'Report generation started', id: req.params.id, timestamp: new Date().toISOString() });
});

// Handle report download (parameterized route after)
router.get('/:id/download', (req, res) => {
  res.json({ message: 'Report download ready', id: req.params.id, downloadUrl: '/downloads/report.pdf', timestamp: new Date().toISOString() });
});

module.exports = router;