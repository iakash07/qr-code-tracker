const express = require('express');
const router = express.Router();
const qrController = require('../controllers/qrController');

// Generate new QR code
router.post('/generate', qrController.generateQR);

// Get all QR codes
router.get('/all', qrController.getAllQRCodes);

// Get QR code by short ID (must come before /:id to avoid conflicts)
router.get('/short/:shortId', qrController.getQRByShortId);

// Get single QR code by ID
router.get('/:id', qrController.getQRCode);

// Update QR code
router.put('/:id', qrController.updateQRCode);

// Delete QR code
router.delete('/:id', qrController.deleteQRCode);

module.exports = router;
