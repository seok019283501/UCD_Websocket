const mongoose = require("mongoose");

const  RealTimeCollaborative = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    unique: true
  },
  text: {
    type: Buffer
  }
});

const RealTimeCollaborativeEntity = mongoose.model("RealTimeCollaborative", RealTimeCollaborative);
module.exports = {RealTimeCollaborativeEntity}