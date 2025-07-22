const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

const mentorController = require("../controllers/ourMentorsController");

// 🔥 EXPERIENCE ROUTES - define FIRST to avoid :id conflicts
router.post("/Experience", upload.single("image"), mentorController.createMentorExperience);
router.get("/Experience", mentorController.getAllMentorExperiences);
router.get("/Experience/:id", mentorController.getMentorExperienceById);
router.put("/Experience/:id", upload.single("image"), mentorController.updateMentorExperience);
router.delete("/Experience/:id", mentorController.deleteMentorExperience);

// 🔧 OUR MENTOR ROUTES - define AFTER specific routes
router.post("/", upload.single("image"), mentorController.createMentor);
router.get("/", mentorController.getAllMentors);
router.get("/:id", mentorController.getMentorById);
router.put("/:id", upload.single("image"), mentorController.updateMentor);
router.delete("/:id", mentorController.deleteMentor);

module.exports = router;
