const express = require('express');
const router = express.Router();
const scanController = require('../controllers/scanController');

// Track scan and redirect (this is called when QR code is scanned)
router.get('/:shortId', scanController.trackScan);

// Get scans for a specific QR code
router.get('/qr/:id', scanController.getQRScans);

module.exports = router;
