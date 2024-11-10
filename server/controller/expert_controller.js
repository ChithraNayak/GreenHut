const Expert = require("../model/expert_model");
const bookingSchema = require("../model/Booking");

const path = require("path");
const nodemailer = require("nodemailer");
const fs = require("fs");
const bcrypt = require("bcrypt");

require("dotenv").config();
// Get all experts
exports.getExperts = async (req, res) => {
  try {
    const experts = await Expert.find();
    res.status(200).json(experts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single expert by ID
exports.getExpertById = async (req, res) => {
  try {
    const expert = await Expert.findById(req.params.id);
    if (!expert) {
      return res.status(404).json({ message: "Expert not found" });
    }
    res.status(200).json(expert);
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

// Create a new expert
exports.createExpert = async (req, res) => {
  const { name, contact, email, address } = req.body;
  const image = req.file ? req.file.filename : null;

  try {
    // Check if the email is already in use
    const existingExpert = await Expert.findOne({ email });
    if (existingExpert) {
      return res.status(400).json({ message: "Email is already in use" });
    }

    // Generate a random password
    const password = generateRandomPassword();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(password, "password");

    // Create a new expert with the random password
    const newExpert = new Expert({
      name,
      contact,
      email,
      address,
      image,
      password: hashedPassword, // Store the password in the database
    });

    // Save the expert
    await newExpert.save();

    // Send the password via email
    const emailSubject = "Your Expert Account Password";
    const emailText = `Hello ${name},\n\nYour account has been created. Here is your password: ${password}\n\nPlease change it after logging in.\n\nBest regards,\nYour Team`;
    await sendEmail(email, emailSubject, emailText);

    res.status(200).json(newExpert);
  } catch (error) {
    console.error("Error creating expert:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Update an existing expert
exports.updateExpert = async (req, res) => {
  const { name, contact, email, address } = req.body;
  const image = req.file ? req.file.filename : null;

  try {
    const expert = await Expert.findById(req.params.id);
    if (!expert) {
      return res.status(404).json({ message: "Expert not found" });
    }

    expert.name = name;
    expert.contact = contact;
    expert.email = email;
    expert.address = address;
    if (image) {
      // Delete the old image if a new one is provided
      if (expert.image) {
        const oldImagePath = path.join(
          __dirname,
          "../../uploads",
          expert.image
        );
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      expert.image = image;
    }

    await expert.save();
    res.status(200).json(expert);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete an expert
exports.deleteExpert = async (req, res) => {
  try {
    const expert = await Expert.findByIdAndDelete(req.params.id);
    if (!expert) {
      return res.status(404).json({ message: "Expert not found" });
    }
    res.status(200).json({ message: "Expert deleted successfully" });
  } catch (error) {
    console.error("Error deleting expert:", error);
    res.status(500).json({ message: "Failed to delete expert" });
  }
};

exports.getAppointmentsCount = async (req, res) => {
  try {
    const expertId = req.user;
    const all = await bookingSchema.find({ expertId });
    const pending = await bookingSchema.find({ expertId, status: "Pending" });
    res.json({
      success: true,
      all: all?.length,
      pending: pending?.length,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error occurred.",
    });
  }
};
exports.viewAllBookings = async (req, res) => {
  try {
    const expertId = req.user;
    const bookings = await bookingSchema.find({ expertId }).populate("userId");
    res.json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error occurred.",
    });
  }
};
exports.updateStatus = async (req, res) => {
  try {
    var booking = await bookingSchema.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    } else {
      const { status } = req.body;
      const updatedBooking = {};
      updatedBooking.status = status;
      booking = await bookingSchema.findByIdAndUpdate(
        req.params.id,
        { $set: updatedBooking },
        { new: true }
      );
      res.json({
        success: true,
        booking,
        message: "Booking status updated successfully",
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error occurred.",
    });
  }
};
