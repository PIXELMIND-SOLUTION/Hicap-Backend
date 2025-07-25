const express = require('express');
const router = express.Router();
const upload = require('../utils/uploadMiddleware'); // multer middleware
const homeController = require("../controllers/homeController");


router.post("/home", upload.single("image"), homeController.createHome);
router.get("/home", homeController.getAllHomes);
router.get("/home/:id", homeController.getHomeById);
router.put("/home/:id", upload.single("image"), homeController.updateHome);
router.delete("/home/:id", homeController.deleteHome);


// ✅ Correct routing for HomeCourses
router.post('/Courses', upload.single('image'), homeController.createHomeCourses);
router.get('/Courses', homeController.getAllHomeCourses);
router.get('/Courses/:id', homeController.getHomeCoursesById);
router.put('/Courses/:id', upload.single('image'), homeController.updateHomeCourses);
router.delete('/Courses/:id', homeController.deleteHomeCourses);



router.post("/review", upload.single("image"), homeController.createReview);
router.get("/review", homeController.getAllReviews);
router.get("/review/:id", homeController.getReviewById);
router.put("/review/:id", upload.single("image"), homeController.updateReview);
router.delete("/review/:id", homeController.deleteReview);


module.exports = router;
