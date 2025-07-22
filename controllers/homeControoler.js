const Home = require("../models/homeModel");
const { uploadImage } = require("../config/cloudinary");

// Create Home
exports.createHome = async (req, res) => {
  try {
    const { name } = req.body;
    if (!req.file) return res.status(400).json({ message: "Image is required" });

    const imageUrl = await uploadImage(req.file.buffer);

    const homeData = await Home.create({ name, image: imageUrl });

    res.status(201).json({ message: "Home created successfully", data: homeData });
  } catch (error) {
    res.status(500).json({ message: "Error creating home", error: error.message });
  }
};

// Get All
exports.getAllHomes = async (req, res) => {
  try {
    const homes = await Home.find();
    res.status(200).json({ message: "All Homes", data: homes });
  } catch (error) {
    res.status(500).json({ message: "Error fetching homes", error: error.message });
  }
};

// Get by ID
exports.getHomeById = async (req, res) => {
  try {
    const home = await Home.findById(req.params.id);
    if (!home) return res.status(404).json({ message: "Home not found" });

    res.status(200).json({ message: "Home fetched", data: home });
  } catch (error) {
    res.status(500).json({ message: "Error fetching home", error: error.message });
  }
};

// Update Home
exports.updateHome = async (req, res) => {
  try {
    const { name } = req.body;
    const home = await Home.findById(req.params.id);
    if (!home) return res.status(404).json({ message: "Home not found" });

    if (req.file) {
      const imageUrl = await uploadImage(req.file.buffer);
      home.image = imageUrl;
    }

    home.name = name || home.name;

    await home.save();

    res.status(200).json({ message: "Home updated", data: home });
  } catch (error) {
    res.status(500).json({ message: "Error updating home", error: error.message });
  }
};

// Delete
exports.deleteHome = async (req, res) => {
  try {
    const home = await Home.findByIdAndDelete(req.params.id);
    if (!home) return res.status(404).json({ message: "Home not found" });

    res.status(200).json({ message: "Home deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting home", error: error.message });
  }
};
