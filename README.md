# 🎯 QR Code Generator & Tracking System

A complete **MERN stack** application for generating, managing, and tracking QR codes with **real-time analytics**. Perfect for businesses, marketers, and developers who need powerful QR code management with detailed insights.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)
![MongoDB](https://img.shields.io/badge/mongodb-%3E%3D4.0-green.svg)

## 🌟 Live Demo

**Repository:** [https://github.com/iakash07/qr-code-tracker](https://github.com/iakash07/qr-code-tracker)

## ✨ Key Features

### 🎨 QR Code Generator
- ✅ Generate QR codes from any URL instantly
- ✅ Custom titles and descriptions
- ✅ Download as PNG/SVG
- ✅ Edit destination URL without regenerating QR
- ✅ Unique short URLs for each QR code

### 📊 Advanced Analytics Dashboard
- ✅ **Real-time scan tracking** with WebSocket updates
- ✅ Total scans, QR codes, and active codes
- ✅ Daily/weekly/monthly scan trends
- ✅ Device breakdown (mobile/tablet/desktop)
- ✅ Geographic tracking (country & city)
- ✅ Browser and OS detection
- ✅ Most scanned QR codes ranking

### 🔍 QR Code Management
- ✅ View all QR codes in organized table
- ✅ Search by title, URL, or short ID
- ✅ Sort and filter options
- ✅ Individual QR analytics
- ✅ Edit, delete, activate/deactivate
- ✅ Bulk operations support

### 📈 Individual QR Analytics
- ✅ Scan count and trends
- ✅ Hourly distribution patterns
- ✅ Device and browser breakdown
- ✅ Top scanning locations
- ✅ Time period filters (7d/30d/90d)

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI framework
- **React Router** - Navigation
- **Chart.js** - Data visualization
- **Socket.io Client** - Real-time updates
- **Axios** - HTTP client
- **React Toastify** - Notifications

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Socket.io** - WebSocket server
- **QRCode** - QR generation library
- **UAParser** - User agent parsing
- **GeoIP-Lite** - IP geolocation

## 🚀 Quick Start

### Prerequisites
- Node.js v14 or higher
- MongoDB (local or Atlas)
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/iakash07/qr-code-tracker.git
cd qr-code-tracker
```

2. **Install dependencies**
```bash
# Install server dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

3. **Configure environment**
```bash
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/qr-tracker
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

4. **Start MongoDB**
```bash
mongod
```

5. **Run the application**

**Development mode (recommended):**
```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend  
npm run client
```

**Production mode:**
```bash
npm run build
npm start
```

6. **Access the app**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📖 Documentation

- **[API Documentation](API.md)** - Complete API reference
- **[Deployment Guide](DEPLOYMENT.md)** - Deploy to Heroku, Vercel, Railway, DigitalOcean
- **[Features List](FEATURES.md)** - Detailed feature breakdown

## 🎯 How It Works

1. **Generate QR Code**
   - Enter any URL
   - Add optional title and description
   - Get instant QR code with unique short URL

2. **Share QR Code**
   - Download as PNG
   - Share short URL
   - Print for physical use

3. **Track Scans**
   - When someone scans the QR code
   - System logs device, location, time
   - Redirects to destination URL
   - Updates analytics in real-time

4. **View Analytics**
   - Dashboard shows overall stats
   - Individual QR analytics available
   - Filter by time periods
   - Export data (coming soon)

## 📁 Project Structure

```
qr-code-tracker/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API & Socket services
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── server/                # Node.js backend
│   ├── models/           # MongoDB models
│   │   ├── QRCode.js
│   │   └── Scan.js
│   ├── routes/           # API routes
│   │   ├── qrRoutes.js
│   │   ├── scanRoutes.js
│   │   └── analyticsRoutes.js
│   ├── controllers/      # Route controllers
│   │   ├── qrController.js
│   │   ├── scanController.js
│   │   └── analyticsController.js
│   └── index.js          # Server entry
├── .env.example
├── package.json
├── README.md
├── API.md
├── DEPLOYMENT.md
└── FEATURES.md
```

## 🔌 API Endpoints

### QR Codes
- `POST /api/qr/generate` - Generate new QR code
- `GET /api/qr/all` - Get all QR codes
- `GET /api/qr/:id` - Get specific QR code
- `PUT /api/qr/:id` - Update QR code
- `DELETE /api/qr/:id` - Delete QR code

### Analytics
- `GET /api/analytics/dashboard` - Dashboard statistics
- `GET /api/analytics/qr/:id` - QR-specific analytics

### Scans
- `GET /api/scan/:shortId` - Track scan & redirect
- `GET /api/scan/qr/:id` - Get QR scan history

See [API.md](API.md) for complete documentation.

## 🎨 Screenshots

### Dashboard
Beautiful analytics dashboard with real-time updates, charts, and statistics.

### QR Generator
Simple interface to create QR codes with custom URLs and metadata.

### QR Management
Organized table view with search, sort, and filter capabilities.

### Individual Analytics
Detailed insights for each QR code with multiple visualization options.

## 🔒 Security Features

- ✅ Rate limiting (100 requests/15min)
- ✅ Helmet security headers
- ✅ CORS protection
- ✅ Input validation
- ✅ MongoDB injection prevention
- ✅ XSS protection

## 📱 Responsive Design

Fully responsive design that works perfectly on:
- 📱 Mobile devices
- 📱 Tablets
- 💻 Desktops
- 🖥️ Large screens

## 🚀 Deployment

Deploy to your favorite platform:

- **Heroku** - One-click deployment
- **Vercel** (Frontend) + **Railway** (Backend)
- **DigitalOcean** - Full control
- **AWS/GCP/Azure** - Enterprise scale

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed guides.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- QRCode.js for QR generation
- Chart.js for beautiful charts
- Socket.io for real-time features
- MongoDB for reliable data storage
- React community for amazing tools

## 📧 Contact

**GitHub:** [@iakash07](https://github.com/iakash07)

**Project Link:** [https://github.com/iakash07/qr-code-tracker](https://github.com/iakash07/qr-code-tracker)

---

⭐ **Star this repo** if you find it helpful!

Built with ❤️ using MERN Stack
