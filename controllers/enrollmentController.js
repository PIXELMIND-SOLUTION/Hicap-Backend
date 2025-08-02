const {Enrollment,Certificate} = require('../models/enrollment');
const { uploadImage } = require('../config/cloudinary');
const mongoose = require('mongoose');



// ➕ Create new enrollment
exports.createEnrollment = async (req, res) => {
  try {
    const { user, course, status, performance } = req.body;

    // Required validation
    if (!user || !course) {
      return res.status(400).json({
        success: false,
        message: 'User and Course are required'
      });
    }

    // Check if enrollment already exists
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

    // Handle performance object if present
    if (performance && typeof performance === 'object') {
      enrollmentData.performance = {
        theoreticalPercentage: performance.theoreticalPercentage || 0,
        practicalPercentage: performance.practicalPercentage || 0,
        feedback: performance.feedback || '',
        grade: performance.grade || '',
        completedAt: performance.completedAt || null
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
    const enrollments = await Enrollment.find()
      .populate('user')
      .populate('course');
    res.status(200).json({ success: true, data: enrollments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// 📖 Get a single enrollment by ID
exports.getEnrolledCoursesByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required in the URL'
      });
    }

    // Find enrollments and populate course only
    const enrollments = await Enrollment.find({ user: userId }).populate('course');

    if (!enrollments || enrollments.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No enrolled courses found for this user'
      });
    }

    // Extract course data only
    const enrolledCourses = enrollments.map((enroll) => enroll.course);

    res.status(200).json({
      success: true,
      data: enrolledCourses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
// 📊 Get top performers by practicalPercentage in a specific course
exports.getTopPracticalPerformersInCourse = async (req, res) => {
   try {
    const { courseId } = req.params;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required in the URL",
      });
    }

    // 1. Fetch all enrollments for the course and populate user
    let enrollments = await Enrollment.find({ course: courseId }).populate("user");

    if (!enrollments || enrollments.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No users enrolled in this course",
      });
    }

    // 2. Custom sort: primary -> practical, secondary -> theoretical
    enrollments.sort((a, b) => {
      if (
        b.performance.practicalPercentage === a.performance.practicalPercentage
      ) {
        return b.performance.theoreticalPercentage - a.performance.theoreticalPercentage;
      }
      return b.performance.practicalPercentage - a.performance.practicalPercentage;
    });

    // 3. Assign ranks and save
    for (let i = 0; i < enrollments.length; i++) {
      enrollments[i].rank = i + 1;
      await enrollments[i].save();
    }

    res.status(200).json({
      success: true,
      count: enrollments.length,
      message: "Ranks assigned based on practicalPercentage and tiebreaker theoreticalPercentage",
      data: enrollments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};




// ✏️ Update enrollment status
exports.updateEnrolledByUserId = async (req, res) => {
  try {
    const { userId, courseId } = req.params;
    const { status, performance } = req.body;

    if (!userId || !courseId) {
      return res.status(400).json({
        success: false,
        message: 'Both userId and courseId are required in params'
      });
    }

    const existingEnrollment = await Enrollment.findOne({ user: userId, course: courseId });

    if (!existingEnrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found for this user and course'
      });
    }

    // Update status if provided
    if (status) {
      existingEnrollment.status = status;
    }

    // Update performance fields if provided
    if (performance && typeof performance === 'object') {
      existingEnrollment.performance = {
        ...existingEnrollment.performance._doc, // keep existing values
        theoreticalPercentage: performance.theoreticalPercentage ?? existingEnrollment.performance.theoreticalPercentage,
        practicalPercentage: performance.practicalPercentage ?? existingEnrollment.performance.practicalPercentage,
        feedback: performance.feedback ?? existingEnrollment.performance.feedback,
        grade: performance.grade ?? existingEnrollment.performance.grade,
        completedAt: performance.completedAt ?? existingEnrollment.performance.completedAt
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


// 📋 Get all users enrolled in a specific course
exports.getUsersEnrolledInCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: 'Course ID is required in the URL',
      });
    }

    const enrollments = await Enrollment.find({ course: courseId }).populate('user');

    if (!enrollments || enrollments.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No users enrolled in this course',
      });
    }

    // Extract only user details
    const enrolledUsers = enrollments.map((enroll) => enroll.user);

    res.status(200).json({
      success: true,
      count: enrolledUsers.length,
      data: enrolledUsers,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};



// ❌ Delete enrollment
exports.deleteEnrollmentByUserIdAndCourseId = async (req, res) => {
  try {
    const { userId, courseId } = req.params;

    if (!userId || !courseId) {
      return res.status(400).json({
        success: false,
        message: 'Both userId and courseId are required in the URL'
      });
    }

    const deletedEnrollment = await Enrollment.findOneAndDelete({ user: userId, course: courseId });

    if (!deletedEnrollment) {
      return res.status(404).json({
        success: false,
        message: 'No enrollment found for this user and course'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Enrollment deleted successfully',
      data: deletedEnrollment
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
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