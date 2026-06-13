const express = require('express')
const router = express.Router()
const authRouter = require('./v1/index')

router.use('/v1',authRouter)

module.exports = router;