const express = require('express')
const router = express.Router()
const authController = require('../../controllers/authController')
const authMiddleware = require('../../middlewares/authMiddleware')

router.post('/user/register', authController.register)
router.post('/user/login' , authController.login)
router.delete('/user' , authMiddleware.isAuthenticated , authController.deleteAccount)
router.post('/user/verifyemail' , authMiddleware.isAuthenticated , authController.verifyEmail)

module.exports = router;