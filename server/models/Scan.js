const mongoose = require('mongoose');

const scanSchema = new mongoose.Schema({
  qrCodeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'QRCode',
    required: true,
    index: true
  },
  shortId: {
    type: String,
    required: true,
    index: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  deviceType: {
    type: String,
    enum: ['mobile', 'tablet', 'desktop', 'unknown'],
    default: 'unknown'
  },
  browser: {
    type: String,
    default: 'unknown'
  },
  os: {
    type: String,
    default: 'unknown'
  },
  ipAddress: {
    type: String,
    default: 'unknown'
  },
  country: {
    type: String,
    default: 'unknown'
  },
  city: {
    type: String,
    default: 'unknown'
  },
  userAgent: {
    type: String,
    default: ''
  }
});

// Index for faster queries
scanSchema.index({ qrCodeId: 1, timestamp: -1 });

module.exports = mongoose.model('Scan', scanSchema);
