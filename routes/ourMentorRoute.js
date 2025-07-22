const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

const mentorController = require("../controllers/ourMentorsController");

// 🔥 EXPERIENCE ROUTES - define FIRST to avoid :id conflicts
router.post("/experience", upload.single("image"), mentorController.createMentorExperience);
router.get("/experience", mentorController.getAllMentorExperiences);
router.get("/experience/:id", mentorController.getMentorExperienceById);
router.put("/experience/:id", upload.single("image"), mentorController.updateMentorExperience);
router.delete("/experience/:id", mentorController.deleteMentorExperience);

// 🔧 OUR MENTOR ROUTES - define AFTER specific routes
router.post("/", upload.single("image"), mentorController.createMentor);
router.get("/", mentorController.getAllMentors);
router.get("/:id", mentorController.getMentorById);
router.put("/:id", upload.single("image"), mentorController.updateMentor);
router.delete("/:id", mentorController.deleteMentor);

module.exports = router;
