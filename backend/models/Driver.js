const mongoose = require('mongoose');

const DriverSchema = new mongoose.Schema({
  driverId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  licenseNumber: { type: String, required: true },
  agency: { type: String, required: true },
  rating: { type: Number, default: 4.8 },
  assignedVehicle: { type: String },
  dutyStatus: { type: String, enum: ['ON_DUTY', 'OFF_DUTY', 'ON_BREAK'], default: 'ON_DUTY' }
}, { timestamps: true });

module.exports = mongoose.models.Driver || mongoose.model('Driver', DriverSchema);
