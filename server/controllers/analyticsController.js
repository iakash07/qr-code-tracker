const QRCode = require('../models/QRCode');
const Scan = require('../models/Scan');

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const { period = '7d' } = req.query;

    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    
    switch(period) {
      case '24h':
        startDate.setHours(now.getHours() - 24);
        break;
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }

    // Total QR codes
    const totalQRCodes = await QRCode.countDocuments();

    // Total scans
    const totalScans = await Scan.countDocuments();

    // Scans in period
    const scansInPeriod = await Scan.countDocuments({
      timestamp: { $gte: startDate }
    });

    // Most scanned QR codes
    const mostScanned = await QRCode.find()
      .sort({ scanCount: -1 })
      .limit(5)
      .select('title shortId scanCount originalUrl createdAt');

    // Recent scans
    const recentScans = await Scan.find()
      .sort({ timestamp: -1 })
      .limit(10)
      .populate('qrCodeId', 'title shortId');

    // Device type breakdown
    const deviceStats = await Scan.aggregate([
      { $match: { timestamp: { $gte: startDate } } },
      { $group: { _id: '$deviceType', count: { $sum: 1 } } }
    ]);

    // Daily scan trend
    const dailyScans = await Scan.aggregate([
      { $match: { timestamp: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Country breakdown
    const countryStats = await Scan.aggregate([
      { $match: { timestamp: { $gte: startDate }, country: { $ne: 'unknown' } } },
      { $group: { _id: '$country', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalQRCodes,
          totalScans,
          scansInPeriod,
          activeQRCodes: await QRCode.countDocuments({ isActive: true })
        },
        mostScanned,
        recentScans,
        deviceStats,
        dailyScans,
        countryStats
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch dashboard statistics',
      error: error.message 
    });
  }
};

// Get analytics for specific QR code
exports.getQRAnalytics = async (req, res) => {
  try {
    const { id } = req.params;
    const { period = '30d' } = req.query;

    const qrCode = await QRCode.findById(id);

    if (!qrCode) {
      return res.status(404).json({ 
        success: false, 
        message: 'QR Code not found' 
      });
    }

    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    
    switch(period) {
      case '24h':
        startDate.setHours(now.getHours() - 24);
        break;
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }

    // Total scans for this QR
    const totalScans = await Scan.countDocuments({ qrCodeId: id });

    // Scans in period
    const scansInPeriod = await Scan.countDocuments({
      qrCodeId: id,
      timestamp: { $gte: startDate }
    });

    // Device breakdown
    const deviceBreakdown = await Scan.aggregate([
      { $match: { qrCodeId: qrCode._id, timestamp: { $gte: startDate } } },
      { $group: { _id: '$deviceType', count: { $sum: 1 } } }
    ]);

    // Hourly distribution
    const hourlyDistribution = await Scan.aggregate([
      { $match: { qrCodeId: qrCode._id, timestamp: { $gte: startDate } } },
      {
        $group: {
          _id: { $hour: '$timestamp' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Daily trend
    const dailyTrend = await Scan.aggregate([
      { $match: { qrCodeId: qrCode._id, timestamp: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Location breakdown
    const locationBreakdown = await Scan.aggregate([
      { $match: { qrCodeId: qrCode._id, timestamp: { $gte: startDate }, country: { $ne: 'unknown' } } },
      { $group: { _id: { country: '$country', city: '$city' }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Browser breakdown
    const browserBreakdown = await Scan.aggregate([
      { $match: { qrCodeId: qrCode._id, timestamp: { $gte: startDate }, browser: { $ne: 'unknown' } } },
      { $group: { _id: '$browser', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        qrCode: {
          id: qrCode._id,
          title: qrCode.title,
          shortId: qrCode.shortId,
          originalUrl: qrCode.originalUrl,
          createdAt: qrCode.createdAt
        },
        stats: {
          totalScans,
          scansInPeriod,
          deviceBreakdown,
          hourlyDistribution,
          dailyTrend,
          locationBreakdown,
          browserBreakdown
        }
      }
    });
  } catch (error) {
    console.error('Error fetching QR analytics:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch QR analytics',
      error: error.message 
    });
  }
};
