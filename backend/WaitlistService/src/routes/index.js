const express = require('express')
const router = express.Router()
const watchListRoutes = require('./v1/index')

router.use('/v1/watchlist',watchListRoutes)

module.exports = router