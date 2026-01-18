
require('dotenv').config();
const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Razorpay setup
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Payment routes
app.post('/api/payment/orders', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }
    
    const options = {
      amount: amount * 100, // amount in paise
      currency,
      receipt,
    };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create Razorpay order', details: err.message });
  }
});

// Verify payment signature
app.post('/api/payment/verify', (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing payment verification details' });
    }
    
    // Create signature hash
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');
    
    const isValid = expectedSignature === razorpay_signature;
    
    if (isValid) {
      res.json({ 
        success: true, 
        message: 'Payment verified successfully',
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id
      });
    } else {
      res.status(400).json({ 
        success: false, 
        error: 'Payment verification failed - Invalid signature' 
      });
    }
  } catch (err) {
    res.status(500).json({ error: 'Verification failed', details: err.message });
  }
});

// Auth and order routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
