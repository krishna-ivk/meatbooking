const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/meatbooking';
  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected to', uri);
  } catch (err) {
    console.error('MongoDB connection error (tried', uri + '):', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
