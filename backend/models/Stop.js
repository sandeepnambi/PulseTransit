const mongoose = require('mongoose');

const StopSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: {
    en: { type: String, required: true },
    ta: { type: String, required: true }
  },
  agency: { type: String, required: true },
  city: { type: String, required: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  },
  amenities: [{ type: String }],
  isTerminal: { type: Boolean, default: false }
}, { timestamps: true });

StopSchema.index({ location: '2dsphere' });

module.exports = mongoose.models.Stop || mongoose.model('Stop', StopSchema);
