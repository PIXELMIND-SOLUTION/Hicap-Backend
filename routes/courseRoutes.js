const express = require('express');
const router = express.Router();
const { processFiles } = require('../utils/fileHandler');const courseController = require('../controllers/courseController');
const Controller = require('../controllers/enrollmentController');
const upload = require('../utils/uploadMiddleware');
const controller = require('../controllers/coursemodulecontroller');
const uploadVideo = require('../utils/multer'); // ✅ Add this line



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
router.get('/enrollments/top-practical/:courseId', Controller.getTopPracticalPerformersInCourse);
router.get('/enrollments/:courseId/users', Controller.getUsersEnrolledInCourse);
router.get('/enrollments/:userId', Controller.getEnrolledCoursesByUser);

router.put('/enrollments/:userId/:courseId', Controller.updateEnrolledByUserId);
router.delete('/enrollments/:userId/:courseId', Controller.deleteEnrollmentByUserIdAndCourseId);

// ➕ Create Certificate with image upload
router.post("/Certificate", upload.array("images"), Controller.createCertificate);

// 📖 Get all Certificates
router.get("/Certificates", Controller.getAllCertificates);

// 📖 Get Certificate by ID
router.get("/Certificate/:userId", Controller.getCertificateByUserId);




// Update user's specific certificate
router.put(
  "/Certificate/:userId", upload.array("images"),
  Controller.updateCertificateByUserId
);




// Delete user's specific certificate
router.delete(
  "/Certificate/:userId",
  Controller.deleteCertificateByUserId
);

// DELETE: Delete certificate by Certificate ID
router.delete("/Certificate/deleteById/:id", Controller.deleteCertificateById);


router.post('/course-module', uploadVideo.any(), controller.createCourseModule);


// 📄 READ ALL
router.get('/course-module', controller.getAllCourseModules);

// 📄 READ ONE
router.get('/course-module/:id', controller.getCourseModuleById);

// ✏️ UPDATE (with video re-uploads)
router.put(
  '/course-module/:id',
  uploadVideo.any(),
  controller.updateCourseModule
);

// ❌ DELETE
router.delete('/course-module/:id', controller.deleteCourseModule);

module.exports = router;