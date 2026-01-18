const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  meatType: { type: String, required: true },
  weight: { type: Number, required: true },
  quantity: { type: Number, required: true },
  amount: { type: Number, required: true },
  paymentId: { type: String },
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);