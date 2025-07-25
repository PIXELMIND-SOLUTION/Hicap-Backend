const express = require('express');
const router = express.Router();
const { processFiles } = require('../utils/fileHandler');const courseController = require('../controllers/courseController');

// Create Course
router.post(
  '/',
  processFiles,
  courseController.createCourse
);
router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);
router.put('/:id', processFiles, courseController.updateCourse);
router.delete('/:id', courseController.deleteCourse);

module.exports = router;