const mongoose = require('mongoose');

const TelemetrySchema = new mongoose.Schema({
  deviceId: { type: String, required: true }, // e.g. ESP32-TN01N9821
  vehicleNumber: { type: String, required: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } // [lng, lat]
  },
  speed: { type: Number, default: 0 },
  heading: { type: Number, default: 0 },
  satelliteCount: { type: Number, default: 12 },
  batteryVoltage: { type: Number, default: 12.6 },
  signalStrength: { type: Number, default: 85 },
  rawPayload: { type: String },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

TelemetrySchema.index({ location: '2dsphere' });

module.exports = mongoose.models.Telemetry || mongoose.model('Telemetry', TelemetrySchema);
