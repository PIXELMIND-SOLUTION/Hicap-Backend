const Interview = require("../models/interviewModel");
const { uploadImage } = require("../config/cloudinary");

// ✅ Create
exports.createInterview = async (req, res) => {
  try {
    const { courseId, date, companyName, role, type, salary, content } = req.body;

    if (!courseId || !date || !companyName || !role || !type || !salary) {
      return res.status(400).json({ success: false, message: "All required fields must be provided." });
    }

    let imageUrl = null;
    if (req.file) {
      imageUrl = await uploadImage(req.file.buffer);
    }

    const interview = await Interview.create({
      courseId,
      date,
      companyName,
      role,
      type,
      salary,
      content,
      image: imageUrl
    });

    return res.status(201).json({ success: true, message: "Interview created", data: interview });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get All
exports.getAllInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find().populate("courseId", "name"); // or remove .populate()
    res.status(200).json({ success: true, data: interviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get by ID
exports.getInterviewById = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id).populate("courseId", "name"); // Optional populate
    if (!interview) {
      return res.status(404).json({ success: false, message: "Interview not found" });
    }
    res.status(200).json({ success: true, data: interview });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Update
exports.updateInterview = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.file) {
      const imageUrl = await uploadImage(req.file.buffer);
      updateData.image = imageUrl;
    }

    const interview = await Interview.findByIdAndUpdate(req.params.id, updateData, {
      new: true
    });

    if (!interview) {
      return res.status(404).json({ success: false, message: "Interview not found" });
    }

    res.status(200).json({ success: true, message: "Interview updated", data: interview });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Delete
exports.deleteInterview = async (req, res) => {
  try {
    const interview = await Interview.findByIdAndDelete(req.params.id);
    if (!interview) {
      return res.status(404).json({ success: false, message: "Interview not found" });
    }
    res.status(200).json({ success: true, message: "Interview deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
