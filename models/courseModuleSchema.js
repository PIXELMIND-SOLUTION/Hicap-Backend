const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  topic: String,
  duration: String,
  date: Date,
  link: String,
});

const moduleSchema = new mongoose.Schema({}, { strict: false });

const courseModuleSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'userRegister', required: true }, // 👈 added user reference
    enrollment: { type: mongoose.Schema.Types.ObjectId, ref: 'Enrollment', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    modules: [moduleSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('CourseModule', courseModuleSchema);
