const express = require('express');
const router = express.Router();
const portfolioController = require('../../controllers/portfolioController');
const { verifyJwt, internalOnly } = require('../../middlewares/auth');

// ── User-facing (JWT protected) ──────────────────────────────────────────────
router.get('/',                 verifyJwt, portfolioController.getPortfolio);
router.get('/:symbol',          verifyJwt, portfolioController.getHolding);

// ── Internal only (called by Order Service / User Service) ───────────────────
router.post('/internal/buy',    internalOnly, portfolioController.buyAsset);
router.post('/internal/sell',   internalOnly, portfolioController.sellAsset);
router.post('/internal/create', internalOnly, portfolioController.createPortfolio);

module.exports = router;