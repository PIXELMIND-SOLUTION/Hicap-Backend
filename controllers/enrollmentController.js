const {Enrollment,Certificate} = require('../models/enrollment');
const { uploadImage } = require('../config/cloudinary');
const mongoose = require('mongoose');



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



// @desc    Create a certificate
// @route   POST /api/certificates
// ✅ Create Certificate
exports.createCertificate = async (req, res) => {
  try {
    const { userId, enrollmentId, type } = req.body;

    if (!userId || !enrollmentId || !type) {
      return res.status(400).json({ success: false, message: "userId, enrollmentId and type are required" });
    }

    let imageUrl = null;
    if (req.file) {
      imageUrl = await uploadImage(req.file.buffer);
    }

    const certificate = new Certificate({
      user: userId,
      enrollment: enrollmentId,
      status: {
        image: imageUrl,
        type: type,
      }
    });

    const savedCertificate = await certificate.save();

    res.status(201).json({ success: true, message: "Certificate created", data: savedCertificate });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// ✅ Get All Certificates
exports.getAllCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find().populate("user enrollment");
    res.status(200).json({ success: true, data: certificates });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// ✅ Get Certificate by UserId
exports.getCertificateByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const certificate = await Certificate.findOne({ user: userId }).populate("user enrollment");

    if (!certificate) {
      return res.status(404).json({ success: false, message: "Certificate not found" });
    }

    res.status(200).json({ success: true, data: certificate });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// ✅ Update Certificate by UserId
exports.updateCertificateByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const { type } = req.body;

    let updateData = {};
    if (type) {
      updateData["status.type"] = type;
    }

    if (req.file) {
      const imageUrl = await uploadImage(req.file.buffer);
      updateData["status.image"] = imageUrl;
    }

    const updated = await Certificate.findOneAndUpdate(
      { user: userId },
      { $set: updateData },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Certificate not found" });
    }

    res.status(200).json({ success: true, message: "Certificate updated", data: updated });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// ✅ Delete Certificate by UserId
exports.deleteCertificateByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const deleted = await Certificate.findOneAndDelete({ user: userId });

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Certificate not found" });
    }

    res.status(200).json({ success: true, message: "Certificate deleted", data: deleted });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// ✅ Delete Certificate by ID
exports.deleteCertificateById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Deleting Certificate ID:", id); // 🔍 Debug log

    const deleted = await Certificate.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Certificate not found" });
    }

    res.status(200).json({ success: true, message: "Certificate deleted successfully", data: deleted });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};