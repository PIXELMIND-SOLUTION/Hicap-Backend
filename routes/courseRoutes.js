const express = require('express');
const router = express.Router();
const multer = require("multer");
// Multer for buffer uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });
const { processFiles } = require('../utils/fileHandler');
const Controller = require('../controllers/enrollmentController');                              





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





module.exports = router;