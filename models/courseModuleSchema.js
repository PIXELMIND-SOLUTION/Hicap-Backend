const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  topic: String,
  duration: String,
  date: Date,
  link: String,
});

const moduleSchema = new mongoose.Schema({}, { strict: false }); // allow any structure inside module

const courseModuleSchema = new mongoose.Schema(
  {
    enrollment: { type: mongoose.Schema.Types.ObjectId, ref: 'Enrollment', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    modules: [moduleSchema], // array of objects like { module1: [ { topic, ... }, ... ] }
  },
  { timestamps: true }
);

module.exports = mongoose.model('CourseModule', courseModuleSchema);
