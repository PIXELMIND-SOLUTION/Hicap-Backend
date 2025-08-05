const express = require('express');
const router = express.Router();
const courseModuleController = require('../controllers/coursemodulecontroller');

// CREATE
router.post('/courseModule', courseModuleController.createCourseModule);

// READ ALL
router.get('/courseModule', courseModuleController.getAllCourseModules);

// READ BY ID
router.get('/courseModule/:id', courseModuleController.getCourseModuleById);

// UPDATE
router.put('/courseModule/:id', courseModuleController.updateCourseModule);

// DELETE
router.delete('/courseModule/:id', courseModuleController.deleteCourseModule);
module.exports = router;
