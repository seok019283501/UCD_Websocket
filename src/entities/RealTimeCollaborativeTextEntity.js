const mongoose = require("mongoose");

const  RealTimeCollaborativeText = new mongoose.Schema({
  id: {
    type: String,
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

const RealTimeCollaborativeTextEntity = mongoose.model("RealTimeCollaborativeText", RealTimeCollaborativeText);
module.exports = {RealTimeCollaborativeTextEntity}