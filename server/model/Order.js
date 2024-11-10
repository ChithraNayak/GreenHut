const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "register", required: true },
  products: [
    {
      productId: { type: Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
    },
  ],
  deliveryOption: { type: String, required: true },
  deliveryCharge: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  deliveryPersonId: { type: Schema.Types.ObjectId, ref: "DeliveryWorker" },
  totalAmount: { type: Number, required: true },
  status: { type: String, default: "Pending" }, // Pending, Paid, Shipped, etc.
  name: { type: String },
  email: { type: String },
  phone: { type: String },
  street: { type: String },
  address: { type: String },
  pincode: { type: String },
  feedback: { type: String },
  rating: { type: String },
});

module.exports = mongoose.model("Order", orderSchema);
