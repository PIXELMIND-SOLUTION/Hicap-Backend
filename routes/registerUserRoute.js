const express = require('express');
const router = express.Router();
const users= require('../controllers/registerUserController');
const liveClassController = require("../controllers/liveClassController");


router.post('/userregister',users.register);
router.post('/userlogin', users.login);
// Read
router.get('/userregister', users.getAllUsers);
router.get('/userregister/:id', users.getUserById);

// Update
router.put('/userregister/:id',users.updateUser);

// Delete
router.delete('/userregister/:id', users.deleteUser);

router.post("/liveclasses", liveClassController.createLiveClass);
router.get("/liveclasses", liveClassController.getAllLiveClasses);
router.get("/liveclasses/:id", liveClassController.getLiveClassById);
router.put("/liveclasses/:id", liveClassController.updateLiveClass);
router.delete("/liveclasses/:id", liveClassController.deleteLiveClass);

module.exports = router;
