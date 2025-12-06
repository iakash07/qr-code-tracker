const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

// Get dashboard statistics
router.get('/dashboard', analyticsController.getDashboardStats);

// Get analytics for specific QR code
router.get('/qr/:id', analyticsController.getQRAnalytics);

module.exports = router;
