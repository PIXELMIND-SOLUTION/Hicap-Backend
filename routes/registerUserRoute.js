const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/registerUserController');
const liveClassController = require("../controllers/liveClassController");


router.post('/userregister', register);
router.post('/userlogin', login);

router.post("/liveclasses", liveClassController.createLiveClass);
router.get("/liveclasses", liveClassController.getAllLiveClasses);
router.get("/liveclasses/:id", liveClassController.getLiveClassById);
router.put("/liveclasses/:id", liveClassController.updateLiveClass);
router.delete("/liveclasses/:id", liveClassController.deleteLiveClass);

module.exports = router;
