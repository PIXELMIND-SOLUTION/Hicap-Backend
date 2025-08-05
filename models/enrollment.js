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
  },
rank: {
  type: Number,
  default: () => null
},
  performance: {
  theoreticalPercentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  courseTopic:{
    type:String,
    default:''
  },
  practicalPercentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  feedback: {
    type: String,
    default: ''
  },
  grade: {
    type: String,
    enum: ['A', 'B', 'C', 'D', 'F', ''],
    default: ''
  },
  completedAt: {
    type: Date
  }
}
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
