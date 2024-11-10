// server/deliveryworkers_model.js

const mongoose = require("mongoose");

const deliveryWorkerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  image: { type: String },
  password:{type:String},
});

module.exports = mongoose.model("DeliveryWorker", deliveryWorkerSchema);
