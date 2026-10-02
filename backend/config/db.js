const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.trim() === '' || uri.includes('<password>')) {
    console.log('\x1b[33m%s\x1b[0m', '⚡ [MongoDB] MONGODB_URI not provided or incomplete in .env.');
    console.log('\x1b[36m%s\x1b[0m', '👉 Paste your MongoDB connection string in lifelink-react-node/backend/.env (MONGODB_URI=your_url)');
    console.log('\x1b[33m%s\x1b[0m', '⚡ Backend is running with resilient memory store and will connect to MongoDB as soon as the URL is set.');
    return false;
  }

  try {
    const conn = await mongoose.connect(uri.trim(), {
      serverSelectionTimeoutMS: 8000,
    });
    isConnected = true;
    console.log('\x1b[32m%s\x1b[0m', `✅ [MongoDB Connected] Database Host: ${conn.connection.host} / DB: ${conn.connection.name}`);
    return true;
  } catch (error) {
    isConnected = false;
    console.error('\x1b[31m%s\x1b[0m', `❌ [MongoDB Connection Error]: ${error.message}`);
    console.log('\x1b[33m%s\x1b[0m', '⚡ Falling back to in-memory store so the app stays online.');
    return false;
  }
};

const isDbConnected = () => {
  return isConnected && mongoose.connection.readyState === 1;
};

module.exports = { connectDB, isDbConnected };
