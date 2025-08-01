const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    companyName: {
      type: String,
      required: true
    },
    role: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    salary: {
      type:String,
      required: true
    },
    image: {
      type: String
    },
    content: {
      type: String
    },
    link:{
      type:String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Interview", interviewSchema);
