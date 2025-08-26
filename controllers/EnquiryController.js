const {Enquiry,ContactEnquiry } = require('../models/EnquiryModel');

// Create Enquiry
exports.createEnquiry = async (req, res) => {
  try {
    const enquiry = new Enquiry(req.body);
    const saved = await enquiry.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get All Enquiries
exports.getEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find();
    res.json(enquiries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get One Enquiry by ID
exports.getEnquiryById = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) return res.status(404).json({ message: "Enquiry not found" });
    res.json(enquiry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Enquiry
exports.updateEnquiry = async (req, res) => {
  try {
    const updated = await Enquiry.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Enquiry not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete Enquiry
exports.deleteEnquiry = async (req, res) => {
  try {
    const deleted = await Enquiry.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Enquiry not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Add Enquiry
exports.addEnquiry = async (req, res) => {
  try {
    const { name, email, phoneNumber, enquiryType, message } = req.body;

    if (!name || !email || !phoneNumber || !enquiryType || !message) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const enquiry = new ContactEnquiry({ name, email, phoneNumber, enquiryType, message });
    await enquiry.save();

    return res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully",
      data: enquiry
    });
  } catch (error) {
    console.error("Error adding enquiry:", error);
    return res.status(500).json({ success: false, message: "Error adding enquiry", error: error.message });
  }
};

// Get All Enquiries
exports.getAllEnquiries = async (req, res) => {
  try {
    const enquiries = await ContactEnquiry.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: enquiries.length,
      data: enquiries
    });
  } catch (error) {
    console.error("Error fetching enquiries:", error);
    return res.status(500).json({ success: false, message: "Error fetching enquiries", error: error.message });
  }
};

// Get Enquiry By ID
exports.getEnquiryById = async (req, res) => {
  try {
    const { id } = req.params;
    const enquiry = await ContactEnquiry.findById(id);
    if (!enquiry) {
      return res.status(404).json({ success: false, message: "Enquiry not found" });
    }
    return res.status(200).json({ success: true, data: enquiry });
  } catch (error) {
    console.error("Error fetching enquiry:", error);
    return res.status(500).json({ success: false, message: "Error fetching enquiry", error: error.message });
  }
};

// Update Enquiry By ID
exports.updateEnquiryById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phoneNumber, enquiryType, message } = req.body;

    const enquiry = await ContactEnquiry.findByIdAndUpdate(
      id,
      { name, email, phoneNumber, enquiryType, message },
      { new: true }
    );

    if (!enquiry) {
      return res.status(404).json({ success: false, message: "Enquiry not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Enquiry updated successfully",
      data: enquiry
    });
  } catch (error) {
    console.error("Error updating enquiry:", error);
    return res.status(500).json({ success: false, message: "Error updating enquiry", error: error.message });
  }
};

// Delete Enquiry By ID
exports.deleteEnquiryById = async (req, res) => {
  try {
    const { id } = req.params;
    const enquiry = await ContactEnquiry.findByIdAndDelete(id);
    if (!enquiry) {
      return res.status(404).json({ success: false, message: "Enquiry not found" });
    }
    return res.status(200).json({ success: true, message: "Enquiry deleted successfully" });
  } catch (error) {
    console.error("Error deleting enquiry:", error);
    return res.status(500).json({ success: false, message: "Error deleting enquiry", error: error.message });
  }
};
