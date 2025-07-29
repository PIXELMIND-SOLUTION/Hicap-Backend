const { ContactDetails, SocialMedia } = require('../models/details');

// ====================== Contact Details ======================

// 👉 Create ContactDetails
exports.createContactDetails = async (req, res) => {
  try {
    const contact = await ContactDetails.create(req.body);
    res.status(201).json({ success: true, message: "Contact created", data: contact });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// 👉 Get All ContactDetails
exports.getAllContactDetails = async (req, res) => {
  try {
    const contacts = await ContactDetails.find();
    res.status(200).json({ success: true, data: contacts });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// 👉 Get ContactDetails by ID
exports.getContactDetailsById = async (req, res) => {
  try {
    const contact = await ContactDetails.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, message: "Contact not found" });
    }
    res.status(200).json({ success: true, data: contact });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// 👉 Update ContactDetails
exports.updateContactDetails = async (req, res) => {
  try {
    const contact = await ContactDetails.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!contact) {
      return res.status(404).json({ success: false, message: "Contact not found" });
    }
    res.status(200).json({ success: true, message: "Contact updated", data: contact });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// 👉 Delete ContactDetails
exports.deleteContactDetails = async (req, res) => {
  try {
    const contact = await ContactDetails.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, message: "Contact not found" });
    }
    res.status(200).json({ success: true, message: "Contact deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ====================== Social Media ======================

// 👉 Create SocialMedia
exports.createSocialMedia = async (req, res) => {
  try {
    const social = await SocialMedia.create(req.body);
    res.status(201).json({ success: true, message: "Social media created", data: social });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// 👉 Get All SocialMedia
exports.getAllSocialMedia = async (req, res) => {
  try {
    const social = await SocialMedia.find();
    res.status(200).json({ success: true, data: social });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// 👉 Get SocialMedia by ID
exports.getSocialMediaById = async (req, res) => {
  try {
    const social = await SocialMedia.findById(req.params.id);
    if (!social) {
      return res.status(404).json({ success: false, message: "Social media not found" });
    }
    res.status(200).json({ success: true, data: social });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// 👉 Update SocialMedia
exports.updateSocialMedia = async (req, res) => {
  try {
    const social = await SocialMedia.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!social) {
      return res.status(404).json({ success: false, message: "Social media not found" });
    }
    res.status(200).json({ success: true, message: "Social media updated", data: social });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// 👉 Delete SocialMedia
exports.deleteSocialMedia = async (req, res) => {
  try {
    const social = await SocialMedia.findByIdAndDelete(req.params.id);
    if (!social) {
      return res.status(404).json({ success: false, message: "Social media not found" });
    }
    res.status(200).json({ success: true, message: "Social media deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
