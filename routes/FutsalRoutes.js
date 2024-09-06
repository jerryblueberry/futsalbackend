const express = require('express');
const { addFutsal, getAllFutsals } = require('../controller/addFutsal');

const router= express.Router();

router.post('/add',addFutsal);
router.get('/',getAllFutsals)
module.exports = router;