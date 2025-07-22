const { OurMentor, MentorExperience } = require("../models/ourMentors");
const { uploadImage } = require("../config/cloudinary");

// CREATE
exports.createMentor = async (req, res) => {
  try {
    const { name, role, content } = req.body;

    if (!req.file) return res.status(400).json({ message: "Image is required" });

    const imageUrl = await uploadImage(req.file.buffer);

    const mentor = await OurMentor.create({
      image: imageUrl,
      name,
      role,
      content
    });

    res.status(201).json({ message: "Mentor created", data: mentor });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET ALL
exports.getAllMentors = async (req, res) => {
  try {
    const mentors = await OurMentor.find();
    res.status(200).json({ data: mentors });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET BY ID
exports.getMentorById = async (req, res) => {
  try {
    const mentor = await OurMentor.findById(req.params.id);
    if (!mentor) return res.status(404).json({ message: "Mentor not found" });
    res.status(200).json({ data: mentor });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// UPDATE
exports.updateMentor = async (req, res) => {
  try {
    const { name, role, content } = req.body;
    let updateData = { name, role, content };

    if (req.file) {
      const imageUrl = await uploadImage(req.file.buffer);
      updateData.image = imageUrl;
    }

    const updatedMentor = await OurMentor.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedMentor) return res.status(404).json({ message: "Mentor not found" });

    res.status(200).json({ message: "Mentor updated", data: updatedMentor });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// DELETE
exports.deleteMentor = async (req, res) => {
  try {
    const deleted = await OurMentor.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Mentor not found" });
    res.status(200).json({ message: "Mentor deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
// CREATE
exports.createMentorExperience = async (req, res) => {
  try {
    const { name, content } = req.body;

    if (!req.file) return res.status(400).json({ message: "Image is required" });

    const imageUrl = await uploadImage(req.file.buffer);

    const mentor = await MentorExperience.create({
      name,
      image: imageUrl,
      content
    });

    res.status(201).json({ message: "Mentor experience created", data: mentor });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// READ ALL
exports.getAllMentorExperiences = async (req, res) => {
  try {
    const data = await MentorExperience.find();
    res.status(200).json({ data });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// READ BY ID
exports.getMentorExperienceById = async (req, res) => {
  try {
    const data = await MentorExperience.findById(req.params.id);
    if (!data) return res.status(404).json({ message: "Not found" });
    res.status(200).json({ data });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// UPDATE
exports.updateMentorExperience = async (req, res) => {
  try {
    const { name, content } = req.body;
    let updateData = { name, content };

    if (req.file) {
      const imageUrl = await uploadImage(req.file.buffer);
      updateData.image = imageUrl;
    }

    const updated = await MentorExperience.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Not found" });

    res.status(200).json({ message: "Updated successfully", data: updated });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// DELETE
exports.deleteMentorExperience = async (req, res) => {
  try {
    const deleted = await MentorExperience.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });

    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
