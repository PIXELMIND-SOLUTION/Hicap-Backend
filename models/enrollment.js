const mongoose = require('mongoose');

// Enrollment Schema
const enrollmentSchema = new mongoose.Schema({
  batchNumber: { type: String, required: true },
  batchName: { type: String, required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  startDate: { type: Date, required: true },
  timings: { type: String, required: true },
  duration: { type: String, required: true },
  category: { type: String, required: true },
assignedMentors: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Mentor"
  }],   enrolledUsers: [
    { type: mongoose.Schema.Types.ObjectId, ref: "UserRegister" } // Users enrolled in this batch
  ]
}, { timestamps: true });


const certificateSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'userRegister', required: true },
  enrollment: { type: mongoose.Schema.Types.ObjectId, ref: 'Enrollment', required: true },
  status: {
    image: { type: String, required: true },
    type: { type: String, enum: ['Completed', 'Pending'], required: true }
  }
});

const certificateWrapperSchema = new mongoose.Schema({
  certificates: [certificateSchema]
}, { timestamps: true });

// Create models
const Enrollment = mongoose.model('Enrollment', enrollmentSchema);
const Certificate = mongoose.model('Certificate', certificateWrapperSchema);

// Export models
module.exports = {
  Enrollment,
  Certificate
};
