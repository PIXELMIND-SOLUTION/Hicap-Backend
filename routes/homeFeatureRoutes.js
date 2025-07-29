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
  createQualityIcons,
  getAllQualityIcons,
  getQualityIconById,
  updateQualityIcon,
  deleteQualityIcon
} = require("../controllers/homeFeatureController");

// Upload multiple images (1 for each feature)
router.post("/", upload.array("images"), createHomeFeature);
router.get("/", getAllHomeFeatures);
router.get("/:id", getHomeFeatureById);
router.put("/:id", upload.array("images"), updateHomeFeature);
router.delete("/:id", deleteHomeFeature);




// Create Quality icons
router.post(
  "/quality",
  upload.single("image"), // only the image is uploaded
  createQualityIcons);
  router.get("/quality", getAllQualityIcons);
router.get("/quality/:id", getQualityIconById);
router.put("/quality/:id", upload.single("image"), updateQualityIcon);
router.delete("/quality/:id",deleteQualityIcon);

module.exports = router;

