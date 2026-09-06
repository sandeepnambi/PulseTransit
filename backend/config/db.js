const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pulsetransit';
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000
    });
    console.log(`[DB] Connected to MongoDB database successfully.`);
    return true;
  } catch (error) {
    console.warn(`[DB] MongoDB not available (${error.message}). Using high-performance in-memory datastore fallback.`);
    return false;
  }
};

module.exports = connectDB;
