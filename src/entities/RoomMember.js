const mongoose = require("mongoose");

const  RoomMember = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  username:{
    type: String,
    required: true
  },
  roomNumber: {
    type: String,
    required: true,
  }
});

const RoomMemberEntity = mongoose.model("RoomMember", RoomMember);
module.exports = {RoomMemberEntity}