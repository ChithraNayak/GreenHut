const User = require("../model/user_model");
const bookingSchema = require("../model/Booking");
const notification = require("../model/notification");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const key = "Hello";

// Register a new user
const Userregister = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email is already registered. Please login.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ name, email, password: hashedPassword });
    const registeredUser = await newUser.save();

    res.status(201).json({
      success: true,
      message: "Registered successfully! Please login now.",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};

// User login
const Userlogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Incorrect email or password.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect email or password.",
      });
    }

    const token = jwt.sign({ id: user.id }, key);
    res.json({
      success: true,
      token,
      message: `Welcome back, ${user.name}!`,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};

// Get a single user by ID
const getoneuser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error occurred.",
    });
  }
};

// Get user details from token
const getuser = async (req, res) => {
  try {
    console.log(req.user);

    const user = await User.findById(req.user);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error occurred.",
    });
  }
};

// Reset user password
const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User with this email does not exist.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await user.save();

    res.json({
      success: true,
      message: "Password reset successfully.",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};

// Get all users
const getalluser = async (req, res) => {
  try {
    console.log(req.user);

    const user = await User.find(req.user);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error occurred.",
    });
  }
};

const bookAnExpert = async (req, res) => {
  try {
    const { expertId, date, slot } = req.body;
    const userId = req.user;
    const booking = await new bookingSchema({
      userId,
      expertId,
      date,
      time: slot,
      status: "Pending",
    }).save();
    res.json({
      success: true,
      message: "Expert Booked successfully on " + date + " at " + slot,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error occurred.",
    });
  }
};
const getAllBookings = async (req, res) => {
  try {
    const userId = req.user;
    const bookings = await bookingSchema.find({ userId }).populate("expertId");
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

module.exports = {
  Userregister,
  Userlogin,
  getoneuser,
  getuser,
  getalluser,
  resetPassword,
  bookAnExpert,
  getAllBookings,
  getAllNotifications,
};
