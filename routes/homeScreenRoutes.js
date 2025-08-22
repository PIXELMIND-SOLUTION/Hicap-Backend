const express = require("express");
const router = express.Router();
const multer = require("multer");
// Multer setup for memory storage (buffer upload)
const storage = multer.memoryStorage();
const upload = multer({ storage });
const homeScreenController = require("../controllers/homeScreenController");

router.post("/hero-banners", upload.array("images"), homeScreenController.createOrUpdateHomeScreen);
router.get("/hero-banners", homeScreenController.getAllBanners);
router.get("/hero-banners/:bannerId", homeScreenController.getBannerById);
router.put("/hero-banners/:bannerId", upload.array("images"), homeScreenController.updateBannerById);
router.delete("/hero-banners/:bannerId", homeScreenController.deleteBannerById);

// CREATE (with image uploads)
router.post(
  "/home-features",
  upload.array("images"),
  homeScreenController.createHomeFeature
);

// READ ALL
router.get(
  "/home-features",
  homeScreenController.getAllHomeFeatures
);

// READ ONE BY ID
router.get(
  "/home-features/:id",
  homeScreenController.getHomeFeatureById
);

// UPDATE (with optional new images)
router.put(
  "/home-features/:id",
  upload.array("images"),
  homeScreenController.updateHomeFeature
);

// DELETE
router.delete(
  "/home-features/:id",
  homeScreenController.deleteHomeFeature
);

// CREATE (with optional image)
router.post(
  "/reviews",
  upload.single("image"),
  homeScreenController.createReview
);

// GET ALL
router.get(
  "/reviews",
  homeScreenController.getAllReviews
);

// GET BY ID
router.get(
  "/reviews/:id",
  homeScreenController.getReviewById
);

// UPDATE (with optional new image)
router.put(
  "/reviews/:id",
  upload.single("image"),
  homeScreenController.updateReview
);

// DELETE
router.delete(
  "/reviews/:id",
  homeScreenController.deleteReview
);


// CREATE (with at least one image)
router.post(
  "/clients",
  upload.array("images"), 
  homeScreenController.createClient
);

// READ ALL
router.get(
  "/clients",
  homeScreenController.getAllClients
);

// READ BY ID
router.get(
  "/clients/:id",
  homeScreenController.getClientById
);

// UPDATE (with optional new images)
router.put(
  "/clients/:id",
  upload.array("images"), 
  homeScreenController.updateClient
);

// DELETE
router.delete(
  "/clients/:id",
  homeScreenController.deleteClient
);

// Create
router.post("/count", homeScreenController.createCounter);

// Read
router.get("/counts", homeScreenController.getCounters);
router.get("/count/:id", homeScreenController.getCounterById);

// Update
router.put("/count/:id", homeScreenController.updateCounter);

// Delete
router.delete("/count/:id", homeScreenController.deleteCounter);

module.exports = router;
