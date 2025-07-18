const mongoose = require("mongoose");

const aboutUsSchema = new mongoose.Schema({
  title1: { type: String, required: true },
  content1: { type: String, required: true },
  image1: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("AboutUs", aboutUsSchema);
