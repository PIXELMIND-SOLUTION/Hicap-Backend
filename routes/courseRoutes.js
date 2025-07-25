const express = require('express');
const router = express.Router();
const { processFiles } = require('../utils/fileHandler');const courseController = require('../controllers/courseController');

// Create Course
router.post(
  '/',
  processFiles,
  courseController.createCourse
);

// // Get All Courses
// router.get('/', courseController.getAllCourses);

// // Get Single Course
// router.get('/:id', courseController.getCourseById);

// // Update Course
// router.put(
//   '/:id',
//   upload.any(),
//   processFormData,
//   courseController.updateCourse
// );

// // Delete Course
// router.delete('/:id', courseController.deleteCourse);

module.exports = router;