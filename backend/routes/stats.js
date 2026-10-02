const express = require('express');
const router = express.Router();
const { mockStats } = require('../data/mockData');

// GET /api/stats
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: mockStats
  });
});

module.exports = router;
