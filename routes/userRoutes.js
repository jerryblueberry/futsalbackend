const express = require('express');
const { Register, refreshToken, Login } = require('../controller/user-controller.js/userController');
const router = express.Router();

router.post('/register',Register);
router.post('/login',Login);
router.post('/refresh-token',refreshToken);


module.exports = router