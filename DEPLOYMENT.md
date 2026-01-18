# 🚀 MeatBooking - GitHub & Deployment Guide

## 📤 Push to GitHub

### Step 1: Create GitHub Repository
1. Go to https://github.com/new
2. Create repository name: `meatbooking`
3. Add description: "Full-stack meat booking application"
4. Choose Public or Private
5. Click "Create repository"

### Step 2: Add Remote and Push

```bash
cd C:\Users\skyad\OneDrive\Desktop\MeatBooking

# Add remote repository
git remote add origin https://github.com/yourusername/meatbooking.git

# Rename branch to main (optional)
git branch -M main

# Push to GitHub
git push -u origin main
```

### Step 3: Verify Push
- Go to your GitHub repository
- Should see all files and commit history

---

## 🌐 Deploy Backend

### Option 1: Render (Recommended)
1. Sign up at https://render.com
2. Click "New +"  → "Web Service"
3. Connect your GitHub repository
4. Configuration:
   - **Name:** meatbooking-api
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node index.js`
5. Add Environment Variables:
   - `MONGO_URI` - MongoDB Atlas connection string
   - `JWT_SECRET` - Strong random string
   - `RAZORPAY_KEY_ID` - From Razorpay dashboard
   - `RAZORPAY_KEY_SECRET` - From Razorpay dashboard
   - `NODE_ENV` - production
6. Deploy

### Option 2: Heroku
```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create meatbooking-api

# Set environment variables
heroku config:set MONGO_URI=your_mongodb_url
heroku config:set JWT_SECRET=your_secret
# ... add other variables

# Deploy
git push heroku main
```

### Option 3: Railway
1. Go to https://railway.app
2. Connect GitHub
3. Select repository
4. Add environment variables
5. Deploy

---

## 🎨 Deploy Frontend

### Option 1: Vercel (Recommended)
1. Sign up at https://vercel.com
2. Import from Git
3. Select your repository
4. Configuration:
   - **Framework:** Create React App
   - **Root Directory:** ./client
5. Add Environment Variables:
   - `REACT_APP_API_URL` - Your backend URL (e.g., https://meatbooking-api.onrender.com/api)
   - `REACT_APP_RAZORPAY_KEY_ID` - Your Razorpay key
6. Deploy

### Option 2: Netlify
1. Go to https://netlify.com
2. Connect Git repository
3. Configuration:
   - **Build Command:** `cd client && npm run build`
   - **Publish Directory:** `client/build`
4. Add Environment Variables:
   - `REACT_APP_API_URL` - Backend URL
   - `REACT_APP_RAZORPAY_KEY_ID` - Razorpay key
5. Deploy

### Option 3: GitHub Pages
```bash
# Install gh-pages
cd client
npm install --save-dev gh-pages

# Add to package.json
"homepage": "https://yourusername.github.io/meatbooking"

# Deploy
npm run build
npm run deploy
```

---

## 💾 MongoDB Setup

### Option 1: MongoDB Atlas (Cloud - Recommended)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create account
3. Create cluster
4. Set up IP whitelist (0.0.0.0/0 for testing)
5. Create database user
6. Get connection string
7. Update `MONGO_URI` in backend

### Option 2: Local MongoDB
- Already have: C:\Program Files\MongoDB\Server\8.2
- Connection string: `mongodb://localhost:27017/meatbooking`

---

## 💳 Razorpay Setup

1. Go to https://razorpay.com
2. Create account
3. Go to Settings → API Keys
4. Copy:
   - `Key ID` → `RAZORPAY_KEY_ID`
   - `Key Secret` → `RAZORPAY_KEY_SECRET`
5. Use Test Keys for development
6. Switch to Live Keys for production

---

## 🔗 Environment Variables Summary

### Backend (.env)
```env
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/meatbooking
JWT_SECRET=your-super-secret-key-minimum-32-characters
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
PORT=5000
NODE_ENV=production
```

### Frontend (.env.local)
```env
REACT_APP_API_URL=https://your-backend-url.onrender.com/api
REACT_APP_RAZORPAY_KEY_ID=rzp_live_xxxxx
```

---

## 🧪 Post-Deployment Testing

### 1. Test Backend
```bash
# Test health
curl https://your-backend-url.onrender.com

# Test registration
curl -X POST https://your-backend-url.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"password123"}'

# Test login
curl -X POST https://your-backend-url.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### 2. Test Frontend
- Visit https://your-frontend-url
- Register a test account
- Create an order
- Verify analytics show the order

### 3. Test Payment
- Use Razorpay test card: 4111 1111 1111 1111
- Expiry: Any future date
- CVV: Any 3 digits
- OTP: 000000

---

## 📊 Monitoring & Maintenance

### Setup Error Tracking
1. Sign up at https://sentry.io
2. Create project
3. Add to backend:
```javascript
const Sentry = require("@sentry/node");
Sentry.init({ dsn: "your_sentry_dsn" });
```

### Monitor Database
- MongoDB Atlas: Dashboard shows metrics
- Render: Metrics tab for API usage

### Check Logs
- **Render:** Logs tab
- **Vercel:** Analytics tab
- **Netlify:** Logs tab

---

## 🔄 Continuous Deployment

Both Render and Vercel auto-deploy when you push to main:
```bash
# Push updates
git add .
git commit -m "Feature: new functionality"
git push origin main

# Auto-deployed to production!
```

---

## ⚠️ Production Checklist

- ✅ Environment variables configured
- ✅ Database connection secure
- ✅ HTTPS enabled
- ✅ Error tracking setup
- ✅ Backend API tested
- ✅ Frontend tested
- ✅ Payment keys in production mode
- ✅ Domain configured
- ✅ Analytics enabled
- ✅ Backups configured

---

## 🆘 Troubleshooting

### Backend won't start
```bash
# Check logs
heroku logs --tail
# or
vercel logs

# Check environment variables
heroku config
```

### Database connection error
- Verify MONGO_URI is correct
- Check MongoDB Atlas IP whitelist
- Ensure database is running

### Frontend not connecting
- Check REACT_APP_API_URL environment variable
- Verify backend is running
- Check browser console for errors
- CORS should be configured in backend

### Payment verification failing
- Verify Razorpay keys are correct
- Check Key Secret is not exposed in frontend
- Ensure payment signature verification is implemented

---

## 📞 Support Resources

- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- MongoDB Docs: https://docs.mongodb.com
- Express Docs: https://expressjs.com
- React Docs: https://react.dev
- Razorpay Docs: https://razorpay.com/docs

---

## 📝 Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes
git add .
git commit -m "Add new feature"

# Push to GitHub
git push origin feature/new-feature

# Create Pull Request on GitHub
# After review and approval, merge to main

# Main branch auto-deploys to production
```

---

**Last Updated:** January 18, 2026  
**Status:** Ready for Deployment  
**Next Step:** Create GitHub repository and push code
