const AdminSchema = require("../model/adminLogin");
const DeliverySchema = require("../model/deliveryworkers_model");
const Category = require("../model/category_model");
const ExpertSchema = require("../model/expert_model");
const UserSchema = require("../model/user_model");
const ProductSchema = require("../model/product_model");
const Product = require("../model/product_model");
const Order = require("../model/Order");
const Booking = require("../model/Booking");
const notification = require("../model/notification");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const key = "Hello";

const sendNotification = async (req, res) => {
  try {
    const { type, message } = req.body;
    const newNotification = await new notification({
      type,
      message,
    }).save();
    res.json({ success: true, message: "New Notification sent successfully" });
  } catch (err) {
    console.log(err);
  }
};
const deleteNotification = async (req, res) => {
  try {
    const noti = await notification.findById(req.params.id);
    if (!noti) {
      return res.json({ success: false, message: "Notification not found" });
    } else {
      await notification.findByIdAndDelete(req.params.id);
      res.json({ success: true, message: "Notification deleted successfully" });
    }
  } catch (err) {
    console.log(err);
  }
};

const getAllNotifications = async (req, res) => {
  try {
    const notifications = await notification.find();
    res.json({
      success: true,
      notifications,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error occurred.",
    });
  }
};
const AdminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await AdminSchema.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "Incorrect email or password",
      });
    }
    const ismatch = await bcrypt.compare(password, user.password);
    if (!ismatch) {
      return res.json("Incorrect Password");
    }
    // const data = user.id;
    const token = await jwt.sign({ id: user.id }, key);
    const success = true;
    res.json({ token, success });
  } catch (err) {
    console.log(err);
  }
};
const getAllCounts = async (req, res) => {
  try {
    const categories = await Category.find();
    const products = await Product.find();
    const experts = await ExpertSchema.find();
    const customers = await UserSchema.find();
    const deliveryPersons = await DeliverySchema.find();
    const orders = await Order.find({ status: "Delivered" });
    const bookings = await Booking.find({ status: "Confirmed" });
    let amount = 0;
    orders.forEach((item) => {
      amount += +item?.totalAmount || 0;
    });
    res.json({
      success: true,
      categories: categories?.length,
      products: products?.length,
      experts: experts?.length,
      customers: customers?.length,
      deliveryPersons: deliveryPersons?.length,
      orders: orders?.length,
      bookings: bookings?.length,
      amount,
    });
  } catch (err) {
    console.log(err);
  }
};

const DeliveryLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await DeliverySchema.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "Incorrect email or password",
      });
    }
    const ismatch = await bcrypt.compare(password, user.password);
    if (!ismatch) {
      return res.json("Incorrect Password");
    }
    // console.log(user, "user");

    // const data = user.id;
    const token = await jwt.sign({ id: user.id }, key);
    const success = true;
    res.json({ token, success });
  } catch (err) {
    console.log(err);
  }
};

const ExpertLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await ExpertSchema.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "Incorrect email or password",
      });
    }
    const ismatch = await bcrypt.compare(password, user.password);
    if (!ismatch) {
      return res.json("Incorrect Password");
    }
    // const data = user.id;
    const token = await jwt.sign({ id: user.id }, key);
    const success = true;
    res.json({ token, success });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  AdminLogin,
  DeliveryLogin,
  ExpertLogin,
  getAllCounts,
  sendNotification,
  getAllNotifications,
  deleteNotification,
};
