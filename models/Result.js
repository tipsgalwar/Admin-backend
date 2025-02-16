const mongoose = require("mongoose");

const ResultSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  rollNumber: { type: String, required: true },
  marks: { type: Number, required: true },
});

module.exports = mongoose.model("Result", ResultSchema);
