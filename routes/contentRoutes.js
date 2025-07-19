const express = require("express");
const router = express.Router();
const upload = require("../utils/uplode");
const {
  createContent,
  getAllContent,
  updateContent,
  deleteContent
} = require("../controllers/ContentController");

router.post("/create", upload.single("image"), createContent);
router.get("/all", getAllContent);
router.put("/update/:id", upload.single("image"), updateContent);
router.delete("/delete/:id", deleteContent);

module.exports = router;
