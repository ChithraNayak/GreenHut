// model/queryModel.js
const mongoose = require("mongoose");

const querySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    query: { type: String, required: true },
    response: { type: String, default: "" }, // Field for storing responses
  },
  { timestamps: true }
);

module.exports = mongoose.model("Query", querySchema);
