const express = require('express')
const router = express.Router()
const portfolioRoutes = require('./v1/index')

router.use('/v1/portfolio',portfolioRoutes)

module.exports = router