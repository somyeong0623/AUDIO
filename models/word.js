const mongoose = require("mongoose");

const WordSchema = new mongoose.Schema({
  userId: String,
  word: String,
  definition: String,
});

module.exports = mongoose.model("Word", WordSchema);