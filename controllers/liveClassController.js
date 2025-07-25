const LiveClass = require("../models/liveClass");

// CREATE
exports.createLiveClass = async (req, res) => {
  try {
    const liveClass = await LiveClass.create(req.body);
    res.status(201).json({ success: true, data: liveClass });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error creating class", error: err.message });
  }
};

// GET ALL
exports.getAllLiveClasses = async (req, res) => {
  try {
    const classes = await LiveClass.find();
    res.status(200).json({ success: true, count: classes.length, data: classes });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching classes", error: err.message });
  }
};

// GET BY ID
exports.getLiveClassById = async (req, res) => {
  try {
    const liveClass = await LiveClass.findById(req.params.id);
    if (!liveClass) return res.status(404).json({ success: false, message: "Class not found" });
    res.status(200).json({ success: true, data: liveClass });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching class", error: err.message });
  }
};

// UPDATE
exports.updateLiveClass = async (req, res) => {
  try {
    const updatedClass = await LiveClass.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedClass) return res.status(404).json({ success: false, message: "Class not found" });
    res.status(200).json({ success: true, data: updatedClass });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating class", error: err.message });
  }
};

// DELETE
exports.deleteLiveClass = async (req, res) => {
  try {
    const deleted = await LiveClass.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Class not found" });
    res.status(200).json({ success: true, message: "Class deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error deleting class", error: err.message });
  }
};
