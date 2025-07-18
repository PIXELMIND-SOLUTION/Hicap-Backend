const express = require('express');
const router = express.Router();
const upload = require('../utils/uploadMiddleware');
const {
  createAbout,
  getAbout,
  updateAbout,
  deleteAbout
} = require("../controllers/AboutUsController");



// 📌 POST - Create
router.post("/about", upload.single("image1"), createAbout);

// 📌 GET - Read All
router.get("/about", getAbout);

// 📌 PUT - Update
router.put("/about/:id", upload.single("image1"), updateAbout);

// 📌 DELETE - Delete
router.delete("/about/:id", deleteAbout);

module.exports = router;
