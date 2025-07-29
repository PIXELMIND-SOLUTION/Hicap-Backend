const {Enrollment,Certificate} = require('../models/enrollment');
const { uploadImage } = require('../config/cloudinary');



// ➕ Create new enrollment
exports.createEnrollment = async (req, res) => {
  try {
    const { user, course, status } = req.body;

    if (!user || !course) {
      return res.status(400).json({ success: false, message: 'User and Course are required' });
    }

    const alreadyExists = await Enrollment.findOne({ user, course });
    if (alreadyExists) {
      return res.status(400).json({ success: false, message: 'User already enrolled in this course' });
    }

    const newEnrollment = await Enrollment.create({ user, course, status });
    res.status(201).json({ success: true, data: newEnrollment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// 📖 Get all enrollments
exports.getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find().populate('user').populate('course');
    res.status(200).json({ success: true, data: enrollments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// 📖 Get a single enrollment by ID
exports.getEnrollmentsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const enrollments = await Enrollment.find({ user: userId })
      .populate('user')
      .populate('course');

    if (enrollments.length === 0) {
      return res.status(404).json({ success: false, message: 'No enrollments found for this user' });
    }

    res.status(200).json({ success: true, data: enrollments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};


// ✏️ Update enrollment status
exports.updateEnrollmentByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    const updated = await Enrollment.findOneAndUpdate(
      { user: userId },
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Enrollment not found for this user' });
    }

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};


// ❌ Delete enrollment
exports.deleteEnrollmentByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const deleted = await Enrollment.deleteMany({ user: userId });

    if (deleted.deletedCount === 0) {
      return res.status(404).json({ success: false, message: 'No enrollments found to delete for this user' });
    }

    res.status(200).json({ success: true, message: 'Enrollment(s) deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};


// ✅ Create Certificate with image upload
exports.createCertificate = async (req, res) => {
  try {
    const { user, course } = req.body;

    if (!user || !course) {
      return res.status(400).json({ success: false, message: "User and Course are required." });
    }

    let imageUrl = null;
    if (req.file) {
      imageUrl = await uploadImage(req.file.buffer); // Upload to Cloudinary
    }

    const newCertificate = await Certificate.create({
      user,
      course,
      status: {
        image: imageUrl || null,
        type: "Pending" // Optional: default handled by schema
      }
    });

    res.status(201).json({ success: true, message: "Certificate created", data: newCertificate });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ✅ Get all certificates
exports.getAllCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find()
      
    res.status(200).json({ success: true, data: certificates });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ✅ Get certificate by userId
exports.getCertificateByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const certificate = await Certificate.findOne({ user: userId })
      .populate("user")
      .populate("course");

    if (!certificate) {
      return res.status(404).json({ success: false, message: "Certificate not found for this user" });
    }

    res.status(200).json({ success: true, data: certificate });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ✅ Update certificate by userId
exports.updateCertificateByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    const updateData = {};
    if (status) {
      updateData["status.type"] = status; // Update status type like "completed"
    }

    if (req.file) {
      const imageUrl = await uploadImage(req.file.buffer);
      updateData["status.image"] = imageUrl; // Replace old image with new one
    }

    const updated = await Certificate.findOneAndUpdate(
      { user: userId },
      { $set: updateData },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Certificate not found for this user" });
    }

    res.status(200).json({ success: true, message: "Certificate updated", data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ✅ Delete certificate by userId
exports.deleteCertificateByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const deleted = await Certificate.findOneAndDelete({ user: userId });

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Certificate not found for this user" });
    }

    res.status(200).json({ success: true, message: "Certificate deleted", data: deleted });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};