# QR Code Generator & Tracking System

A complete MERN stack application for generating, managing, and tracking QR codes with real-time analytics.

## Features

### QR Code Generator
- ✅ Create QR codes with custom URLs
- ✅ Edit/update destination URL anytime
- ✅ Download QR code as PNG/SVG
- ✅ Bulk QR code generation

### QR Code Management
- ✅ View all generated QR codes in a table
- ✅ Edit QR link without regenerating
- ✅ Delete QR codes
- ✅ Search & filter QR codes
- ✅ Individual QR statistics

### Scan Tracking System
- ✅ Real-time scan count updates
- ✅ Track scan date/time
- ✅ Track device type (mobile/desktop/tablet)
- ✅ Track approximate location (IP-based)
- ✅ WebSocket for live updates

### Dashboard
- ✅ Total QR codes generated
- ✅ Total scans across all QR codes
- ✅ Daily/weekly/monthly scan charts
- ✅ Most scanned QR codes
- ✅ Recent activity feed

## Tech Stack

- **Frontend**: React.js, Chart.js, Socket.io-client
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Real-time**: Socket.io
- **QR Generation**: qrcode library

## Installation

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)

### Setup

1. Clone the repository:
```bash
git clone https://github.com/iakash07/qr-code-tracker.git
cd qr-code-tracker
```

2. Install dependencies:
```bash
npm run install-all
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your MongoDB URI
```

4. Start MongoDB (if local):
```bash
mongod
```

5. Run the application:

**Development mode:**
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

## Usage

1. **Generate QR Code**: Enter a URL and click "Generate"
2. **Download**: Click download button for PNG/SVG
3. **Edit Link**: Click edit icon to change destination URL
4. **Track Scans**: View real-time analytics on dashboard
5. **Scan QR**: When scanned, redirects to URL and logs analytics

## API Endpoints

### QR Codes
- `POST /api/qr/generate` - Generate new QR code
- `GET /api/qr/all` - Get all QR codes
- `GET /api/qr/:id` - Get specific QR code
- `PUT /api/qr/:id` - Update QR code URL
- `DELETE /api/qr/:id` - Delete QR code

### Analytics
- `GET /api/analytics/dashboard` - Dashboard stats
- `GET /api/analytics/qr/:id` - QR-specific analytics
- `POST /api/scan/:shortId` - Track scan (auto-called on QR scan)

## Project Structure

```
qr-code-tracker/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── App.js
│   └── package.json
├── server/                # Node.js backend
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   └── index.js          # Server entry
├── .env.example
├── package.json
└── README.md
```

## License

MIT
