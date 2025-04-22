// backend/config/db.js
const mongoose = require('mongoose');

/**
 * Connect to MongoDB.
 * Uses MONGO_URI environment variable or defaults to local MongoDB.
 */
async function connectDB() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/battleship';
  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
}

module.exports = connectDB;