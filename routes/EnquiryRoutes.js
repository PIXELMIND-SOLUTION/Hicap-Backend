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


router.post('/create', createEnquiry);
router.get('/all', getEnquiries);
router.get('/:id', getEnquiryById);
router.put('/:id', updateEnquiry);
router.delete('/:id', deleteEnquiry);

// ➕ Create doubt session
router.post("/", upload.single("image"), doubtSessionController.createDoubtSession);

// 📖 Get all doubt sessions
router.get("/", doubtSessionController.getAllDoubtSessions);

// 📖 Get a single doubt session by ID
router.get("/:id", doubtSessionController.getDoubtSessionById);

// ✏️ Update doubt session
router.put("/:id", upload.single("image"), doubtSessionController.updateDoubtSession);

// ❌ Delete doubt session
router.delete("/:id", doubtSessionController.deleteDoubtSession);

module.exports = router;
