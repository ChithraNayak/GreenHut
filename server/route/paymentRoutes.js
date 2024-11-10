// backend/routes/paymentRoutes.js
const express = require("express");
const router = express.Router();
const Payment = require("../model/Payment");
const Order = require("../model/Order");
const Product = require("../model/product_model");
const Cart = require("../model/Cart");
const auth = require("../middleware/auth_middleware");

// Create a new payment
router.post("/create", auth, async (req, res) => {
  try {
    const { products, orderId, paymentMethod, transactionId } = req.body;
    const userId = req.user;

    // Find the order
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    let totalAmount = 0;
    let deliveryCharge = 0;

    // Calculate the total amount
    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (product) {
        totalAmount += product.price * item.quantity;
      }
    }

    // Add delivery charge if applicable
    if (totalAmount < 250) {
      deliveryCharge = 50; // Set a fixed delivery charge or calculate based on your criteria
    }
    totalAmount += deliveryCharge;

    // Create a new payment record
    const payment = new Payment({
      orderId,
      paymentMethod,
      transactionId: transactionId,
      amount: totalAmount,
    });

    await payment.save();

    // Update order status to 'Paid' if payment method is UPI or card
    if (paymentMethod === "upi" || paymentMethod === "card") {
      payment.status = "Paid";
      await payment.save();
    }

    if (userId) {
      await Cart.findOneAndUpdate(
        { userId },
        { $set: { products: [] } } // Empty the cart
      );
    }

    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get payment by order ID
router.get("/payment/:orderId", async (req, res) => {
  try {
    const payment = await Payment.findOne({ orderId: req.params.orderId });
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
