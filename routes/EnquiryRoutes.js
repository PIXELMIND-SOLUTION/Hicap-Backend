const express = require('express');
const router = express.Router();
const upload = require('../utils/uploadMiddleware'); // multer middleware

const {
  createEnquiry,
  getEnquiries,
  getEnquiryById,
  updateEnquiry,
  deleteEnquiry
} = require('../controllers/EnquiryController');
const doubtSessionController = require("../controllers/doubtSessionController");


router.post('/Enquiry', createEnquiry);
router.get('/Enquiry', getEnquiries);
router.get('/Enquiry/:id', getEnquiryById);
router.put('/Enquiry/:id', updateEnquiry);
router.delete('/Enquiry/:id', deleteEnquiry);

// ➕ Create doubt session
router.post("/doubtSession", upload.single("image"), doubtSessionController.createDoubtSession);

// 📖 Get all doubt sessions
router.get("/doubtSession", doubtSessionController.getAllDoubtSessions);

// 📖 Get a single doubt session by ID
router.get("/doubtSession/:id", doubtSessionController.getDoubtSessionById);

// ✏️ Update doubt session
router.put("/doubtSession/:id", upload.single("image"), doubtSessionController.updateDoubtSession);

// ❌ Delete doubt session
router.delete("/doubtSession/:id", doubtSessionController.deleteDoubtSession);

module.exports = router;
