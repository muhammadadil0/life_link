const mongoose = require('mongoose');

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null, lastError: null };
}

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.trim() === '' || uri.includes('<password>')) {
    console.log('\x1b[33m%s\x1b[0m', '⚡ [MongoDB] MONGODB_URI not provided or incomplete.');
    return false;
  }

  if (cached.conn && mongoose.connection.readyState === 1) {
    return true;
  }

  if (!cached.promise) {
    const opts = {
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 8000
    };

    cached.promise = mongoose.connect(uri.trim(), opts).then((conn) => {
      console.log('\x1b[32m%s\x1b[0m', `✅ [MongoDB Connected] Database Host: ${conn.connection.host} / DB: ${conn.connection.name}`);
      cached.conn = conn;
      cached.lastError = null;
      return true;
    }).catch((error) => {
      cached.promise = null;
      cached.lastError = error.message;
      console.error('\x1b[31m%s\x1b[0m', `❌ [MongoDB Connection Error]: ${error.message}`);
      return false;
    });
  }

  try {
    return await cached.promise;
  } catch (err) {
    cached.promise = null;
    cached.lastError = err.message;
    return false;
  }
};

const isDbConnected = () => {
  return mongoose.connection && mongoose.connection.readyState === 1;
};

const getLastError = () => {
  return cached ? cached.lastError : null;
};

module.exports = { connectDB, isDbConnected, getLastError };
