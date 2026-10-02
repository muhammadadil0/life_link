const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { isDbConnected } = require('../config/db');

// GET /api/donors - list real verified donors from MongoDB
router.get('/', async (req, res) => {
  const { bloodGroup, city, availableOnly } = req.query;

  if (isDbConnected()) {
    try {
      const query = { userType: 'donor' };
      if (availableOnly === 'true') {
        query.isAvailable = true;
      }
      if (bloodGroup && bloodGroup !== 'all') {
        query.bloodGroup = bloodGroup;
      }
      if (city && city !== 'all') {
        query.city = { $regex: city, $options: 'i' };
      }

      const dbDonors = await User.find(query).select('-password').sort({ createdAt: -1 });
      const donors = dbDonors.map(d => ({
        id: d._id,
        name: d.name,
        blood_type: d.bloodGroup,
        city: d.city || d.address,
        address: d.address,
        phone: d.phone,
        age: d.age || 30,
        is_available: d.isAvailable,
        total_donations: d.totalDonations || 0,
        latitude: d.latitude || null,
        longitude: d.longitude || null,
        source: 'mongodb'
      }));

      return res.json({
        success: true,
        count: donors.length,
        data: donors
      });
    } catch (err) {
      console.error('Error fetching donors from MongoDB:', err.message);
    }
  }

  res.json({
    success: true,
    count: 0,
    data: []
  });
});

module.exports = router;
