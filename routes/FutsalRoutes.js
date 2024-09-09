const express = require('express');
const { addFutsal, getAllFutsals } = require('../controller/addFutsal');
const upload = require('../middleware/multer');
const router= express.Router();

router.post('/add',upload.single('futsalImage'),addFutsal);
router.get('/',getAllFutsals)
module.exports = router;