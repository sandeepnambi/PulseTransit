const mongoose = require('mongoose');

const RouteSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: {
    en: { type: String, required: true },
    ta: { type: String, required: true }
  },
  agency: { type: String, required: true, enum: ['MTC', 'TNSTC', 'SETC'] },
  origin: {
    en: { type: String, required: true },
    ta: { type: String, required: true }
  },
  destination: {
    en: { type: String, required: true },
    ta: { type: String, required: true }
  },
  totalDistanceKm: { type: Number, required: true },
  avgDurationMins: { type: Number, required: true },
  fareInINR: { type: Number, required: true },
  color: { type: String, default: '#6366F1' },
  path: [[Number]], // Array of [lng, lat]
  stopCodes: [{ type: String }],
  frequencyMins: { type: Number, default: 15 }
}, { timestamps: true });

module.exports = mongoose.models.Route || mongoose.model('Route', RouteSchema);
