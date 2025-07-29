const {HomeFeature,Quality} = require("../models/HomeFeature");
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

// ➕ Create Quality Icons
const createQualityIcons = async (req, res) => {
  try {
    const file = req.file;
    const iconLogos = req.body.iconLogos;
    const names = req.body.names;

    const iconLogoArray = Array.isArray(iconLogos) ? iconLogos : [iconLogos];
    const nameArray = Array.isArray(names) ? names : [names];

    if (!file || iconLogoArray.length === 0 || nameArray.length === 0) {
      return res.status(400).json({ success: false, message: "Image, iconLogos and names are required." });
    }

    if (iconLogoArray.length !== nameArray.length) {
      return res.status(400).json({ success: false, message: "iconLogos and names length mismatch." });
    }

    // Upload image to Cloudinary
    const imageUrl = await uploadImage(file.buffer);

    // Build icons array
    const icons = iconLogoArray.map((logo, index) => ({
      iconLogo: logo,
      name: nameArray[index],
    }));

    const newQuality = await Quality.create({
      image: imageUrl,
      icon: icons
    });

    res.status(201).json({ success: true, message: "Quality created", data: newQuality });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ✅ GET ALL
const getAllQualityIcons = async (req, res) => {
  try {
    const qualities = await Quality.find();
    res.status(200).json({ success: true, data: qualities });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ✅ GET BY ID
const getQualityIconById = async (req, res) => {
  try {
    const { id } = req.params;
    const quality = await Quality.findById(id);
    if (!quality) {
      return res.status(404).json({ success: false, message: "Quality not found" });
    }
    res.status(200).json({ success: true, data: quality });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ✅ UPDATE
const updateQualityIcon = async (req, res) => {
  try {
    const { id } = req.params;
    const file = req.file;
    const iconLogos = req.body.iconLogos;
    const names = req.body.names;

    const iconLogoArray = Array.isArray(iconLogos) ? iconLogos : [iconLogos];
    const nameArray = Array.isArray(names) ? names : [names];

    if (iconLogoArray.length !== nameArray.length) {
      return res.status(400).json({ success: false, message: "iconLogos and names length mismatch." });
    }

    let updateData = {};

    if (file) {
      const imageUrl = await uploadImage(file.buffer);
      updateData.image = imageUrl;
    }

    if (iconLogoArray.length > 0) {
      updateData.icon = iconLogoArray.map((logo, index) => ({
        iconLogo: logo,
        name: nameArray[index],
      }));
    }

    const updated = await Quality.findByIdAndUpdate(id, updateData, { new: true });

    if (!updated) {
      return res.status(404).json({ success: false, message: "Quality not found" });
    }

    res.status(200).json({ success: true, message: "Quality updated", data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ✅ DELETE
const deleteQualityIcon = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Quality.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Quality not found" });
    }
    res.status(200).json({ success: true, message: "Quality deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = {
  createHomeFeature,
  getAllHomeFeatures,
  getHomeFeatureById,
  updateHomeFeature,
  deleteHomeFeature,
  createQualityIcons,
  getAllQualityIcons,
  getQualityIconById,
  updateQualityIcon,
  deleteQualityIcon
  
};
