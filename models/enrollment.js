const mongoose = require('mongoose');

// Enrollment Schema
const enrollmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'userRegister',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  status: {
    type: String,
    enum: ['enrolled', 'completed'],
    default: 'enrolled'
  }
}, { timestamps: true });

// Certificate Schema
const certificateSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userRegister",
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true
  },
  status: {
    image: { type: String },
    type: {
      type: String,
      enum: ["Pending", "completed"],
      default: "Pending"
    }
  }
});

// Create models
const Enrollment = mongoose.model('Enrollment', enrollmentSchema);
const Certificate = mongoose.model('Certificate', certificateSchema);

// Export models
module.exports = {
  Enrollment,
  Certificate
};
