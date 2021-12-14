const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
  host: String,
});

module.exports = mongoose.model("Room", RoomSchema);
