const express = require('express');
const { Register, refreshToken, Login, userImageUpload, fetchUserDetail } = require('../controller/user-controller.js/userController');
const { profileUpload } = require('../middleware/multer');
const router = express.Router();


router.get('/:userId',fetchUserDetail);
router.post('/register',Register);
router.post('/login',Login);
router.post('/refresh-token',refreshToken);
router.patch('/image/:userId',profileUpload,userImageUpload);


module.exports = router