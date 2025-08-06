const CourseModule = require('../models/courseModuleSchema');

// ➕ Create Course Module
exports.createCourseModule = async (req, res) => {
  try {
    const { user, enrollment, course, modules } = req.body;

    if (!user || !enrollment || !course || !modules) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const newModule = await CourseModule.create({ user, enrollment, course, modules });

    return res.status(201).json({ success: true, data: newModule });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 📥 Get All Course Modules
exports.getAllCourseModules = async (req, res) => {
  try {
    const modules = await CourseModule.find()
      .populate('user')
      .populate('enrollment')
      .populate('course');

    return res.status(200).json({ success: true, data: modules });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 🔍 Get Course Module by ID
exports.getCourseModuleById = async (req, res) => {
  try {
    const { id } = req.params;

    const module = await CourseModule.findById(id)
      .populate('user')
      .populate('enrollment')
      .populate('course');

    if (!module) {
      return res.status(404).json({ success: false, message: 'Course Module not found' });
    }

    return res.status(200).json({ success: true, data: module });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 🔍 Get Course Modules by User ID
exports.getCourseModulesByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const modules = await CourseModule.find({ user: userId })
      .populate('user')
      .populate('enrollment')
      .populate('course');

    if (!modules || modules.length === 0) {
      return res.status(404).json({ success: false, message: 'No course modules found for this user' });
    }

    return res.status(200).json({ success: true, data: modules });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ✏️ Update Course Module by ID
exports.updateCourseModuleById = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updated = await CourseModule.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Course Module not found' });
    }

    return res.status(200).json({ success: true, data: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ❌ Delete Course Module by ID
exports.deleteCourseModuleById = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await CourseModule.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Course Module not found' });
    }

    return res.status(200).json({ success: true, message: 'Course Module deleted successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};