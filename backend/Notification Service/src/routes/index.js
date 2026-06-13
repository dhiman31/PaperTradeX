const express = require('express');
const router = express.Router();
const notifyRouter = require('./v1/index')

router.use('/v1',notifyRouter)

module.exports = router