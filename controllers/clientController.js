const Client = require("../models/client");
const { cloudinary, uploadImage } = require('../config/cloudinary');

// Create
exports.createClient = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "At least one image is required" });
    }

    const imageUrls = [];

    for (const file of req.files) {
      const imageUrl = await uploadImage(file.buffer);
      imageUrls.push(imageUrl);
    }

    const newClient = await Client.create({
      content: content,
      image: imageUrls,
    });

    res.status(201).json({ message: "Client created", data: newClient });
  } catch (err) {
    res.status(500).json({ message: "Creation failed", error: err.message });
  }
};

// Get All
exports.getAllClients = async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    res.status(200).json(clients);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get by ID
exports.getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ message: "Client not found" });
    res.status(200).json(client);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update
exports.updateClient = async (req, res) => {
  try {
    const { content } = req.body;
    const existing = await Client.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Client not found" });

    let imageUrls = existing.image;

    if (req.files && req.files.length > 0) {
      imageUrls = [];

      for (const file of req.files) {
        const imageUrl = await uploadImage(file.buffer);
        imageUrls.push(imageUrl);
      }
    }

    existing.content = content || existing.content;
    existing.image = imageUrls;

    await existing.save();
    res.status(200).json({ message: "Client updated", data: existing });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete
exports.deleteClient = async (req, res) => {
  try {
    const deleted = await Client.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Client not found" });
    res.status(200).json({ message: "Client deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
