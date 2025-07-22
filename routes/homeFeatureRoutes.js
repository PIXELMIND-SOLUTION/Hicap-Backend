const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

const {
  createHomeFeature,
  getAllHomeFeatures,
  getHomeFeatureById,
  updateHomeFeature,
  deleteHomeFeature,
} = require("../controllers/homeFeatureController");

// Upload multiple images (1 for each feature)
router.post("/", upload.array("images"), createHomeFeature);
router.get("/", getAllHomeFeatures);
router.get("/:id", getHomeFeatureById);
router.put("/:id", upload.array("images"), updateHomeFeature);
router.delete("/:id", deleteHomeFeature);

module.exports = router;

