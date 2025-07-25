const express = require('express');
const router = express.Router();
const { processFiles } = require('../utils/fileHandler');const courseController = require('../controllers/courseController');
const enrollmentController = require('../controllers/enrollmentController');
// Create Course
router.post(
  '/course1',
  processFiles,
  courseController.createCourse
);
router.get('/course1', courseController.getAllCourses);
router.get('/course1/:id', courseController.getCourseById);
router.put('/course1/:id', processFiles, courseController.updateCourse);
router.delete('/course1/:id', courseController.deleteCourse);


router.post('/enrollments', enrollmentController.createEnrollment);
router.get('/enrollments', enrollmentController.getAllEnrollments);
router.get('/enrollments/:id', enrollmentController.getEnrollmentById);
router.put('/enrollments/:id', enrollmentController.updateEnrollment);
router.delete('/enrollments/:id', enrollmentController.deleteEnrollment);



module.exports = router;