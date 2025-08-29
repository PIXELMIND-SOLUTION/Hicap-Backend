const { Enrollment, Certificate } = require('../models/enrollment');
const { uploadImage, uploadToCloudinary } = require('../config/cloudinary');
const mongoose = require('mongoose');
const userRegister = require("../models/registerUser"); 
const {Course} = require("../models/coursesModel");
const { OurMentor, MentorExperience ,Mentor} = require("../models/ourMentors");


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

exports.addMentorToEnrollment = async (req, res) => {
  try {
    const { enrollmentId, mentorId } = req.body;

    // Validate mentor
    const mentor = await Mentor.findById(mentorId);
    if (!mentor) return res.status(404).json({ success: false, message: "Mentor not found" });

    // Validate enrollment
    const enrollment = await Enrollment.findById(enrollmentId);
    if (!enrollment) return res.status(404).json({ success: false, message: "Enrollment not found" });

    // Initialize arrays if they don't exist
    if (!enrollment.assignedMentors) {
      enrollment.assignedMentors = [];
    }
    if (!mentor.enrolledBatches) {
      mentor.enrolledBatches = [];
    }
    if (!mentor.assignedCourses) {
      mentor.assignedCourses = [];
    }

    // Add mentor to enrollment if not already assigned
    if (!enrollment.assignedMentors.includes(mentorId)) {
      enrollment.assignedMentors.push(mentorId);
      await enrollment.save();
    }

    // Add enrollment to mentor's enrolledBatches if not already there
    if (!mentor.enrolledBatches.includes(enrollmentId)) {
      mentor.enrolledBatches.push(enrollmentId);
    }

    // Add enrollment to mentor's assignedCourses if not already there
    if (!mentor.assignedCourses.includes(enrollmentId)) {
      mentor.assignedCourses.push(enrollmentId);
    }

    await mentor.save();

    // Populate mentor and enrollment info for response
    const updatedMentor = await Mentor.findById(mentorId)
      .populate('enrolledBatches', 'batchNumber batchName startDate timings duration category')
      .populate('assignedCourses', 'batchNumber batchName startDate timings duration category');

    const updatedEnrollment = await Enrollment.findById(enrollmentId)
      .populate('assignedMentors', 'firstName lastName email phoneNumber expertise');

    res.status(200).json({
      success: true,
      message: "Mentor added to enrollment successfully",
      data: {
        mentor: {
          _id: updatedMentor._id,
          fullName: `${updatedMentor.firstName} ${updatedMentor.lastName}`,
          email: updatedMentor.email,
          phoneNumber: updatedMentor.phoneNumber,
          expertise: updatedMentor.expertise,
          enrolledBatches: updatedMentor.enrolledBatches,
          assignedCourses: updatedMentor.assignedCourses
        },
        enrollment: {
          _id: updatedEnrollment._id,
          batchNumber: updatedEnrollment.batchNumber,
          batchName: updatedEnrollment.batchName,
          assignedMentors: updatedEnrollment.assignedMentors
        }
      }
    });

  } catch (error) {
    console.error("Error adding mentor:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
exports.getEnrollmentsByMentorId = async (req, res) => {
  try {
    const { mentorId } = req.params;

    const mentor = await Mentor.findById(mentorId)
      .populate({
        path: 'enrolledBatches',
        select: 'batchNumber batchName startDate timings duration category courseId enrolledUsers',
        populate: [
          {
            path: 'courseId',
            select: 'title description price duration level'
          },
          {
            path: 'enrolledUsers',
            model: 'userRegister', // Fixed model name
            select: 'firstName lastName email phoneNumber'
          }
        ]
      })
      .populate({
        path: 'assignedCourses',
        select: 'batchNumber batchName startDate timings duration category courseId enrolledUsers',
        populate: [
          {
            path: 'courseId',
            select: 'title description price duration level'
          },
          {
            path: 'enrolledUsers',
            model: 'userRegister', // Fixed model name
            select: 'firstName lastName email phoneNumber'
          }
        ]
      });

    if (!mentor) {
      return res.status(404).json({ success: false, message: "Mentor not found" });
    }

    res.status(200).json({
      success: true,
      mentor: {
        _id: mentor._id,
        fullName: `${mentor.firstName} ${mentor.lastName}`,
        email: mentor.email,
        phoneNumber: mentor.phoneNumber,
        expertise: mentor.expertise
      },
      enrolledBatches: mentor.enrolledBatches,
      assignedCourses: mentor.assignedCourses,
      stats: {
        totalBatches: mentor.enrolledBatches.length,
        totalAssignedCourses: mentor.assignedCourses.length,
        totalStudents: mentor.assignedCourses.reduce((total, course) => 
          total + (course.enrolledUsers ? course.enrolledUsers.length : 0), 0)
      }
    });

  } catch (error) {
    console.error("Error fetching mentor's courses:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Remove mentor from enrollment
exports.removeMentorFromEnrollment = async (req, res) => {
  try {
    const { enrollmentId, mentorId } = req.body;

    const enrollment = await Enrollment.findById(enrollmentId);
    const mentor = await Mentor.findById(mentorId);

    if (!enrollment || !mentor) {
      return res.status(404).json({ success: false, message: "Enrollment or Mentor not found" });
    }

    // Remove mentor from enrollment
    enrollment.assignedMentors = enrollment.assignedMentors.filter(
      id => id.toString() !== mentorId
    );

    // Remove enrollment from mentor
    mentor.enrolledBatches = mentor.enrolledBatches.filter(
      id => id.toString() !== enrollmentId
    );
    mentor.assignedCourses = mentor.assignedCourses.filter(
      id => id.toString() !== enrollmentId
    );

    await enrollment.save();
    await mentor.save();

    res.status(200).json({
      success: true,
      message: "Mentor removed from enrollment successfully"
    });

  } catch (error) {
    console.error("Error removing mentor:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Get all mentors for an enrollment
exports.getEnrollmentMentors = async (req, res) => {
  try {
    const { enrollmentId } = req.params;

    const enrollment = await Enrollment.findById(enrollmentId)
      .populate('assignedMentors', 'firstName lastName email phoneNumber expertise');

    if (!enrollment) {
      return res.status(404).json({ success: false, message: "Enrollment not found" });
    }

    res.status(200).json({
      success: true,
      data: {
        enrollmentId: enrollment._id,
        batchName: enrollment.batchName,
        assignedMentors: enrollment.assignedMentors
      }
    });

  } catch (error) {
    console.error("Error fetching enrollment mentors:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Get all mentors with their batch information
exports.getAllMentorsWithBatches = async (req, res) => {
  try {
    const mentors = await Mentor.find()
      .select('-password')
      .populate({
        path: 'enrolledBatches',
        select: 'batchNumber batchName startDate category',
        populate: {
          path: 'courseId',
          select: 'title duration'
        }
      })
      .populate({
        path: 'assignedCourses',
        select: 'batchNumber batchName',
        populate: {
          path: 'enrolledUsers',
          model: 'userRegister', // ✅ Correct model name
          select: 'firstName lastName',
          options: { limit: 5 }
        }
      });

    res.status(200).json({
      success: true,
      data: mentors,
      totalMentors: mentors.length
    });

  } catch (error) {
    console.error("Error fetching mentors:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Get specific mentor with detailed batch info
exports.getMentorWithDetailedBatches = async (req, res) => {
  try {
    const { mentorId } = req.params;

    const mentor = await Mentor.findById(mentorId)
      .select('-password')
      .populate({
        path: 'enrolledBatches',
        select: 'batchNumber batchName startDate timings duration category courseId enrolledUsers',
        populate: [
          {
            path: 'courseId',
            select: 'title description price duration level'
          },
          {
            path: 'enrolledUsers',
            model: 'userRegister', // ✅ Correct model name
            select: 'firstName lastName email phoneNumber'
          }
        ]
      });

    if (!mentor) {
      return res.status(404).json({ success: false, message: "Mentor not found" });
    }

    res.status(200).json({
      success: true,
      mentor: {
        _id: mentor._id,
        fullName: `${mentor.firstName} ${mentor.lastName}`,
        email: mentor.email,
        phoneNumber: mentor.phoneNumber,
        expertise: mentor.expertise,
        createdAt: mentor.createdAt,
        updatedAt: mentor.updatedAt
      },
      teachingSchedule: mentor.enrolledBatches.map(batch => ({
        batchNumber: batch.batchNumber,
        batchName: batch.batchName,
        startDate: batch.startDate,
        timings: batch.timings,
        duration: batch.duration,
        studentsCount: batch.enrolledUsers ? batch.enrolledUsers.length : 0,
        category: batch.category
      })),
      performanceMetrics: {
        totalBatches: mentor.enrolledBatches.length,
        totalStudents: mentor.enrolledBatches.reduce((total, batch) =>
          total + (batch.enrolledUsers ? batch.enrolledUsers.length : 0), 0)
      }
    });

  } catch (error) {
    console.error("Error fetching mentor details:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};