// routes/order.js
const express = require("express");
const router = express.Router();
const Order = require("../model/Order");
const Product = require("../model/product_model");
const auth = require("../middleware/auth_middleware");

// Create a new order
router.post("/create", auth, async (req, res) => {
  try {
    const {
      products,
      address,
      paymentMethod,
      deliveryOption,
      name,
      email,
      phone,
      street,
      pincode,
    } = req.body;
    const userId = req.user;
    let totalAmount = 0;
    let deliveryCharge = 0;

    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (product) {
        totalAmount += product.price * item.quantity;

        // Decrease product inventory
        if (product.inventory < item.quantity) {
          return res.status(400).json({
            success: false,
            message: `Insufficient inventory for product ${product.name}`,
          });
        }
        product.inventory -= item.quantity;
        await product.save();
      }
    }

    if (totalAmount < 250) {
      deliveryCharge = 50; // Set a fixed delivery charge or calculate based on your criteria
    }

    const newOrder = new Order({
      userId,
      products,
      address,
      totalAmount: totalAmount + deliveryCharge,
      deliveryCharge,
      paymentMethod,
      deliveryOption,
      name,
      email,
      phone,
      street,
      pincode,
    });

    const savedOrder = await newOrder.save();

    res.status(201).json({ success: true, order: savedOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/view", auth, async (req, res) => {
  try {
    const userId = req.user;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Fetch orders for the specific user and populate product details
    const orders = await Order.find({ userId })
      .populate({
        path: "products.productId", // Path to the referenced product model
        select: "name price image", // Fields to include from the product model
      })
      .exec();

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/viewall", async (req, res) => {
  try {
    // Fetch orders and populate product details and user details
    const orders = await Order.find()
      .populate({
        path: "products.productId", // Path to the referenced product model
        select: "name price image", // Fields to include from the product model
      })
      .populate({
        path: "userId", // Path to the referenced user model
      })
      .populate({
        path: "deliveryPersonId", // Path to the referenced user model
      })
      .exec();

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/confirm/:orderId", async (req, res) => {
  const { orderId } = req.params;
  const { assign } = req.body; // Optionally handle assignment

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update the order status to "Confirmed"
    order.status = "Confirmed";
    if (assign) {
      order.assigned = true; // Add or update the assignment status
    }

    await order.save();

    res.status(200).json({ message: "Order confirmed successfully", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/cancel/:orderId", async (req, res) => {
  const { orderId } = req.params;
  const { unassign } = req.body; // Optionally handle unassignment

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update the order status to "Canceled"
    order.status = "Canceled";
    if (unassign) {
      order.assigned = false; // Add or update the unassignment status
    }

    await order.save();

    res.status(200).json({ message: "Order canceled successfully", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.put("/assignDelivery/:orderId", async (req, res) => {
  const { orderId } = req.params;
  const { deliveryPersonId } = req.body; // Optionally handle unassignment

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    } else {
      if (deliveryPersonId) {
        order.deliveryPersonId = deliveryPersonId;
      }

      await order.save();

      res.json({
        success: true,
        message: "Delivery person assigned successfully",
        order,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get("/getDeliveryPersonOrders", auth, async (req, res) => {
  try {
    const deliveryPersonId = req.user;
    const orders = await Order.find({ deliveryPersonId })
      .populate("userId")
      .populate({
        path: "products.productId", // Path to the referenced product model
      });
    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.put("/updateOrder/:orderId", auth, async (req, res) => {
  try {
    var order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.json({ message: "Order not found", success: false });
    } else {
      // console.log(order);
      const { status } = req.body;
      const updatedOrder = {};
      if (status) {
        updatedOrder.status = status;
      }
      order = await Order.findByIdAndUpdate(
        req.params.orderId,
        { $set: updatedOrder },
        { new: true }
      );
      res.json({ success: true, message: "Order updated successfully", order });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.put("/giveReview/:orderId", async (req, res) => {
  try {
    var order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.json({ message: "Order not found", success: false });
    } else {
      // console.log(order);
      const { rating, feedback } = req.body;
      const updatedOrder = {};
      if (feedback) {
        updatedOrder.feedback = feedback;
      }
      if (rating) {
        updatedOrder.rating = rating;
      }
      order = await Order.findByIdAndUpdate(
        req.params.orderId,
        { $set: updatedOrder },
        { new: true }
      );
      res.json({
        success: true,
        message: "Thank your for your valuable feedback!",
        order,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
