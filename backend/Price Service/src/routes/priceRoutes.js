const express = require('express');
const router = express.Router();
const {getLatestPrice} = require('../controllers/priceController');

router.get('/:symbol',getLatestPrice);

module.exports = router;