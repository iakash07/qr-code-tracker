const mongoose = require('mongoose');

const qrCodeSchema = new mongoose.Schema({
  shortId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  originalUrl: {
    type: String,
    required: true
  },
  qrCodeData: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: 'Untitled QR Code'
  },
  description: {
    type: String,
    default: ''
  },
  scanCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
qrCodeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('QRCode', qrCodeSchema);
