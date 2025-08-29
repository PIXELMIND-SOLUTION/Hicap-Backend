const mongoose = require('mongoose');

const LiveClassSchema = new mongoose.Schema({
  className: {
    type: String,
    required: true,
    trim: true
  },
  enrollmentIdRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Enrollment',
    required: true
  },
  subjectName: {
    type: String,
    required: true,
    trim: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  mentorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mentor',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  timing: {
    type: String,
    required: true // e.g., "10:00 AM - 11:00 AM"
  },
  link: {
    type: String,
    required: true,
    trim: true
  }
}, { timestamps: true });

module.exports = mongoose.model('LiveClass', LiveClassSchema);
