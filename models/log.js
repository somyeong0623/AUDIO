const mongoose = require("mongoose");

const LogSchema = new mongoose.Schema({
  userId: String,
  sentence: String,
  score: Number,
  date: Date,
});

module.exports = mongoose.model("Log", LogSchema);
