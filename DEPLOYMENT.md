# Deployment Guide

## Local Development

### Prerequisites
- Node.js v14+ installed
- MongoDB installed (local or Atlas)
- Git installed

### Steps

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

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/qr-tracker
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

4. **Start MongoDB** (if using local MongoDB)
```bash
mongod
```

5. **Run the application**

**Option 1: Development mode (recommended)**
```bash
# Terminal 1 - Start backend
npm run server

# Terminal 2 - Start frontend
npm run client
```

**Option 2: Production build**
```bash
cd client
npm run build
cd ..
npm start
```

6. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

---

## Production Deployment

### Option 1: Deploy to Heroku

1. **Install Heroku CLI**
```bash
npm install -g heroku
```

2. **Login to Heroku**
```bash
heroku login
```

3. **Create Heroku app**
```bash
heroku create qr-tracker-app
```

4. **Add MongoDB Atlas**
```bash
heroku addons:create mongolab:sandbox
```

5. **Set environment variables**
```bash
heroku config:set NODE_ENV=production
heroku config:set CLIENT_URL=https://qr-tracker-app.herokuapp.com
```

6. **Deploy**
```bash
git push heroku main
```

7. **Open app**
```bash
heroku open
```

---

### Option 2: Deploy to Vercel (Frontend) + Railway (Backend)

#### Backend on Railway

1. Go to [Railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Add MongoDB database from Railway marketplace
5. Set environment variables:
   - `PORT`: 5000
   - `MONGODB_URI`: (auto-set by Railway)
   - `NODE_ENV`: production
   - `CLIENT_URL`: (your Vercel URL)
6. Deploy!

#### Frontend on Vercel

1. Go to [Vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Set root directory to `client`
4. Add environment variable:
   - `REACT_APP_API_URL`: (your Railway backend URL)
   - `REACT_APP_SOCKET_URL`: (your Railway backend URL)
5. Deploy!

---

### Option 3: Deploy to DigitalOcean

1. **Create a Droplet**
   - Ubuntu 22.04 LTS
   - At least 1GB RAM

2. **SSH into droplet**
```bash
ssh root@your-droplet-ip
```

3. **Install Node.js**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

4. **Install MongoDB**
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

5. **Clone and setup**
```bash
git clone https://github.com/iakash07/qr-code-tracker.git
cd qr-code-tracker
npm install
cd client && npm install && npm run build && cd ..
```

6. **Configure environment**
```bash
nano .env
```

7. **Install PM2**
```bash
sudo npm install -g pm2
```

8. **Start application**
```bash
pm2 start server/index.js --name qr-tracker
pm2 save
pm2 startup
```

9. **Setup Nginx**
```bash
sudo apt-get install nginx
sudo nano /etc/nginx/sites-available/qr-tracker
```

Add configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/qr-tracker /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

10. **Setup SSL with Let's Encrypt**
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## Environment Variables Reference

### Backend (.env)
```env
PORT=5000                                    # Server port
MONGODB_URI=mongodb://localhost:27017/qr-tracker  # MongoDB connection string
NODE_ENV=development                         # Environment (development/production)
CLIENT_URL=http://localhost:3000            # Frontend URL for CORS
```

### Frontend (client/.env)
```env
REACT_APP_API_URL=http://localhost:5000/api      # Backend API URL
REACT_APP_SOCKET_URL=http://localhost:5000       # Socket.io server URL
```

---

## Troubleshooting

### MongoDB Connection Issues
```bash
# Check MongoDB status
sudo systemctl status mongod

# Restart MongoDB
sudo systemctl restart mongod

# Check MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log
```

### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000

# Kill process
kill -9 <PID>
```

### Build Errors
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## Performance Optimization

1. **Enable compression**
```bash
npm install compression
```

Add to server/index.js:
```javascript
const compression = require('compression');
app.use(compression());
```

2. **Add caching headers**
3. **Use CDN for static assets**
4. **Enable MongoDB indexes** (already configured in models)
5. **Use PM2 cluster mode**
```bash
pm2 start server/index.js -i max
```

---

## Monitoring

### PM2 Monitoring
```bash
pm2 monit
pm2 logs
pm2 status
```

### MongoDB Monitoring
```bash
mongo
use qr-tracker
db.stats()
db.qrcodes.stats()
```

---

## Backup

### MongoDB Backup
```bash
mongodump --db qr-tracker --out /backup/$(date +%Y%m%d)
```

### Restore
```bash
mongorestore --db qr-tracker /backup/20240101/qr-tracker
```
