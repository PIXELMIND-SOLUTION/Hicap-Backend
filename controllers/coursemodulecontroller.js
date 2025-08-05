const CourseModule = require('../models/courseModuleSchema');

// ➕ CREATE Course Module
exports.createCourseModule = async (req, res) => {
  try {
    const { enrollment, course, modules } = req.body;

    if (!enrollment || !course || !modules) {
      return res.status(400).json({
        success: false,
        message: 'enrollment, course, and modules are required',
      });
    }

    const newCourseModule = new CourseModule({ enrollment, course, modules });
    await newCourseModule.save();

    return res.status(201).json({
      success: true,
      message: 'Course module created successfully',
      data: newCourseModule,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 📥 READ all Course Modules
exports.getAllCourseModules = async (req, res) => {
  try {
    const modules = await CourseModule.find().populate('enrollment course');

    return res.status(200).json({
      success: true,
      message: 'All course modules fetched successfully',
      data: modules,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 📥 READ Course Module by ID
exports.getCourseModuleById = async (req, res) => {
  try {
    const module = await CourseModule.findById(req.params.id).populate('enrollment course');

    if (!module) {
      return res.status(404).json({ success: false, message: 'Course module not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Course module fetched successfully',
      data: module,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 🔁 UPDATE Course Module
exports.updateCourseModule = async (req, res) => {
  try {
    const updatedModule = await CourseModule.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedModule) {
      return res.status(404).json({ success: false, message: 'Course module not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Course module updated successfully',
      data: updatedModule,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ❌ DELETE Course Module
exports.deleteCourseModule = async (req, res) => {
  try {
    const deleted = await CourseModule.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Course module not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Course module deleted successfully',
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};