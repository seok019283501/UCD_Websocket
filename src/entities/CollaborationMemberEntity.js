const mongoose = require("mongoose");

const CollaborationMember = new mongoose.Schema({

  username:{
    type: String,
    required: true
  },
  roomNumber: {
    type: String,
    required: true,
  }
});

const CollaborationMemberEntity = mongoose.model("CollaborationMember", CollaborationMember);
module.exports = {CollaborationMemberEntity}