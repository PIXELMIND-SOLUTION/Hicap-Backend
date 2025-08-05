const { Enrollment, Certificate } = require('../models/enrollment');
const { uploadImage, uploadToCloudinary } = require('../config/cloudinary');
const mongoose = require('mongoose');
const userRegister = require("../models/registerUser"); 

// ➕ Create new enrollment
exports.createEnrollment = async (req, res) => {
  try {
    const { user, course, status, performance } = req.body;

    if (!user || !course) {
      return res.status(400).json({
        success: false,
        message: 'User and Course are required'
      });
    }

    const alreadyExists = await Enrollment.findOne({ user, course });
    if (alreadyExists) {
      return res.status(400).json({
        success: false,
        message: 'User already enrolled in this course'
      });
    }

    const enrollmentData = {
      user,
      course,
      status: status || 'enrolled'
    };

    if (performance && typeof performance === 'object') {
      enrollmentData.performance = {
        theoreticalPercentage: performance.theoreticalPercentage || 0,
        practicalPercentage: performance.practicalPercentage || 0,
        feedback: performance.feedback || '',
        grade: performance.grade || '',
        completedAt: performance.completedAt || null,
        courseTopic: performance.courseTopic || ''
      };
    }

    const newEnrollment = await Enrollment.create(enrollmentData);

    return res.status(201).json({
      success: true,
      message: 'Enrollment created successfully',
      data: newEnrollment
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
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

// 📖 Get enrolled courses by user
exports.getEnrolledCoursesByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    // Get all enrollments and populate course details
    const enrollments = await Enrollment.find({ user: userId }).populate('course');

    if (!enrollments || enrollments.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No enrolled courses found'
      });
    }

    // Extract status and rank
    const enrolledCourses = enrollments.map((e) => ({
      status: e.status,
      rank: e.rank,
      course: e.course, // optional, if you want course details too
    }));

    res.status(200).json({
      success: true,
      data: enrolledCourses,
      count: enrolledCourses.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};


// 📊 Get top performers by practicalPercentage in a course
exports.getTopPracticalPerformersInCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!courseId) {
      return res.status(400).json({ success: false, message: "Course ID is required" });
    }

    let enrollments = await Enrollment.find({ course: courseId }).populate("user");

    if (!enrollments || enrollments.length === 0) {
      return res.status(404).json({ success: false, message: "No users enrolled" });
    }

    enrollments.sort((a, b) => {
      if (b.performance.practicalPercentage === a.performance.practicalPercentage) {
        return b.performance.theoreticalPercentage - a.performance.theoreticalPercentage;
      }
      return b.performance.practicalPercentage - a.performance.practicalPercentage;
    });

    for (let i = 0; i < enrollments.length; i++) {
      enrollments[i].rank = i + 1;
      await enrollments[i].save();
    }

    res.status(200).json({
      success: true,
      count: enrollments.length,
      message: "Ranks assigned",
      data: enrollments,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ✏️ Update enrollment
exports.updateEnrolledByUserId = async (req, res) => {
  try {
    const { userId, courseId } = req.params;
    const { status, performance } = req.body;

    if (!userId || !courseId) {
      return res.status(400).json({
        success: false,
        message: 'Both userId and courseId are required'
      });
    }

    const existingEnrollment = await Enrollment.findOne({ user: userId, course: courseId });

    if (!existingEnrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    if (status) {
      existingEnrollment.status = status;
    }

    if (performance && typeof performance === 'object') {
      existingEnrollment.performance = {
        ...existingEnrollment.performance._doc,
        theoreticalPercentage: performance.theoreticalPercentage ?? existingEnrollment.performance.theoreticalPercentage,
        practicalPercentage: performance.practicalPercentage ?? existingEnrollment.performance.practicalPercentage,
        feedback: performance.feedback ?? existingEnrollment.performance.feedback,
        grade: performance.grade ?? existingEnrollment.performance.grade,
        completedAt: performance.completedAt ?? existingEnrollment.performance.completedAt,
        courseTopic: performance.courseTopic ?? existingEnrollment.performance.courseTopic
      };
    }

    const updatedEnrollment = await existingEnrollment.save();

    res.status(200).json({
      success: true,
      message: 'Enrollment updated successfully',
      data: updatedEnrollment
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// 📋 Get all users in a course
exports.getUsersEnrolledInCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!courseId) {
      return res.status(400).json({ success: false, message: 'Course ID is required' });
    }

    const enrollments = await Enrollment.find({ course: courseId }).populate('user');

    if (!enrollments || enrollments.length === 0) {
      return res.status(404).json({ success: false, message: 'No users found' });
    }

    const users = enrollments.map((e) => e.user);

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ❌ Delete enrollment
exports.deleteEnrollmentByUserIdAndCourseId = async (req, res) => {
  try {
    const { userId, courseId } = req.params;

    if (!userId || !courseId) {
      return res.status(400).json({
        success: false,
        message: 'Both userId and courseId are required'
      });
    }

    const deleted = await Enrollment.findOneAndDelete({ user: userId, course: courseId });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'No enrollment found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Enrollment deleted',
      data: deleted
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
// @desc    Create a certificate
// @route   POST /api/certificates
// ✅ Create Certificate
// ➕ Create certificate entry
exports.createCertificate = async (req, res) => {
  try {
    const { certificates } = req.body;
    const files = req.files;

    if (!certificates || !files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Certificates and images are required"
      });
    }

    const parsedCertificates = JSON.parse(certificates);

    if (!Array.isArray(parsedCertificates) || parsedCertificates.length !== files.length) {
      return res.status(400).json({
        success: false,
        message: "Certificates should be an array and must match the number of uploaded images"
      });
    }

    const finalCertificates = [];

    for (let i = 0; i < parsedCertificates.length; i++) {
      const cert = parsedCertificates[i];
      const imageBuffer = files[i].buffer;

      const imageUrl = await uploadImage(imageBuffer);

      finalCertificates.push({
        user: cert.user,
        enrollment: cert.enrollment,
        status: {
          image: imageUrl,
          type: cert.status?.type || "Pending"
        }
      });
    }

    const newCertificate  = new Certificate({ certificates: finalCertificates });
    await newCertificate.save();

    res.status(201).json({
      success: true,
      message: "Certificates uploaded and saved successfully",
      data: newCertificate
    });

  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message
    });
  }
};

// 📖 Get all Certificate Groups
exports.getAllCertificates = async (req, res) => {
   try {
    const all = await Certificate.find()
      .populate('certificates.user')       // this only works if User model is registered
      .populate('certificates.enrollment'); // same for Enrollment

    res.status(200).json({ success: true, data: all });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch',
      error: err.message
    });
  }
};
// 📖 Get Certificate Group by User ID
exports.getCertificateByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const group = await Certificate.findOne({ "certificates.user": userId });
    if (!group) {
      return res.status(404).json({ success: false, message: "Certificate not found" });
    }

    res.status(200).json({ success: true, data: group });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error", error: err.message });
  }
};

// ✏️ Update User's Certificate in Group
exports.updateCertificateByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const { statusType } = req.body;
    const file = req.files[0]; // Only updating one image

    const group = await Certificate.findOne({ "certificates.user": userId });
    if (!group) return res.status(404).json({ success: false, message: "User certificate not found" });

    const cert = group.certificates.find(c => c.user.toString() === userId);
    if (!cert) return res.status(404).json({ success: false, message: "Certificate not found for user" });

    if (statusType) cert.status.type = statusType;
    if (file) cert.status.image = await uploadImage(file.buffer);

    await group.save();

    res.status(200).json({ success: true, message: "Certificate updated", data: cert });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error", error: err.message });
  }
};



// 🗑️ Delete Certificate by User ID (removes entire group)
exports.deleteCertificateByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const deleted = await Certificate.findOneAndDelete({ "certificates.user": userId });

    if (!deleted) return res.status(404).json({ success: false, message: "No matching certificate found" });

    res.status(200).json({ success: true, message: "Certificate deleted", data: deleted });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error", error: err.message });
  }
};

// 🗑️ Delete Certificate by Certificate ID (removes individual certificate from group)
exports.deleteCertificateById = async (req, res) => {
  try {
    const { id } = req.params;

    const certificateGroup = await Certificate.findOne({ "certificates._id": id });
    if (!certificateGroup) {
      return res.status(404).json({ success: false, message: "Certificate not found" });
    }

    certificateGroup.certificates = certificateGroup.certificates.filter(c => c._id.toString() !== id);
    await certificateGroup.save();

    res.status(200).json({ success: true, message: "Certificate entry deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error", error: err.message });
  }
};