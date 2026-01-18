# MeatBooking - Setup & Deployment Guide

## 📋 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Razorpay account

### 1️⃣ Backend Setup

```bash
# Navigate to server
cd server

# Install dependencies
npm install

# Create .env file (copy from .env.example and fill in values)
cp .env.example .env

# Start MongoDB
mongod --dbpath C:\data\db  # Windows
# OR
mongod --dbpath ~/data/db   # Mac/Linux

# Start server
node index.js
# Server running on http://localhost:5000
```

### 2️⃣ Frontend Setup

```bash
# Navigate to client (in new terminal)
cd client

# Install dependencies
npm install

# Create .env.local file
cp .env.local.example .env.local

# Start React app
npm start
# App running on http://localhost:3000
```

---

## 🔑 Getting API Keys

### Razorpay Keys
1. Go to https://dashboard.razorpay.com
2. Sign up / Login
3. Navigate to Settings → API Keys
4. Copy **Key ID** and **Key Secret**
5. Paste into `.env` file (test keys for development)

### MongoDB URI
- **Local:** `mongodb://localhost:27017/meatbooking`
- **Atlas:** Get connection string from MongoDB Cloud Dashboard

---

## 🚀 Deployment

### Environment Variables for Production

**Backend (.env):**
```env
MONGO_URI=<production_mongodb_uri>
JWT_SECRET=<long_random_secret_key>
RAZORPAY_KEY_ID=rzp_live_key
RAZORPAY_KEY_SECRET=rzp_live_secret
PORT=5000
NODE_ENV=production
```

**Frontend (.env.production):**
```env
REACT_APP_API_URL=https://yourdomain.com/api
REACT_APP_RAZORPAY_KEY_ID=rzp_live_key
REACT_APP_ENV=production
```

### Deploy to Heroku (Backend)

```bash
# Create Heroku app
heroku create your-meatbooking-app

# Set environment variables
heroku config:set MONGO_URI=<uri>
heroku config:set JWT_SECRET=<secret>
heroku config:set RAZORPAY_KEY_ID=<key>
heroku config:set RAZORPAY_KEY_SECRET=<secret>

# Deploy
git push heroku main
```

### Deploy to Vercel (Frontend)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# REACT_APP_API_URL = https://your-backend.herokuapp.com
```

---

## 🔒 Security Checklist

- [ ] Change JWT_SECRET to strong random string
- [ ] Use HTTPS in production
- [ ] Set CORS to specific domain (not *)
- [ ] Add rate limiting
- [ ] Validate all inputs
- [ ] Hash passwords (already implemented)
- [ ] Store secrets in environment variables
- [ ] Add request logging
- [ ] Enable HTTPS only cookies
- [ ] Add CSRF protection if needed

---

## 📊 Database Schema

### Users Collection
```json
{
  "_id": ObjectId,
  "name": String,
  "email": String (unique),
  "password": String (hashed),
  "isAdmin": Boolean (default: false),
  "createdAt": Date
}
```

### Orders Collection
```json
{
  "_id": ObjectId,
  "user": ObjectId (ref: User),
  "meatType": String,
  "weight": Number,
  "quantity": Number,
  "amount": Number (in paise),
  "paymentId": String,
  "status": String (pending, paid, processing, delivered, cancelled),
  "createdAt": Date
}
```

---

## 🧪 Testing

### Create Admin User

In MongoDB shell:
```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { isAdmin: true } }
)
```

### Test Payment
Use Razorpay test card:
- Card: 4111111111111111
- Expiry: Any future date
- CVV: Any 3 digits

---

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check MONGO_URI in .env
- Verify database exists

### CORS Error
- Check that backend CORS is enabled
- Verify frontend API URL matches backend

### Payment Not Working
- Verify Razorpay keys are correct
- Use test keys for development
- Check browser console for errors

### Token Expired
- Login again to get new token
- Token expires in 24 hours
- Implement refresh token for better UX

---

## 📞 Support

For issues:
1. Check [CODE_REVIEW.md](CODE_REVIEW.md) for known issues
2. Review [TEST_RESULTS.md](TEST_RESULTS.md) for API examples
3. Check MongoDB logs
4. Check browser console for errors

---

## 📝 License

This project is provided as-is for educational purposes.

---

## 🎯 Future Enhancements

- [ ] Payment verification with signature
- [ ] Order status tracking
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Admin panel with charts
- [ ] User profile management
- [ ] Order history and analytics
- [ ] Multiple payment methods
- [ ] Real-time order tracking
