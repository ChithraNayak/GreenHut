const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String },
  inventory: { type: Number, required: true, default: 0 }, // New field
  ratings: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "register",
        required: true, // Ensure userId is present
      },
      rating: {
        type: Number, // Changed to Number for rating values
        required: true, // Ensure rating is present
        min: 1, // Minimum rating value
        max: 5, // Maximum rating value
      },
      feedback: {
        type: String,
        required: true, // Ensure feedback is present
      },
    },
  ],
});

module.exports = mongoose.model("Product", ProductSchema);
