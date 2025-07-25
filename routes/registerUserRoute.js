const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/registerUserController');

router.post('/userregister', register);
router.post('/userlogin', login);

module.exports = router;
