const mongoose = require("mongoose");

const liveClassSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  timing: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    trim: true,
  },
  duration: {
    type: String,
    required: true,
  },
  meetLink: {
    type: String,
    required: true,
  },
  mentorName: {
    type: String,
    required: true,
  },
  course: {
    type: String,
    required: true,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("LiveClass", liveClassSchema);
