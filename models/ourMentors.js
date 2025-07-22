const mongoose = require("mongoose");

// OurMentor Schema
const ourMentorSchema = new mongoose.Schema({
  image: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  content: { type: String, required: true },
}, { timestamps: true });

// MentorExperience Schema
const mentorExperienceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  content: { type: String, required: true }
}, { timestamps: true });

// Export both models
const OurMentor = mongoose.model("OurMentor", ourMentorSchema);
const MentorExperience = mongoose.model("MentorExperience", mentorExperienceSchema);
    
module.exports = {
  OurMentor,
  MentorExperience
};
