const QRCode = require('../models/QRCode');
const qrcode = require('qrcode');
const crypto = require('crypto');

// Generate unique short ID
const generateShortId = () => {
  return crypto.randomBytes(4).toString('hex');
};

// Generate QR Code
exports.generateQR = async (req, res) => {
  try {
    const { url, title, description } = req.body;

    if (!url) {
      return res.status(400).json({ 
        success: false, 
        message: 'URL is required' 
      });
    }

    // Validate URL
    try {
      new URL(url);
    } catch (error) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid URL format' 
      });
    }

    const shortId = generateShortId();
    const scanUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/s/${shortId}`;

    // Generate QR code as data URL
    const qrCodeData = await qrcode.toDataURL(scanUrl, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      width: 300,
      margin: 2
    });

    const newQR = new QRCode({
      shortId,
      originalUrl: url,
      qrCodeData,
      title: title || 'Untitled QR Code',
      description: description || ''
    });

    await newQR.save();

    res.status(201).json({
      success: true,
      message: 'QR Code generated successfully',
      data: newQR
    });
  } catch (error) {
    console.error('Error generating QR:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to generate QR code',
      error: error.message 
    });
  }
};

// Get all QR codes
exports.getAllQRCodes = async (req, res) => {
  try {
    const { search, sortBy = 'createdAt', order = 'desc', page = 1, limit = 10 } = req.query;

    const query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { originalUrl: { $regex: search, $options: 'i' } },
        { shortId: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    const sortOrder = order === 'asc' ? 1 : -1;

    const qrCodes = await QRCode.find(query)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await QRCode.countDocuments(query);

    res.json({
      success: true,
      data: qrCodes,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching QR codes:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch QR codes',
      error: error.message 
    });
  }
};

// Get single QR code
exports.getQRCode = async (req, res) => {
  try {
    const qrCode = await QRCode.findById(req.params.id);

    if (!qrCode) {
      return res.status(404).json({ 
        success: false, 
        message: 'QR Code not found' 
      });
    }

    res.json({
      success: true,
      data: qrCode
    });
  } catch (error) {
    console.error('Error fetching QR code:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch QR code',
      error: error.message 
    });
  }
};

// Update QR code URL
exports.updateQRCode = async (req, res) => {
  try {
    const { url, title, description, isActive } = req.body;

    const qrCode = await QRCode.findById(req.params.id);

    if (!qrCode) {
      return res.status(404).json({ 
        success: false, 
        message: 'QR Code not found' 
      });
    }

    // Validate URL if provided
    if (url) {
      try {
        new URL(url);
        qrCode.originalUrl = url;
      } catch (error) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid URL format' 
        });
      }
    }

    if (title !== undefined) qrCode.title = title;
    if (description !== undefined) qrCode.description = description;
    if (isActive !== undefined) qrCode.isActive = isActive;

    await qrCode.save();

    res.json({
      success: true,
      message: 'QR Code updated successfully',
      data: qrCode
    });
  } catch (error) {
    console.error('Error updating QR code:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update QR code',
      error: error.message 
    });
  }
};

// Delete QR code
exports.deleteQRCode = async (req, res) => {
  try {
    const qrCode = await QRCode.findByIdAndDelete(req.params.id);

    if (!qrCode) {
      return res.status(404).json({ 
        success: false, 
        message: 'QR Code not found' 
      });
    }

    res.json({
      success: true,
      message: 'QR Code deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting QR code:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete QR code',
      error: error.message 
    });
  }
};

// Get QR code by short ID
exports.getQRByShortId = async (req, res) => {
  try {
    const qrCode = await QRCode.findOne({ shortId: req.params.shortId });

    if (!qrCode) {
      return res.status(404).json({ 
        success: false, 
        message: 'QR Code not found' 
      });
    }

    res.json({
      success: true,
      data: qrCode
    });
  } catch (error) {
    console.error('Error fetching QR code:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch QR code',
      error: error.message 
    });
  }
};
