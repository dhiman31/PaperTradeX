const {createEmail,getAll} = require('../../controllers/notifyController')
const express = require('express');
const router = express.Router();

router.post('/notification',createEmail);
router.get('/notification',getAll);

module.exports = router;