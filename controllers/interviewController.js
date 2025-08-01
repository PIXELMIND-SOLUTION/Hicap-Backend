const Interview = require("../models/interviewModel");
const { uploadImage } = require("../config/cloudinary");

// Create Interview
exports.createInterview = async (req, res) => {
  try {
    const { courseId, date, companyName, role, type, salary, content, link } = req.body;

    if (!courseId || !date || !companyName || !role || !type || !salary) {
      return res.status(400).json({ success: false, message: "All required fields must be provided." });
    }

    let imageUrl = null;
    if (req.file) {
      imageUrl = await uploadImage(req.file.buffer); // You should implement uploadImage
    }

    const interview = await Interview.create({
      courseId,
      date,
      companyName,
      role,
      type,
      salary,
      content,
      link,
      image: imageUrl
    });

    res.status(201).json({ success: true, message: "Interview created", data: interview });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Interviews
exports.getAllInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find().populate("courseId");
    res.status(200).json({ success: true, data: interviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Interview by ID
exports.getInterviewById = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id).populate("courseId");
    if (!interview) {
      return res.status(404).json({ success: false, message: "Interview not found" });
    }
    res.status(200).json({ success: true, data: interview });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Interview
exports.updateInterview = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.file) {
      updateData.image = await uploadImage(req.file.buffer); // Optional image update
    }

    const updatedInterview = await Interview.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    if (!updatedInterview) {
      return res.status(404).json({ success: false, message: "Interview not found" });
    }

    res.status(200).json({ success: true, message: "Interview updated", data: updatedInterview });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Interview
exports.deleteInterview = async (req, res) => {
  try {
    const deleted = await Interview.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Interview not found" });
    }
    res.status(200).json({ success: true, message: "Interview deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};