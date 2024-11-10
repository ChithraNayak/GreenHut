const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "register",
    required: true,
  },
  expertId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Expert",
    required: true,
  },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  status: { type: String },
});

module.exports = mongoose.model("Booking", bookingSchema);
