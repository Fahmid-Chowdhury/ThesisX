const express = require('express');
const router = express.Router();
const LoginSignupController = require('../controllers/AuthController.js');

router.post('/signup', LoginSignupController.signup);
router.post('/login', LoginSignupController.login);
router.post('/verifyOTP', LoginSignupController.verifyOTP);
router.post('/resendOTP', LoginSignupController.resendOTP);


module.exports = router;