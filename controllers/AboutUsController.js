const  AboutUs = require("../models/AboutUsModel");
const cloudinary = require("../config/cloudinary");
const { uploadImage } = require('../utils/uploadImage');

// ✅ Create About (POST)
const createAbout = async (req, res) => {
  try {
    const { title1, content1 } = req.body;
    let imageUrl = '';

    if (req.file) {
      imageUrl = await uploadImage(req.file.buffer); // Make sure this function returns a Cloudinary image URL
    }

    const about = new AboutUs({
      title1,
      content1,
      image1: imageUrl,
    });

    await about.save();

    res.status(201).json({ message: 'About created', data: about });
  } catch (error) {
    console.error('Create Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message || error });
  }
};

// ✅ Get All About Entries (GET)
const getAbout = async (req, res) => {
  try {
    const abouts = await  AboutUs.find().sort({ createdAt: -1 });
    res.status(200).json({ message: "Fetched successfully", data: abouts });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Update About by ID (PUT)
const updateAbout = async (req, res) => {
  try {
    const { title1, content1 } = req.body;
    const { id } = req.params;

    const updateData = { title1, content1 };

    if (req.file) {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "image", folder: "about" },
        async (error, result) => {
          if (error) {
            return res.status(500).json({ message: "Cloudinary upload error", error });
          }

          updateData.image1 = result.secure_url;
          const updated = await  AboutUs.findByIdAndUpdate(id, updateData, { new: true });

          if (!updated) {
            return res.status(404).json({ message: "About not found" });
          }

          res.status(200).json({ message: "Updated successfully", data: updated });
        }
      );

      req.file.stream.pipe(uploadStream);
    } else {
      const updated = await  AboutUs.findByIdAndUpdate(id, updateData, { new: true });

      if (!updated) {
        return res.status(404).json({ message: "About not found" });
      }

      res.status(200).json({ message: "Updated successfully", data: updated });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Delete About by ID (DELETE)
const deleteAbout = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await  AboutUs.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "About not found" });
    }

    res.status(200).json({ message: "Deleted successfully", data: deleted });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Export All Methods
module.exports = {
  createAbout,
  getAbout,
  updateAbout,
  deleteAbout
};
