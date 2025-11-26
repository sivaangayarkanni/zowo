const express = require('express');
const router = express.Router();
const axios = require('axios');
const { getAccessToken } = require('../utils/zohoAuth');

router.get('/', async (req, res) => {
  try {
    const token = await getAccessToken();
    const response = await axios.get('https://www.zohoapis.com/crm/v2/zowo__Audit_trails', {
      headers: { Authorization: `Bearer ${token}` }
    });
    res.json(response.data.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch audit trails' });
  }
});

// Handle export without ID (specific route first)
router.get('/export', (req, res) => {
  res.json({ message: 'Audit trail export started', timestamp: new Date().toISOString() });
});

// Handle literal {ID} placeholder from Zoho buttons
router.get('/%7BID%7D/record', (req, res) => {
  res.json({ message: 'Audit trail record details', id: 'placeholder', timestamp: new Date().toISOString() });
});

router.get('/%7BID%7D/export', (req, res) => {
  res.json({ message: 'Audit trail exported', id: 'placeholder', downloadUrl: '/downloads/audit.csv', timestamp: new Date().toISOString() });
});

// Handle audit trail record view (parameterized route after)
router.get('/:id/record', (req, res) => {
  res.json({ message: 'Audit trail record details', id: req.params.id, timestamp: new Date().toISOString() });
});

// Handle audit trail export (parameterized route after)
router.get('/:id/export', (req, res) => {
  res.json({ message: 'Audit trail exported', id: req.params.id, downloadUrl: '/downloads/audit.csv', timestamp: new Date().toISOString() });
});

module.exports = router;