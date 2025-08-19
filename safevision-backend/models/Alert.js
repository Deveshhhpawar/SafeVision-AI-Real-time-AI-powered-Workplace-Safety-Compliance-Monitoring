const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
  type: { type: String, required: true }, 
  cameraId: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  imageUrl: { type: String }, 
  status: { type: String, default: "Pending" } 
});

module.exports = mongoose.model("Alert", alertSchema);
