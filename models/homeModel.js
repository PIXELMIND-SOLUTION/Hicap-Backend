const mongoose = require('mongoose');

// Home Schema
const homeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  }
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
  }
});

const Home = mongoose.model('Home', homeSchema);
const HomeCourses = mongoose.model('HomeCourses', homeCoursesSchema);

module.exports = { Home, HomeCourses};
