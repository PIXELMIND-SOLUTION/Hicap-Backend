const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  mode: { type: String, enum: ['online', 'offline', 'both'] },
  category: String,
  subcategory: String,
  duration: String,

  faq: [
    {
      question: String,
      answer: String,
    },
  ],

  noOfLessons: Number,
  noOfStudents: Number,

  courseObject: [
    {
      title: String,
      content: String,
    },
  ],

  features: [
    {
      image: String,
      title: String,
    },
  ],

  rating: {
    type: Number,
    default: 0,
  },

  reviewCount: {
    type: Number,
    default: 0,
  },

  isPopular: {
    type: Boolean,
    default: false,
  },

  isHighRated: {
    type: Boolean,
    default: false,
  },

  image: String,
  price: Number,

  status: {
    type: String,
    enum: ['available', 'unavailable'],
    default: 'available',
  },
}, { timestamps: true });

module.exports = mongoose.model("Course", courseSchema);
