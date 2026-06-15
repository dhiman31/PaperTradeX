const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyJwt, internalOnly } = require('../middlewares/auth');

// ── User-facing
router.post('/market',              verifyJwt,    orderController.placeMarketOrder);
router.post('/limit',               verifyJwt,    orderController.placeLimitOrder);
router.get('/',                     verifyJwt,    orderController.getUserOrders);
router.patch('/:orderId/cancel',    verifyJwt,    orderController.cancelOrder);

// ── Internal (Limit Order Worker only)
router.post('/internal/:orderId/execute', internalOnly, orderController.executeLimitOrder);

module.exports = router;