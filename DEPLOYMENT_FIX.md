# 🔧 Deployment Fix Guide

## Issue Fixed
The build was failing because `react-scripts` wasn't found during deployment.

## What Was Changed

### 1. Updated `package.json`
- ✅ Added `heroku-postbuild` script to install client dependencies
- ✅ Updated `build` script to install deps before building
- ✅ Added Node.js engine requirements

### 2. Updated `server/index.js`
- ✅ Added production static file serving
- ✅ Added React routing handler for production
- ✅ Added environment logging

### 3. Added Configuration Files
- ✅ `Procfile` - Tells Heroku how to start the app
- ✅ `.npmrc` - Handles dependency conflicts

## How to Deploy Now

### Option 1: Heroku (Recommended)

```bash
# 1. Install Heroku CLI
npm install -g heroku

# 2. Login
heroku login

# 3. Create app
heroku create your-app-name

# 4. Add MongoDB
heroku addons:create mongolab:sandbox

# 5. Set environment variables
heroku config:set NODE_ENV=production
heroku config:set CLIENT_URL=https://your-app-name.herokuapp.com

# 6. Deploy
git push heroku main

# 7. Open app
heroku open
```

### Option 2: Railway

1. Go to [Railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose `iakash07/qr-code-tracker`
5. Add MongoDB from Railway marketplace
6. Set environment variables:
   - `NODE_ENV`: production
   - `PORT`: 5000
   - `MONGODB_URI`: (auto-set by Railway)
   - `CLIENT_URL`: (your Railway URL)
7. Deploy!

### Option 3: Render

1. Go to [Render.com](https://render.com)
2. New → Web Service
3. Connect GitHub repo: `iakash07/qr-code-tracker`
4. Settings:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. Add MongoDB (Render MongoDB or Atlas)
6. Environment variables:
   - `NODE_ENV`: production
   - `MONGODB_URI`: your MongoDB connection string
   - `CLIENT_URL`: your Render URL
7. Deploy!

### Option 4: Vercel (Frontend) + Railway (Backend)

**Backend on Railway:**
1. Deploy backend as described in Option 2
2. Note the Railway URL

**Frontend on Vercel:**
1. Go to [Vercel.com](https://vercel.com)
2. Import `iakash07/qr-code-tracker`
3. Root Directory: `client`
4. Environment Variables:
   - `REACT_APP_API_URL`: https://your-railway-url/api
   - `REACT_APP_SOCKET_URL`: https://your-railway-url
5. Deploy!

## Environment Variables Required

### For All Platforms
```env
NODE_ENV=production
MONGODB_URI=your-mongodb-connection-string
CLIENT_URL=your-deployed-frontend-url
PORT=5000
```

### For Separate Frontend/Backend
**Backend:**
```env
NODE_ENV=production
MONGODB_URI=your-mongodb-uri
CLIENT_URL=your-vercel-url
PORT=5000
```

**Frontend:**
```env
REACT_APP_API_URL=your-backend-url/api
REACT_APP_SOCKET_URL=your-backend-url
```

## MongoDB Setup

### Option A: MongoDB Atlas (Recommended)
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Create database user
4. Whitelist all IPs (0.0.0.0/0) for deployment
5. Get connection string
6. Replace `<password>` with your password
7. Use in `MONGODB_URI`

### Option B: Railway MongoDB
1. In Railway project
2. Click "New"
3. Select "Database" → "MongoDB"
4. Copy connection string
5. Use in `MONGODB_URI`

## Troubleshooting

### Build Still Failing?

**Check Node Version:**
```bash
# Your platform should use Node 14+
# Add to package.json if needed:
"engines": {
  "node": ">=14.0.0",
  "npm": ">=6.0.0"
}
```

**Clear Build Cache:**
- Heroku: `heroku repo:purge_cache -a your-app-name`
- Railway: Redeploy from scratch
- Render: Clear build cache in settings

### MongoDB Connection Issues?

**Check:**
1. ✅ Connection string is correct
2. ✅ Password doesn't have special characters (or URL encode them)
3. ✅ IP whitelist includes 0.0.0.0/0
4. ✅ Database user has read/write permissions

### CORS Errors?

Update `CLIENT_URL` to match your frontend URL:
```bash
# Heroku
heroku config:set CLIENT_URL=https://your-app.herokuapp.com

# Railway
# Set in Railway dashboard environment variables
```

### React Routes Not Working?

The server is now configured to handle React routing in production. Make sure:
1. ✅ `NODE_ENV=production` is set
2. ✅ Build completed successfully
3. ✅ Server is serving static files

## Verify Deployment

After deployment, test:

1. **Homepage loads**: Visit your URL
2. **API works**: Visit `your-url/health`
3. **Generate QR**: Create a test QR code
4. **Scan tracking**: Scan QR and check analytics
5. **Real-time updates**: Open dashboard in two tabs, scan QR

## Quick Deploy Commands

### Heroku
```bash
git add .
git commit -m "Deploy to Heroku"
git push heroku main
heroku logs --tail
```

### Railway
```bash
git add .
git commit -m "Deploy to Railway"
git push origin main
# Railway auto-deploys from GitHub
```

### Render
```bash
git add .
git commit -m "Deploy to Render"
git push origin main
# Render auto-deploys from GitHub
```

## Success Checklist

- [ ] Code pushed to GitHub
- [ ] Platform connected to repo
- [ ] MongoDB configured
- [ ] Environment variables set
- [ ] Build completed successfully
- [ ] App is accessible
- [ ] Health check returns OK
- [ ] Can generate QR codes
- [ ] Scan tracking works
- [ ] Dashboard shows data

## Still Having Issues?

1. Check deployment logs
2. Verify all environment variables
3. Test MongoDB connection separately
4. Check Node.js version compatibility
5. Clear build cache and redeploy

## Need Help?

Open an issue on GitHub with:
- Platform you're deploying to
- Full error message
- Environment variables (without sensitive data)
- Build logs
