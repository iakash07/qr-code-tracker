const QRCode = require('../models/QRCode');
const Scan = require('../models/Scan');
const UAParser = require('ua-parser-js');
const geoip = require('geoip-lite');

// Track scan and redirect
exports.trackScan = async (req, res) => {
  try {
    const { shortId } = req.params;

    const qrCode = await QRCode.findOne({ shortId });

    if (!qrCode) {
      return res.status(404).send('QR Code not found');
    }

    if (!qrCode.isActive) {
      return res.status(403).send('This QR Code has been deactivated');
    }

    // Parse user agent
    const parser = new UAParser(req.headers['user-agent']);
    const result = parser.getResult();

    // Get IP address
    const ipAddress = req.headers['x-forwarded-for']?.split(',')[0] || 
                     req.connection.remoteAddress || 
                     req.socket.remoteAddress || 
                     'unknown';

    // Get geolocation from IP
    const geo = geoip.lookup(ipAddress);

    // Determine device type
    let deviceType = 'unknown';
    if (result.device.type === 'mobile') deviceType = 'mobile';
    else if (result.device.type === 'tablet') deviceType = 'tablet';
    else if (result.device.type === undefined) deviceType = 'desktop';

    // Create scan record
    const scan = new Scan({
      qrCodeId: qrCode._id,
      shortId,
      deviceType,
      browser: result.browser.name || 'unknown',
      os: result.os.name || 'unknown',
      ipAddress: ipAddress.replace('::ffff:', ''),
      country: geo?.country || 'unknown',
      city: geo?.city || 'unknown',
      userAgent: req.headers['user-agent'] || ''
    });

    await scan.save();

    // Increment scan count
    qrCode.scanCount += 1;
    await qrCode.save();

    // Emit real-time update via Socket.io
    const io = req.app.get('io');
    io.emit('scan-update', {
      qrCodeId: qrCode._id,
      shortId,
      scanCount: qrCode.scanCount,
      scan: {
        timestamp: scan.timestamp,
        deviceType: scan.deviceType,
        country: scan.country,
        city: scan.city
      }
    });

    // Redirect to original URL
    res.redirect(qrCode.originalUrl);
  } catch (error) {
    console.error('Error tracking scan:', error);
    res.status(500).send('Error processing scan');
  }
};

// Get scans for a specific QR code
exports.getQRScans = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20, startDate, endDate } = req.query;

    const query = { qrCodeId: id };

    // Date filtering
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;

    const scans = await Scan.find(query)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Scan.countDocuments(query);

    res.json({
      success: true,
      data: scans,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching scans:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch scans',
      error: error.message 
    });
  }
};
