const { Enrollment, Certificate } = require('../models/enrollment');
const { uploadImage, uploadToCloudinary } = require('../config/cloudinary');
const mongoose = require('mongoose');
const userRegister = require("../models/registerUser"); 
const {Course} = require("../models/coursesModel");


// ➕ Create new enrollment
exports.createEnrollment = async (req, res) => {
  try {
    const { batchNumber, batchName, courseId, startDate, timings, duration, category } = req.body;

    if (!batchNumber || !batchName || !courseId || !startDate || !timings || !duration || !category) {
      return res.status(400).json({
        success: false,
        message: "batchNumber, batchName, courseId, startDate, timings, duration, and category are required"
      });
    }

    // Validate courseId
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    const enrollment = new Enrollment({
      batchNumber,
      batchName,
      courseId,
      startDate,
      timings,
      duration,
      category
    });

    const savedEnrollment = await enrollment.save();
    const populatedEnrollment = await Enrollment.findById(savedEnrollment._id).populate("courseId");

    return res.status(201).json({
      success: true,
      message: "Enrollment created successfully",
      data: populatedEnrollment
    });
  } catch (error) {
    console.error("Error creating enrollment:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// 📖 Get all enrollments
exports.getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find().populate("courseId");
    return res.status(200).json({
      success: true,
      message: "All enrollments fetched successfully",
      data: enrollments
    });
  } catch (error) {
    console.error("Error fetching enrollments:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
// 🔍 Get enrollment by ID
exports.getEnrollmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const enrollment = await Enrollment.findById(id).populate("courseId");
    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Enrollment fetched successfully",
      data: enrollment
    });
  } catch (error) {
    console.error("Error fetching enrollment by ID:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};




// ✏️ Update enrollment
exports.updateEnrolledByUserId = async (req, res) => {
  try {
    const { id } = req.params;
    const { batchNumber, batchName, courseId, startDate, timings, duration, category } = req.body;

    const updateData = {};
    if (batchNumber) updateData.batchNumber = batchNumber;
    if (batchName) updateData.batchName = batchName;
    if (startDate) updateData.startDate = startDate;
    if (timings) updateData.timings = timings;
    if (duration) updateData.duration = duration;
    if (category) updateData.category = category;

    if (courseId) {
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ success: false, message: "Course not found" });
      }
      updateData.courseId = courseId;
    }

    const updatedEnrollment = await Enrollment.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    ).populate("courseId");

    if (!updatedEnrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Enrollment updated successfully",
      data: updatedEnrollment
    });
  } catch (error) {
    console.error("Error updating enrollment:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


// 🗑️ Delete enrollment by ID
exports.deleteEnrollmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedEnrollment = await Enrollment.findByIdAndDelete(id);
    if (!deletedEnrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Enrollment deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting enrollment:", error);
    return res.status(500).json({ success: false, message: "Server error" });
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

// 👤 Add User to Enrollment
exports.addEnrollmentToUser = async (req, res) => {
  try {
    const { enrollmentId, userId } = req.body;

    // 1️⃣ Validate user
    const user = await userRegister.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // 2️⃣ Validate enrollment
    const enrollment = await Enrollment.findById(enrollmentId);
    if (!enrollment) {
      return res.status(404).json({ success: false, message: "Enrollment not found" });
    }

    // 3️⃣ Add user to enrollment if not already enrolled
    const alreadyEnrolledInEnrollment = enrollment.enrolledUsers.some(
      (u) => u.toString() === userId
    );
    if (!alreadyEnrolledInEnrollment) {
      enrollment.enrolledUsers.push(userId);
      await enrollment.save();
    }

    // 4️⃣ Add enrollment to user's enrolledCourses if not already there
    const alreadyEnrolledInUser = user.enrolledCourses.some(
      (e) => e.toString() === enrollmentId
    );
    if (!alreadyEnrolledInUser) {
      user.enrolledCourses.push(enrollmentId);
      await user.save();
    }

    // 5️⃣ Populate enrolled users before sending response
    const updatedEnrollment = await Enrollment.findById(enrollmentId)
      .populate('enrolledUsers', 'fullName email');

    res.status(200).json({
      success: true,
      message: alreadyEnrolledInEnrollment
        ? "User already enrolled in this batch"
        : "User successfully added to enrollment",
      data: {
        _id: updatedEnrollment._id,
        batchNumber: updatedEnrollment.batchNumber,
        batchName: updatedEnrollment.batchName,
        enrolledUsers: updatedEnrollment.enrolledUsers,
        userCount: updatedEnrollment.enrolledUsers.length
      }
    });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};


// 👤 Get all enrollments for a user
exports.getEnrollmentsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate user
    const user = await userRegister.findById(userId).populate({
      path: 'enrolledCourses',
      select: 'batchNumber batchName startDate timings duration type categorie courseId',
      populate: {
        path: 'courseId', // populate full course details
        select: '-__v -createdAt -updatedAt' // select all course fields except unnecessary ones
      }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        fullName: user.firstName + " " + user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber
      },
      enrolledCourses: user.enrolledCourses
    });
  } catch (error) {
    console.error("Error fetching enrolled courses:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// 📋 Get all users in an enrollment
exports.getUsersByEnrollmentId = async (req, res) => {
  try {
    const { enrollmentId } = req.params;

    const enrollment = await Enrollment.findById(enrollmentId).populate('enrolledUsers', 'fullName email');

    if (!enrollment) {
      return res.status(404).json({ success: false, message: "Enrollment not found" });
    }

    res.status(200).json({
      success: true,
      enrollment: {
        _id: enrollment._id,
        batchNumber: enrollment.batchNumber,
        batchName: enrollment.batchName,
        startDate: enrollment.startDate,
        timings: enrollment.timings,
        duration: enrollment.duration,
      },

      enrolledUsers: enrollment.enrolledUsers,
      userCount: enrollment.enrolledUsers.length
    });
  } catch (error) {
    console.error("Error fetching enrolled users:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
