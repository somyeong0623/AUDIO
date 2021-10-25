const mongoose = require("mongoose");

const SentenceSchema = new mongoose.Schema({
  sentenceId: Number,
  category: String,
  value: String,
  mean: String,
});

module.exports = mongoose.model("Sentence", SentenceSchema);