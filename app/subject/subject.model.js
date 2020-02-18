const mongoose = require("mongoose");

const subjectSchema = mongoose.Schema({
  title: { type: String, required: true },
  duration: { type: Date, required: true }
});

module.exports = mongoose.model("Subject", subjectSchema);
