const HomeFeature = require("../models/HomeFeature");
const { uploadImage } = require('../config/cloudinary');

const createHomeFeature = async (req, res) => {
  try {
    const { description } = req.body;
    const features = JSON.parse(req.body.features); // features as array of objects

    const uploadedFeatures = [];

    for (let i = 0; i < features.length; i++) {
      const file = req.files[i];
      if (!file) return res.status(400).json({ message: `Image missing for feature ${i + 1}` });

      const imageUrl = await uploadImage(file.buffer);

      uploadedFeatures.push({
        title: features[i].title,
        content: features[i].content,
        image: imageUrl,
      });
    }

    const homeFeature = await HomeFeature.create({ description, features: uploadedFeatures });

    res.status(201).json({ message: "Home feature created", data: homeFeature });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAllHomeFeatures = async (req, res) => {
  try {
    const data = await HomeFeature.find().sort({ createdAt: -1 });
    res.status(200).json({ message: "Fetched successfully", data });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateHomeFeature = async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    const features = JSON.parse(req.body.features); // updated features

    const existing = await HomeFeature.findById(id);
    if (!existing) return res.status(404).json({ message: "Feature not found" });

    const updatedFeatures = [];

    for (let i = 0; i < features.length; i++) {
      let imageUrl = existing.features[i]?.image || "";

      // Replace image if new one is uploaded
      if (req.files[i]) {
        imageUrl = await uploadImage(req.files[i].buffer);
      }

      updatedFeatures.push({
        title: features[i].title,
        content: features[i].content,
        image: imageUrl,
      });
    }

    existing.description = description;
    existing.features = updatedFeatures;
    await existing.save();

    res.status(200).json({ message: "Updated successfully", data: existing });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const getHomeFeatureById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await HomeFeature.findById(id);
    if (!data) return res.status(404).json({ message: "Feature not found" });

    res.status(200).json({ message: "Fetched successfully", data });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteHomeFeature = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await HomeFeature.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Feature not found" });

    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createHomeFeature,
  getAllHomeFeatures,
  getHomeFeatureById,
  updateHomeFeature,
  deleteHomeFeature,
};
