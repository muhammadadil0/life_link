const express = require('express');
const cors = require('cors');
const dns = require('dns');
if (typeof dns.setDefaultResultOrder === 'function' && !process.env.VERCEL) {
  dns.setDefaultResultOrder('ipv4first');
}
require('dotenv').config();

const { connectDB, isDbConnected, getLastError } = require('./config/db');
const { seedDatabase } = require('./config/seed');

const app = express();
const PORT = process.env.PORT || 5050;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// Routes
const statsRoutes = require('./routes/stats');
const emergenciesRoutes = require('./routes/emergencies');
const authRoutes = require('./routes/auth');
const locationRoutes = require('./routes/location');
const donorsRoutes = require('./routes/donors');

app.use('/api/stats', statsRoutes);
app.use('/api/emergencies', emergenciesRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/donors', donorsRoutes);

// Health & Database Connection status endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'LifeLink Node.js API',
    database: {
      connected: isDbConnected(),
      type: isDbConnected() ? 'MongoDB' : 'In-Memory Resilient Store',
      uriConfigured: Boolean(process.env.MONGODB_URI && process.env.MONGODB_URI.trim().length > 0),
      lastError: getLastError()
    }
  });
});

// Auto-connect to database in serverless or standalone mode
let isDbConnecting = false;
const ensureDbConnection = async () => {
  if (!isDbConnected() && process.env.MONGODB_URI && !isDbConnecting) {
    isDbConnecting = true;
    try {
      const connected = await connectDB();
      if (connected) {
        await seedDatabase();
      }
    } catch (err) {
      console.error('Failed to auto-connect database in middleware:', err);
    } finally {
      isDbConnecting = false;
    }
  }
};

// Middleware for serverless request connection
app.use(async (req, res, next) => {
  await ensureDbConnection();
  next();
});

// Standalone server mode (only when run directly via node backend/server.js)
if (require.main === module && !process.env.VERCEL && !process.env.NOW_REGION) {
  app.listen(PORT, async () => {
    console.log(`LifeLink Node.js API server running on http://localhost:${PORT}`);
    const connected = await connectDB();
    if (connected) {
      await seedDatabase();
    }
  });
}

module.exports = app;
