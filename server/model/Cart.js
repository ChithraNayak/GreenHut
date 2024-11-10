// models/Cart.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CartSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'register', required: true },
  products: [
    {
      productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true, default: 1 }
    }
  ]
});

module.exports = mongoose.model('Cart', CartSchema);
