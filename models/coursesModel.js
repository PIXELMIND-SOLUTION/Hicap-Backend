const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true }
});

const featureSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String } // optional if you want
});

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  content: { type: String, required: true },
  image: { type: String, required: true }  // REQUIRED!
});

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  mode: { type: String, required: true },
  category: { type: String, required: true },
  subcategory: { type: String ,default:'course'},
  duration: { type: String, required: true },
  faq: [faqSchema],
  features: [featureSchema],
  reviews: [reviewSchema],
  image: { type: String, required: true }, // main course image
  toolsImages: [String]                 // store feature image URLs
}, { timestamps: true });

module.exports = mongoose.model("Course", courseSchema);
