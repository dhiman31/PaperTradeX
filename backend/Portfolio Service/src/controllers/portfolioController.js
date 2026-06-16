const portfolioService = require('../services/portfolioService');

class PortfolioController {

    async getPortfolio(req, res) {
        try {
            const portfolio = await portfolioService.getPortfolio(req.user.id);
            res.json(portfolio);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async getHolding(req, res) {
        try {
            const holding = await portfolioService.getHolding(req.user.id, req.params.symbol.toUpperCase());
            if (!holding) return res.status(404).json({ error: 'Holding not found' });
            res.json(holding);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Called internally by Order Service — not exposed to the client
    async buyAsset(req, res) {
        try {
            const { userId, symbol, quantity, price } = req.body;
            const result = await portfolioService.buyAsset(userId, symbol, quantity, price);
            res.json(result);
        } catch (err) {
            const status = err.message.includes('Insufficient') ? 400 : 500;
            res.status(status).json({ error: err.message });
        }
    }

    async sellAsset(req, res) {
        try {
            const { userId, symbol, quantity, price } = req.body;
            const result = await portfolioService.sellAsset(userId, symbol, quantity, price);
            res.json(result);
        } catch (err) {
            const status = err.message.includes('Cannot sell') || err.message.includes('No holding') ? 400 : 500;
            res.status(status).json({ error: err.message });
        }
    }

    // Called internally by User Service after verification
    async createPortfolio(req, res) {
        try {
            const { userId } = req.body;
            const portfolio = await portfolioService.createPortfolio(userId);
            res.status(201).json(portfolio);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}

module.exports = new PortfolioController();