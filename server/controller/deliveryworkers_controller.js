// server/deliveryworkers_controller.js
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

const DeliveryWorker = require("../model/deliveryworkers_model");
const orderSchema = require("../model/Order");

// Get all delivery workers with pagination
const getAllWorkers = async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query;
    const workers = await DeliveryWorker.find()
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const totalWorkers = await DeliveryWorker.countDocuments();
    res.json({
      workers,
      totalPages: Math.ceil(totalWorkers / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getAllCounts = async (req, res) => {
  try {
    const deliveryPersonId = req.user;
    const allOrders = await orderSchema.find({ deliveryPersonId });
    const delivered = await orderSchema.find({
      deliveryPersonId,
      status: "Delivered",
    });
    const pending = await orderSchema.find({
      deliveryPersonId,
      status: "Confirmed",
    });
    res.json({
      success: true,
      all: allOrders.length,
      delivered: delivered.length,
      pending: pending.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const generateRandomPassword = (length = 12) => {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
};

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "chithranayak22@gmail.com", // Your email address
    pass: "qyuwkfwboukokngs", // Your email password
  },
});

const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: "chithradnayak@gmail.com",
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error.message);
  }
};

// Add a new delivery worker
const addWorker = async (req, res) => {
  try {
    const password = generateRandomPassword();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newWorker = new DeliveryWorker({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      image: req.file ? `${req.file.filename}` : null,
      password: hashedPassword,
    });
    await newWorker.save();
    const emailSubject = "Your Delivery Account Password";
    const emailText = `Hello ${req.body.name},\n\nYour account has been created. Here is your password: ${password}\n\nPlease change it after logging in.\n\nBest regards,\nYour Team`;
    await sendEmail(req.body.email, emailSubject, emailText);
    res.status(201).json(newWorker);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update an existing delivery worker
const updateWorker = async (req, res) => {
  try {
    const updatedWorker = await DeliveryWorker.findById(req.params.id);
    if (!updatedWorker) {
      return res.status(404).json({ message: "Worker not found" });
    }
    updatedWorker.name = req.body.name;
    updatedWorker.email = req.body.email;
    updatedWorker.phone = req.body.phone;
    if (req.file) {
      updatedWorker.image = `${req.file.filename}`;
    }
    await updatedWorker.save();
    res.json(updatedWorker);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a delivery worker
const deleteWorker = async (req, res) => {
  try {
    const deletedWorker = await DeliveryWorker.findByIdAndDelete(req.params.id);
    if (!deletedWorker) {
      return res.status(404).json({ message: "Worker not found" });
    }
    res.json(deletedWorker);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getAllWorkers,
  addWorker,
  updateWorker,
  deleteWorker,
  getAllCounts,
};
