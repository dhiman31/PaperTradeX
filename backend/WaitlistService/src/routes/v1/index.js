const express = require('express');
const router = express.Router();
const watchlistController = require('../../controllers/watchlistController');

router.post('/symbol',watchlistController.addSymbol);
router.delete('/symbol',watchlistController.removeSymbol);
router.get('/',watchlistController.getWatchlist);

module.exports = router;