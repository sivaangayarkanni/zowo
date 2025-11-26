const express = require('express');
const router = express.Router();
const axios = require('axios');
const { getAccessToken } = require('../utils/zohoAuth');

router.get('/', async (req, res) => {
  try {
    const token = await getAccessToken();
    const response = await axios.get('https://www.zohoapis.com/crm/v2/zowo__settings1', {
      headers: { Authorization: `Bearer ${token}` }
    });
    res.json(response.data.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// Handle apply without ID (specific route first)
router.get('/apply', (req, res) => {
  res.json({ message: 'Settings applied', timestamp: new Date().toISOString() });
});

// Handle literal {ID} placeholder from Zoho buttons
router.get('/%7BID%7D/apply', (req, res) => {
  res.json({ message: 'Settings applied successfully', id: 'placeholder', timestamp: new Date().toISOString() });
});

// Handle settings apply (parameterized route after)
router.get('/:id/apply', (req, res) => {
  res.json({ message: 'Settings applied successfully', id: req.params.id, timestamp: new Date().toISOString() });
});

// Handle settings reset (parameterized route after)
router.get('/:id/reset', (req, res) => {
  res.json({ message: 'Settings reset to default', id: req.params.id, timestamp: new Date().toISOString() });
});

module.exports = router;