const express = require('express');
const router = express.Router();
const upload = require('../utils/uploadMiddleware'); // multer middleware

const homeController = require("../controllers/homeControoler");


router.post("/home", upload.single("image"), homeController.createHome);
router.get("/home", homeController.getAllHomes);
router.get("/home/:id", homeController.getHomeById);
router.put("/home/:id", upload.single("image"), homeController.updateHome);
router.delete("/home/:id", homeController.deleteHome);

module.exports = router;
