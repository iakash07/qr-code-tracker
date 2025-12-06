# ⚡ Quick Start Guide

Get your QR Code Tracker up and running in **5 minutes**!

## 🎯 What You'll Need

- A computer (Windows, Mac, or Linux)
- Internet connection
- 15 minutes of your time

## 📦 Step 1: Install Prerequisites

### Install Node.js

1. Go to [nodejs.org](https://nodejs.org)
2. Download the **LTS version** (recommended)
3. Run the installer
4. Verify installation:
```bash
node --version
npm --version
```

### Install MongoDB

**Option A: MongoDB Atlas (Cloud - Recommended for beginners)**
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for free
3. Create a free cluster
4. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)

**Option B: Local MongoDB**
1. Go to [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Download and install
3. Start MongoDB:
```bash
# Windows
net start MongoDB

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### Install Git

1. Go to [git-scm.com](https://git-scm.com)
2. Download and install
3. Verify:
```bash
git --version
```

## 🚀 Step 2: Get the Code

Open your terminal/command prompt and run:

```bash
# Clone the repository
git clone https://github.com/iakash07/qr-code-tracker.git

# Go into the folder
cd qr-code-tracker
```

## ⚙️ Step 3: Install Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

This might take 2-3 minutes. ☕

## 🔧 Step 4: Configure Environment

```bash
# Copy the example environment file
cp .env.example .env
```

Now edit the `.env` file:

**For MongoDB Atlas (Cloud):**
```env
PORT=5000
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/qr-tracker
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

**For Local MongoDB:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/qr-tracker
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

## ▶️ Step 5: Start the Application

You need **TWO terminal windows**:

**Terminal 1 - Start Backend:**
```bash
npm run server
```

You should see:
```
✅ MongoDB Connected
🚀 Server running on port 5000
```

**Terminal 2 - Start Frontend:**
```bash
npm run client
```

Your browser should automatically open to `http://localhost:3000`

## 🎉 Step 6: Use the Application

### Generate Your First QR Code

1. Click **"Generate"** in the navigation
2. Enter a URL (e.g., `https://google.com`)
3. Add a title (e.g., "My First QR")
4. Click **"Generate QR Code"**
5. Download your QR code!

### Test the Tracking

1. Scan the QR code with your phone
2. Watch the dashboard update in real-time!
3. Check the analytics

## 🐛 Troubleshooting

### "Port 5000 already in use"

**Solution:** Change the port in `.env`:
```env
PORT=5001
```

### "MongoDB connection failed"

**Solution 1:** Check your MongoDB is running
```bash
# Check MongoDB status
mongod --version
```

**Solution 2:** Use MongoDB Atlas (cloud) instead

### "Cannot find module"

**Solution:** Reinstall dependencies
```bash
rm -rf node_modules
npm install
cd client
rm -rf node_modules
npm install
```

### Frontend won't start

**Solution:** Clear cache and reinstall
```bash
cd client
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## 📱 Access from Your Phone

To test QR scanning from your phone:

1. Find your computer's IP address:

**Windows:**
```bash
ipconfig
```
Look for "IPv4 Address"

**Mac/Linux:**
```bash
ifconfig | grep inet
```

2. Update `.env`:
```env
CLIENT_URL=http://YOUR-IP-ADDRESS:3000
```

3. Restart the server

4. On your phone, go to: `http://YOUR-IP-ADDRESS:3000`

## 🎓 Next Steps

### Learn the Features

1. **Dashboard** - View all your analytics
2. **Generate** - Create new QR codes
3. **QR Codes** - Manage all your QR codes
4. **Details** - Click any QR to see detailed analytics

### Customize

- Edit QR code URLs without regenerating
- Add descriptions to organize your QR codes
- Filter and search your QR codes
- Download QR codes as PNG

### Deploy to Production

Ready to go live? Check out [DEPLOYMENT.md](DEPLOYMENT.md) for:
- Heroku deployment (easiest)
- Vercel + Railway (recommended)
- DigitalOcean (full control)

## 💡 Tips

1. **Keep both terminals running** - You need backend AND frontend
2. **Use MongoDB Atlas** - Easier than local MongoDB
3. **Test on your phone** - Best way to test QR scanning
4. **Check the console** - Errors will show there
5. **Read the docs** - [API.md](API.md) has all endpoints

## 🆘 Still Stuck?

1. Check the [FEATURES.md](FEATURES.md) for what's possible
2. Read the [API.md](API.md) for API details
3. See [DEPLOYMENT.md](DEPLOYMENT.md) for production setup
4. Open an issue on GitHub

## ✅ Checklist

- [ ] Node.js installed
- [ ] MongoDB running (local or Atlas)
- [ ] Git installed
- [ ] Code cloned
- [ ] Dependencies installed
- [ ] .env configured
- [ ] Backend running (Terminal 1)
- [ ] Frontend running (Terminal 2)
- [ ] Browser opened to localhost:3000
- [ ] First QR code generated
- [ ] QR code scanned and tracked

## 🎊 Success!

If you can see the dashboard and generate QR codes, you're all set! 

**What you've built:**
- ✅ Full-stack MERN application
- ✅ Real-time WebSocket updates
- ✅ MongoDB database
- ✅ RESTful API
- ✅ React frontend
- ✅ QR code generation
- ✅ Analytics tracking

**Time to celebrate!** 🎉

---

**Need help?** Open an issue on GitHub or check the documentation.

**Ready for production?** See [DEPLOYMENT.md](DEPLOYMENT.md)

**Want to contribute?** PRs are welcome!
