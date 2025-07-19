const Content = require("../models/content");
const cloudinary = require("../config/cloudinary");

// POST: Create
const createContent = async (req, res) => {
  try {
    const { title, heading, description } = req.body;

    if (!req.file) return res.status(400).json({ message: "Image is required" });

    const imageUrl = req.file.path;

    const content = await Content.create({ title, heading, description, image: imageUrl });
    res.status(201).json({ message: "Content created", data: content });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET: All
const getAllContent = async (req, res) => {
  try {
    const data = await Content.find().sort({ _id: -1 });
    res.status(200).json({ message: "Content fetched", data });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// PUT: Update
const updateContent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, heading, description } = req.body;

    const updateData = { title, heading, description };

    if (req.file) {
      updateData.image = req.file.path;
    }

    const updated = await Content.findByIdAndUpdate(id, updateData, { new: true });

    if (!updated) return res.status(404).json({ message: "Content not found" });

    res.json({ message: "Content updated", data: updated });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// DELETE: Remove
const deleteContent = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Content.findByIdAndDelete(id);

    if (!deleted) return res.status(404).json({ message: "Content not found" });

    res.json({ message: "Content deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  createContent,
  getAllContent,
  updateContent,
  deleteContent
};
