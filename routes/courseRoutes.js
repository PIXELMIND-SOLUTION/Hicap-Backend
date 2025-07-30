const express = require('express');
const router = express.Router();
const { processFiles } = require('../utils/fileHandler');const courseController = require('../controllers/courseController');
const Controller = require('../controllers/enrollmentController');
const upload = require('../utils/uploadMiddleware');

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


router.post('/enrollments', Controller.createEnrollment);
router.get('/enrollments', Controller.getAllEnrollments);
router.get('/enrollments/:userId', Controller.getEnrollmentsByUserId);
router.put('/enrollments/:userId', Controller.updateEnrollmentByUserId);
router.delete('/enrollments/:userId', Controller.deleteEnrollmentByUserId);

// ➕ Create Certificate with image upload
router.post("/Certificate", upload.single("image"), Controller.createCertificate);

// 📖 Get all Certificates
router.get("/Certificates", Controller.getAllCertificates);

// 📖 Get Certificate by ID
router.get("/Certificate/:userId", Controller.getCertificateByUserId);




// Update user's specific certificate
router.put(
  "/Certificate/:userId", upload.single("image"),
  Controller.updateCertificateByUserId
);


// Delete user's specific certificate
router.delete(
  "/Certificate/:userId",
  Controller.deleteCertificateByUserId
);

// DELETE: Delete certificate by Certificate ID
router.delete("/Certificate/deleteById/:id", Controller.deleteCertificateById);


module.exports = router;