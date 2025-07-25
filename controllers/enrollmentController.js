const Enrollment = require('../models/enrollment');

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
exports.getEnrollmentById = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id).populate('user').populate('course');
    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Enrollment not found' });
    }
    res.status(200).json({ success: true, data: enrollment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ✏️ Update enrollment status
exports.updateEnrollment = async (req, res) => {
  try {
    const { status } = req.body;

    const updated = await Enrollment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Enrollment not found' });
    }

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ❌ Delete enrollment
exports.deleteEnrollment = async (req, res) => {
  try {
    const deleted = await Enrollment.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Enrollment not found' });
    }

    res.status(200).json({ success: true, message: 'Enrollment deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
