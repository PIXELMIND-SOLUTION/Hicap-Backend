const express = require('express');
const router = express.Router();
const { upload, processFormData } = require('../utils/uplodemw');
const courseController = require('../controllers/courseController');

// Create Course
router.post(
  '/',
  upload.any(), // Accept all files
  processFormData,
  courseController.createCourse
);

// Get All Courses
router.get('/', courseController.getAllCourses);

// Get Single Course
router.get('/:id', courseController.getCourseById);

// Update Course
router.put(
  '/:id',
  upload.any(),
  processFormData,
  courseController.updateCourse
);

// Delete Course
router.delete('/:id', courseController.deleteCourse);

module.exports = router;