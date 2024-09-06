const express = require('express');
const { addFutsal } = require('../controller/addFutsal');

const router= express.Router();

router.post('/add',addFutsal);

module.exports = router;