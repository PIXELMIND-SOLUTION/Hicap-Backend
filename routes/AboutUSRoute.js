const express = require('express');
const router = express.Router();
const upload = require('../utils/uploadMiddleware'); // multer middleware
const {
  createAbout,
  getAbout,
  updateAbout,
  deleteAbout,
  createLeadership,
  getLeadership,
  updateLeadership,
  deleteLeadership,
  createTechnicalTeam,
  getAllTechnicalTeam,
  getTechnicalTeamById,
  updateTechnicalTeam,
  deleteTechnicalTeam,
  createClassRoom, 
  getAllClassRoom, 
  updateClassRoom, 
  deleteClassRoom
} = require("../controllers/AboutUsController");
const upcomingBatchController = require("../controllers/upcomingBatchController");

// ==============================
// 🔹 ABOUT ROUTES
// ==============================

// 📌 POST - Create About
// Form-data: title1, content1, image1 (file)
router.post("/about", upload.single("image1"), createAbout);

// 📌 GET - Get About
router.get("/about", getAbout);

// 📌 PUT - Update About
// Form-data: title1, content1, image1 (file)
router.put("/about/:id", upload.single("image1"), updateAbout);

// 📌 DELETE - Delete About
router.delete("/about/:id", deleteAbout);

// ==============================
// 🔹 LEADERSHIP ROUTES
// ==============================

// 📌 POST - Create Leadership Member
// Form-data: name, role, content, image (file)
router.post('/leadership', upload.single('image'), createLeadership);

// 📌 GET - Get All Leadership
router.get('/leadership', getLeadership);

// 📌 PUT - Update Leadership by ID
// Form-data: name, role, content, image (file)
router.put('/leadership/:id', upload.single('image'), updateLeadership);

// 📌 DELETE - Delete Leadership by ID
router.delete('/leadership/:id', deleteLeadership);

router.post("/technical-team", upload.single("image2"), createTechnicalTeam);
router.get("/technical-team", getAllTechnicalTeam);
router.get('/technical-team/:id', getTechnicalTeamById);
router.put("/technical-team/:id", upload.single("image2"), updateTechnicalTeam );
router.delete("/technical-team/:id", deleteTechnicalTeam);

router.post('/classRoom', upload.array('image3'), createClassRoom);
router.get('/classRoom', getAllClassRoom);
router.put('/classRoom/:id', upload.array('image3'), updateClassRoom);
router.delete('/classRoom/:id', deleteClassRoom);


router.post("/upcomingBatch", upcomingBatchController.createUpcomingBatch);
router.get("/upcomingBatch", upcomingBatchController.getAllUpcomingBatches);
router.get("/upcomingBatch/categorie/:categorie", upcomingBatchController.getBatchesByCategorie);
router.get("/upcomingBatch/:batchId", upcomingBatchController.getSingleBatchByIdOnly);

router.get("/upcomingBatch/:id", upcomingBatchController.getUpcomingBatchById);
router.put("/upcomingBatch/:id", upcomingBatchController.updateUpcomingBatch);
router.delete("/upcomingBatch/:id", upcomingBatchController.deleteUpcomingBatch);

// CREATE upcoming (array of images + title + content)
router.post("/upcoming", upload.array("images"), upcomingBatchController.createUpcoming);

// GET all
router.get("/upcoming", upcomingBatchController.getAllUpcoming);

// GET by ID
router.get("/upcoming/:id", upcomingBatchController.getUpcomingById);

// UPDATE upcoming (optional new images)
router.put("/upcoming/:id", upload.array("images"), upcomingBatchController.updateUpcoming);

// DELETE
router.delete("/upcoming/:id", upcomingBatchController.deleteUpcoming);


// CREATE WhyChoose
// Upload multiple images corresponding to array items
router.post("/whyChoose", upload.array("images"), upcomingBatchController.createWhyChoose);

// GET all WhyChoose items
router.get("/whyChooses", upcomingBatchController.getAllWhyChoose);

// GET a single WhyChoose by ID
router.get("/whyChoose/:id", upcomingBatchController.getWhyChooseById);

// UPDATE WhyChoose by ID
// Upload multiple images if replacing any
router.put("/whyChoose/:id", upload.array("images"), upcomingBatchController.updateWhyChoose);

// DELETE WhyChoose by ID
router.delete("/whyChoose/:id", upcomingBatchController.deleteWhyChoose);

module.exports = router;
