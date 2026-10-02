const express = require('express');
const router = express.Router();
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

// 1. IP-based location fallback
router.get('/detect', async (req, res) => {
  try {
    const response = await fetch('http://ip-api.com/json/', { signal: AbortSignal.timeout(5000) });
    const ipData = await response.json();
    if (ipData && ipData.status === 'success') {
      return res.json({
        success: true,
        source: 'network_ip',
        city: ipData.city || '',
        region: ipData.regionName || '',
        country: ipData.country || '',
        latitude: ipData.lat ? ipData.lat.toFixed(6) : '',
        longitude: ipData.lon ? ipData.lon.toFixed(6) : '',
        formattedAddress: [ipData.city, ipData.regionName, ipData.country].filter(Boolean).join(', ')
      });
    }

    return res.status(500).json({ success: false, message: 'Could not resolve IP location' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// 2. Reverse geocode coordinates to human-readable address
router.get('/reverse', async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) {
    return res.status(400).json({ success: false, message: 'Latitude and longitude are required' });
  }

  try {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${encodeURIComponent(lat)}&longitude=${encodeURIComponent(lon)}&localityLanguage=en`;
    const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
    const geoData = await response.json();

    if (geoData) {
      const city = geoData.city || geoData.locality || '';
      const state = geoData.principalSubdivision || '';
      const country = geoData.countryName || '';
      const displayName = [city, state, country].filter(Boolean).join(', ');

      return res.json({
        success: true,
        displayName: displayName || `${lat}, ${lon}`,
        city,
        state,
        country
      });
    }

    return res.json({ success: false, message: 'Address not found' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
