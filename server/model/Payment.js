// backend/models/Payment.js
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  paymentMethod: { type: String, required: true }, // 'Card', 'UPI', 'Cash'
  amount: { type: Number, required: true },
  transactionId: { type: String }, // Optional for Card and UPI
  status: { type: String, default: 'Pending' }, // Pending, Completed, Failed, etc.
});

module.exports = mongoose.model('Payment', paymentSchema);
