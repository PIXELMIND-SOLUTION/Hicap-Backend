const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer(); 
const controller = require("../controllers/interviewController");

router.post("/interviews", upload.single("image"), controller.createInterview);
router.get("/interviews", controller.getAllInterviews);
router.get("/interviews/:id", controller.getInterviewById);
router.put("/interviews/:id", upload.single("image"), controller.updateInterview);
router.delete("/interviews/:id", controller.deleteInterview);

module.exports = router;
