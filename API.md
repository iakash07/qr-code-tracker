# API Documentation

Base URL: `http://localhost:5000/api`

## QR Code Endpoints

### Generate QR Code
**POST** `/api/qr/generate`

Create a new QR code with a custom URL.

**Request Body:**
```json
{
  "url": "https://example.com",
  "title": "My Website",
  "description": "Optional description"
}
```

**Response:**
```json
{
  "success": true,
  "message": "QR Code generated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "shortId": "a1b2c3d4",
    "originalUrl": "https://example.com",
    "qrCodeData": "data:image/png;base64,...",
    "title": "My Website",
    "description": "Optional description",
    "scanCount": 0,
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### Get All QR Codes
**GET** `/api/qr/all`

Retrieve all QR codes with pagination and search.

**Query Parameters:**
- `search` (optional): Search by title, URL, or short ID
- `sortBy` (optional): Field to sort by (default: createdAt)
- `order` (optional): Sort order - asc/desc (default: desc)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Example:**
```
GET /api/qr/all?search=example&page=1&limit=10&sortBy=scanCount&order=desc
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "shortId": "a1b2c3d4",
      "originalUrl": "https://example.com",
      "qrCodeData": "data:image/png;base64,...",
      "title": "My Website",
      "scanCount": 42,
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "pages": 10,
    "limit": 10
  }
}
```

---

### Get Single QR Code
**GET** `/api/qr/:id`

Get details of a specific QR code by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "shortId": "a1b2c3d4",
    "originalUrl": "https://example.com",
    "qrCodeData": "data:image/png;base64,...",
    "title": "My Website",
    "description": "Optional description",
    "scanCount": 42,
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### Get QR Code by Short ID
**GET** `/api/qr/short/:shortId`

Get QR code details using the short ID.

**Response:** Same as Get Single QR Code

---

### Update QR Code
**PUT** `/api/qr/:id`

Update QR code details (URL, title, description, status).

**Request Body:**
```json
{
  "url": "https://newurl.com",
  "title": "Updated Title",
  "description": "Updated description",
  "isActive": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "QR Code updated successfully",
  "data": {
    // Updated QR code object
  }
}
```

---

### Delete QR Code
**DELETE** `/api/qr/:id`

Delete a QR code permanently.

**Response:**
```json
{
  "success": true,
  "message": "QR Code deleted successfully"
}
```

---

## Analytics Endpoints

### Get Dashboard Statistics
**GET** `/api/analytics/dashboard`

Get overall dashboard statistics.

**Query Parameters:**
- `period` (optional): Time period - 24h/7d/30d/90d (default: 7d)

**Example:**
```
GET /api/analytics/dashboard?period=30d
```

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalQRCodes": 150,
      "totalScans": 5420,
      "scansInPeriod": 1234,
      "activeQRCodes": 145
    },
    "mostScanned": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "title": "Popular QR",
        "shortId": "a1b2c3d4",
        "scanCount": 500,
        "originalUrl": "https://example.com",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "recentScans": [
      {
        "_id": "507f1f77bcf86cd799439012",
        "qrCodeId": {
          "title": "My QR",
          "shortId": "x1y2z3"
        },
        "timestamp": "2024-01-15T10:30:00.000Z",
        "deviceType": "mobile",
        "country": "US"
      }
    ],
    "deviceStats": [
      { "_id": "mobile", "count": 800 },
      { "_id": "desktop", "count": 400 },
      { "_id": "tablet", "count": 34 }
    ],
    "dailyScans": [
      { "_id": "2024-01-01", "count": 45 },
      { "_id": "2024-01-02", "count": 67 }
    ],
    "countryStats": [
      { "_id": "US", "count": 500 },
      { "_id": "UK", "count": 300 }
    ]
  }
}
```

---

### Get QR Code Analytics
**GET** `/api/analytics/qr/:id`

Get detailed analytics for a specific QR code.

**Query Parameters:**
- `period` (optional): Time period - 24h/7d/30d/90d (default: 30d)

**Example:**
```
GET /api/analytics/qr/507f1f77bcf86cd799439011?period=30d
```

**Response:**
```json
{
  "success": true,
  "data": {
    "qrCode": {
      "id": "507f1f77bcf86cd799439011",
      "title": "My QR Code",
      "shortId": "a1b2c3d4",
      "originalUrl": "https://example.com",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "stats": {
      "totalScans": 500,
      "scansInPeriod": 234,
      "deviceBreakdown": [
        { "_id": "mobile", "count": 300 },
        { "_id": "desktop", "count": 150 },
        { "_id": "tablet", "count": 50 }
      ],
      "hourlyDistribution": [
        { "_id": 0, "count": 5 },
        { "_id": 1, "count": 2 },
        { "_id": 9, "count": 45 }
      ],
      "dailyTrend": [
        { "_id": "2024-01-01", "count": 15 },
        { "_id": "2024-01-02", "count": 23 }
      ],
      "locationBreakdown": [
        {
          "_id": { "country": "US", "city": "New York" },
          "count": 100
        }
      ],
      "browserBreakdown": [
        { "_id": "Chrome", "count": 250 },
        { "_id": "Safari", "count": 150 }
      ]
    }
  }
}
```

---

## Scan Endpoints

### Track Scan (Redirect)
**GET** `/api/scan/:shortId`

This endpoint is called when a QR code is scanned. It tracks the scan and redirects to the destination URL.

**Note:** This is automatically called when someone scans the QR code. You don't need to call this manually.

**Tracked Data:**
- Device type (mobile/tablet/desktop)
- Browser name
- Operating system
- IP address
- Country & city (from IP)
- User agent
- Timestamp

**Behavior:**
1. Validates QR code exists and is active
2. Creates scan record in database
3. Increments scan count
4. Emits real-time update via Socket.io
5. Redirects user to original URL

---

### Get QR Code Scans
**GET** `/api/scan/qr/:id`

Get all scans for a specific QR code.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `startDate` (optional): Filter scans from this date (ISO 8601)
- `endDate` (optional): Filter scans until this date (ISO 8601)

**Example:**
```
GET /api/scan/qr/507f1f77bcf86cd799439011?page=1&limit=20&startDate=2024-01-01
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "qrCodeId": "507f1f77bcf86cd799439011",
      "shortId": "a1b2c3d4",
      "timestamp": "2024-01-15T10:30:00.000Z",
      "deviceType": "mobile",
      "browser": "Chrome",
      "os": "iOS",
      "ipAddress": "192.168.1.1",
      "country": "US",
      "city": "New York",
      "userAgent": "Mozilla/5.0..."
    }
  ],
  "pagination": {
    "total": 500,
    "page": 1,
    "pages": 25,
    "limit": 20
  }
}
```

---

## WebSocket Events

### Connection
Connect to Socket.io server:
```javascript
import io from 'socket.io-client';
const socket = io('http://localhost:5000');
```

### Events

#### scan-update
Emitted when a QR code is scanned.

**Payload:**
```json
{
  "qrCodeId": "507f1f77bcf86cd799439011",
  "shortId": "a1b2c3d4",
  "scanCount": 43,
  "scan": {
    "timestamp": "2024-01-15T10:30:00.000Z",
    "deviceType": "mobile",
    "country": "US",
    "city": "New York"
  }
}
```

**Listen for updates:**
```javascript
socket.on('scan-update', (data) => {
  console.log('New scan detected:', data);
  // Update UI with new scan data
});
```

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (only in development)"
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (invalid input)
- `404` - Not Found
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

---

## Rate Limiting

- **Limit:** 100 requests per 15 minutes per IP
- **Headers:**
  - `X-RateLimit-Limit`: Maximum requests allowed
  - `X-RateLimit-Remaining`: Requests remaining
  - `X-RateLimit-Reset`: Time when limit resets

**Rate Limit Exceeded Response:**
```json
{
  "success": false,
  "message": "Too many requests, please try again later."
}
```

---

## Example Usage

### JavaScript/Node.js
```javascript
const axios = require('axios');

// Generate QR Code
const generateQR = async () => {
  try {
    const response = await axios.post('http://localhost:5000/api/qr/generate', {
      url: 'https://example.com',
      title: 'My Website'
    });
    console.log('QR Code:', response.data.data);
  } catch (error) {
    console.error('Error:', error.response.data);
  }
};

// Get Dashboard Stats
const getStats = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/analytics/dashboard?period=7d');
    console.log('Stats:', response.data.data);
  } catch (error) {
    console.error('Error:', error.response.data);
  }
};
```

### cURL
```bash
# Generate QR Code
curl -X POST http://localhost:5000/api/qr/generate \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com","title":"My Website"}'

# Get All QR Codes
curl http://localhost:5000/api/qr/all?page=1&limit=10

# Get Dashboard Stats
curl http://localhost:5000/api/analytics/dashboard?period=30d

# Update QR Code
curl -X PUT http://localhost:5000/api/qr/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{"url":"https://newurl.com","title":"Updated Title"}'

# Delete QR Code
curl -X DELETE http://localhost:5000/api/qr/507f1f77bcf86cd799439011
```

---

## Postman Collection

Import this JSON into Postman for easy API testing:

```json
{
  "info": {
    "name": "QR Code Tracker API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Generate QR Code",
      "request": {
        "method": "POST",
        "url": "{{baseUrl}}/qr/generate",
        "body": {
          "mode": "raw",
          "raw": "{\"url\":\"https://example.com\",\"title\":\"Test QR\"}"
        }
      }
    },
    {
      "name": "Get All QR Codes",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/qr/all"
      }
    },
    {
      "name": "Get Dashboard Stats",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/analytics/dashboard?period=7d"
      }
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000/api"
    }
  ]
}
```
