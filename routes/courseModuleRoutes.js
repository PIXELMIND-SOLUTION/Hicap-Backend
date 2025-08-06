const express = require('express');
const router = express.Router();
const courseModuleController = require('../controllers/coursemodulecontroller');

// CREATE
router.post('/courseModule', courseModuleController.createCourseModule);

// READ ALL
router.get('/courseModule', courseModuleController.getAllCourseModules);

// READ BY ID
router.get('/courseModule/:id', courseModuleController.getCourseModuleById);

router.get('/courseModule/user/:userId', courseModuleController.getCourseModulesByUserId);

// UPDATE
router.put('/courseModule/:id', courseModuleController.updateCourseModuleById);

// DELETE
router.delete('/courseModule/:id', courseModuleController.deleteCourseModuleById);
module.exports = router;
