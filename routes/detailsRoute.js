const express = require('express');
const router = express.Router();
const controller = require('../controllers/detailsController');

// ===== ContactDetails =====
router.post('/contact-details', controller.createContactDetails);
router.get('/contact-details', controller.getAllContactDetails);
router.get('/contact-details/:id', controller.getContactDetailsById);
router.put('/contact-details/:id', controller.updateContactDetails);
router.delete('/contact-details/:id', controller.deleteContactDetails);

// ===== SocialMedia =====
router.post('/social-media', controller.createSocialMedia);
router.get('/social-media', controller.getAllSocialMedia);
router.get('/social-media/:id', controller.getSocialMediaById);
router.put('/social-media/:id', controller.updateSocialMedia);
router.delete('/social-media/:id', controller.deleteSocialMedia);

module.exports = router;
