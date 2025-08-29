const express = require('express');
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });
const enrollmentController = require('../controllers/enrollmentController');

// Enrollment routes
router.post('/enrollments', enrollmentController.createEnrollment);
router.get('/enrollments', enrollmentController.getAllEnrollments);
router.get("/enrollment/:id", enrollmentController.getEnrollmentById);
router.put('/enrollments/:id', enrollmentController.updateEnrolledByUserId);
router.delete('/enrollments/:id', enrollmentController.deleteEnrollmentById);

// User enrollment routes
router.post('/enrollments/add-user', enrollmentController.addEnrollmentToUser);
router.get('/user/:userId/enrollments', enrollmentController.getEnrollmentsByUserId);

// Mentor enrollment routes
// ➕ Add mentor to enrollment
router.post('/mentor/enrollment/add', enrollmentController.addMentorToEnrollment);

// 🗑️ Remove mentor from enrollment
router.post('/mentor/enrollment/remove', enrollmentController.removeMentorFromEnrollment);// 📋 Get all enrollments for a specific mentor
router.get('/mentor/:mentorId/enrollments', enrollmentController.getEnrollmentsByMentorId);
router.get('/enrollment/:enrollmentId/mentors', enrollmentController.getEnrollmentMentors);

// 👥 Get all mentors with their batch information
router.get('/mentors/with-batches', enrollmentController.getAllMentorsWithBatches);
router.get('/mentor/:mentorId/details', enrollmentController.getMentorWithDetailedBatches);



// Certificate routes
router.post("/certificate", upload.array("images"), enrollmentController.createCertificate);
router.get("/certificates", enrollmentController.getAllCertificates);
router.get("/certificate/user/:userId", enrollmentController.getCertificateByUserId);
router.put("/certificate/user/:userId", upload.array("images"), enrollmentController.updateCertificateByUserId);
router.delete("/certificate/user/:userId", enrollmentController.deleteCertificateByUserId);
router.delete("/certificate/:id", enrollmentController.deleteCertificateById);

module.exports = router;