const express = require('express');
const Order = require('../models/Order');
const { auth, admin } = require('../middleware/auth');
const { validateOrder, validateOrderUpdate } = require('../middleware/validation');

const router = express.Router();

// Create order
router.post('/', auth, validateOrder, async (req, res) => {
  try {
    const { meatType, weight, quantity, amount, paymentId } = req.body;
    
    // Calculate price based on weight and quantity (₹500 per kg)
    const calculatedAmount = weight * quantity * 500;
    
    const order = await Order.create({
      user: req.user.id,
      meatType,
      weight,
      quantity,
      amount: amount || calculatedAmount,
      paymentId,
    });
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all orders (admin)
router.get('/', auth, admin, async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user orders
router.get('/my', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get order by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) return res.status(404).json({ error: 'Order not found' });
    
    // Check if user owns this order or is admin
    if (order.user._id.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update order status (admin only)
router.put('/:id', auth, admin, validateOrderUpdate, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('user', 'name email');
    
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
