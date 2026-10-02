const express = require('express');
const router = express.Router();
const EmergencyRequest = require('../models/EmergencyRequest');
const { isDbConnected } = require('../config/db');
const { mockCarouselPatients, mockQuotes, mockEmergencyRequests } = require('../data/mockData');

// Local mutable copy of emergency requests for fallback
let emergencyRequests = [...mockEmergencyRequests];

// GET /api/emergencies - list all active emergency requests
router.get('/', async (req, res) => {
  const { bloodType, city } = req.query;

  if (isDbConnected()) {
    try {
      const query = {};
      if (bloodType && bloodType !== 'all') {
        query.blood_type = bloodType;
      }
      if (city) {
        query.city = { $regex: city, $options: 'i' };
      }
      const dbEmergencies = await EmergencyRequest.find(query).sort({ createdAt: -1 });
      return res.json({
        success: true,
        source: 'mongodb',
        count: dbEmergencies.length,
        data: dbEmergencies.map(e => ({
          id: e._id,
          patient_name: e.patient_name,
          blood_type: e.blood_type,
          units_needed: e.units_needed,
          urgency: e.urgency,
          hospital: e.hospital,
          contact: e.contact,
          city: e.city,
          status: e.status,
          created_at: e.createdAt
        }))
      });
    } catch (err) {
      console.error('Error querying MongoDB emergencies:', err.message);
    }
  }

  // Fallback to in-memory (only for offline development without DB)
  let results = [...emergencyRequests];
  if (bloodType && bloodType !== 'all') {
    results = results.filter((r) => r.blood_type.toLowerCase() === bloodType.toLowerCase());
  }
  if (city) {
    results = results.filter((r) => r.city.toLowerCase().includes(city.toLowerCase()));
  }

  res.json({
    success: true,
    source: 'in-memory',
    count: results.length,
    data: results
  });
});

// POST /api/emergencies - create emergency request
router.post('/', async (req, res) => {
  const { patient_name, blood_type, units_needed, urgency, hospital, contact, city } = req.body;

  if (!patient_name || !blood_type || !units_needed || !urgency || !hospital || !contact || !city) {
    return res.status(400).json({
      success: false,
      message: 'Please fill in all required emergency details.'
    });
  }

  if (isDbConnected()) {
    try {
      const newDoc = await EmergencyRequest.create({
        patient_name: patient_name.trim(),
        blood_type,
        units_needed: parseInt(units_needed, 10),
        urgency,
        hospital: hospital.trim(),
        contact: contact.trim(),
        city: city.trim(),
        status: 'Urgent'
      });

      console.log('\x1b[32m%s\x1b[0m', `✅ [MongoDB Emergency] New request saved: ${newDoc.patient_name} (${newDoc.blood_type})`);

      return res.status(201).json({
        success: true,
        message: 'Emergency blood request saved to MongoDB and broadcasted!',
        storage: 'mongodb',
        data: {
          id: newDoc._id,
          patient_name: newDoc.patient_name,
          blood_type: newDoc.blood_type,
          units_needed: newDoc.units_needed,
          urgency: newDoc.urgency,
          hospital: newDoc.hospital,
          contact: newDoc.contact,
          city: newDoc.city,
          created_at: newDoc.createdAt
        }
      });
    } catch (err) {
      console.error('Error creating emergency request in MongoDB:', err.message);
    }
  }

  // Fallback in-memory
  const newEmergency = {
    id: emergencyRequests.length + 1,
    patient_name: patient_name.trim(),
    blood_type,
    units_needed: parseInt(units_needed, 10),
    urgency,
    hospital: hospital.trim(),
    contact: contact.trim(),
    city: city.trim(),
    created_at: new Date().toISOString(),
    status: 'Active'
  };

  emergencyRequests.unshift(newEmergency);

  res.status(201).json({
    success: true,
    message: 'Emergency blood request published across the LifeLink network!',
    storage: 'memory-fallback',
    data: newEmergency
  });
});

// GET /api/emergencies/carousel - real emergency patients from MongoDB for the homepage carousel
router.get('/carousel', async (req, res) => {
  if (isDbConnected()) {
    try {
      const dbEmergencies = await EmergencyRequest.find().sort({ createdAt: -1 }).limit(5);
      if (dbEmergencies.length > 0) {
        return res.json({
          success: true,
          data: dbEmergencies.map((e, idx) => ({
            id: e._id,
            name: e.patient_name,
            bloodType: e.blood_type,
            urgency: e.urgency || 'Critical',
            hospital: e.hospital,
            city: e.city,
            units: e.units_needed,
            story: `Urgent requirement for ${e.units_needed} unit(s) of ${e.blood_type} at ${e.hospital}, ${e.city}. Contact: ${e.contact}`,
            heroImage: idx % 2 === 0 ? '/hero_slide_2.jpg' : '/hero_slide_3.jpg',
            badgeColor: e.urgency === 'Critical' ? 'bg-red-500' : 'bg-orange-500',
            urgencyBg: e.urgency === 'Critical' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
          }))
        });
      }
    } catch (err) {
      console.error('Error querying MongoDB emergencies for carousel:', err.message);
    }
  }

  res.json({
    success: true,
    data: []
  });
});

// GET /api/emergencies/quotes
router.get('/quotes', (req, res) => {
  res.json({
    success: true,
    data: mockQuotes
  });
});

module.exports = router;
