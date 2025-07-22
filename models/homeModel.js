const mongoose = require("mongoose");

// Home Schema
const homeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

// HomeCourses Schema
const homeCoursesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

// ✅ Review Schema (renamed from Rating)
const reviewSchema = new mongoose.Schema(
  {
    image: { type: String },
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    content: { type: String },
  },
  { timestamps: true }
);

// Define models
const Home = mongoose.model("Home", homeSchema);
const HomeCourses = mongoose.model("HomeCourses", homeCoursesSchema);
const Review = mongoose.model("Review", reviewSchema);

// Export all
module.exports = {
  Home,
  HomeCourses,
  Review,
};
