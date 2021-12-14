const mongoose = require("mongoose");

const StatusSchema = new mongoose.Schema({
  email: String,
  nickname: String,
  roomIn: Boolean,
});

module.exports = mongoose.model("Status", StatusSchema);
