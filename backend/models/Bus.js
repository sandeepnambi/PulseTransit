const mongoose = require('mongoose');

const BusSchema = new mongoose.Schema({
  vehicleNumber: { type: String, required: true, unique: true },
  agency: { type: String, required: true, enum: ['MTC', 'TNSTC', 'SETC'] },
  routeCode: { type: String, required: true },
  currentLocation: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  },
  heading: { type: Number, default: 0 }, // 0 to 360 degrees
  speed: { type: Number, default: 0 }, // km/h
  status: { type: String, enum: ['ON_TIME', 'DELAYED', 'EMERGENCY', 'TERMINATED'], default: 'ON_TIME' },
  delayMinutes: { type: Number, default: 0 },
  occupancy: { type: String, enum: ['LOW', 'MODERATE', 'HIGH', 'FULL'], default: 'MODERATE' },
  acType: { type: String, enum: ['NON_AC', 'DELUXE_AC', 'ULTRA_DELUXE', 'SLEEPER_AC'], default: 'NON_AC' },
  driverName: { type: String, default: 'Thiru. R. Murugan' },
  driverPhone: { type: String, default: '+91 98401 23456' },
  nextStopCode: { type: String },
  etaNextStopMins: { type: Number, default: 2 },
  pathIndex: { type: Number, default: 0 },
  direction: { type: Number, default: 1 }, // 1 forward, -1 backward
  lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

BusSchema.index({ currentLocation: '2dsphere' });

module.exports = mongoose.models.Bus || mongoose.model('Bus', BusSchema);
