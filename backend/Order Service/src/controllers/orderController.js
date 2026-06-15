const executeLimitOrder = require('../services/limitWorkers');
const orderService = require('../services/orderService');

class OrderController {
    
    async placeMarketOrder(req, res) {
        try {
            const { transactionType, symbol, amount } = req.body;
            const order = await orderService.placeMarketOrder(
                req.user.id, transactionType, symbol.toUpperCase(), Number(amount)
            );
            res.status(201).json(order);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    async placeLimitOrder(req, res) {
        try {
            const { transactionType, symbol, amount, limitPrice } = req.body;
            const order = await orderService.placeLimitOrder(
                req.user.id, transactionType, symbol.toUpperCase(), Number(amount), Number(limitPrice)
            );
            res.status(201).json(order);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    async getUserOrders(req, res) {
        try {
            const orders = await orderService.getUserOrders(req.user.id);
            res.json(orders);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async cancelOrder(req, res) {
        try {
            const order = await orderService.cancelOrder(req.params.orderId, req.user.id);
            res.json(order);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    // Called by Limit Order Worker only
    async executeLimitOrder(req, res) {
        try {
            const order = await orderService.executeLimitOrder(req.params.orderId);
            res.json(order);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
}

module.exports = new OrderController();