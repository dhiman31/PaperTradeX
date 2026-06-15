const { sequelize } = require('../models');
const HoldingRepository = require('../repository/holdingRepository');
const PortfolioRepository = require('../repository/portfolioRepository');

const holdingRepo = new HoldingRepository();
const portfolioRepo = new PortfolioRepository();

class PortfolioService {

    async createPortfolio(userId) {
        return await portfolioRepo.createUserPortfolio(userId);
    }

    async getPortfolio(userId) {
        const [portfolio, holdings] = await Promise.all([
            portfolioRepo.fetchUserBalanceDetails(userId),
            holdingRepo.fetchUserAllHolding(userId)
        ]);

        return {
            cashBalance:    Number(portfolio.cashBalance),
            initialBalance: Number(portfolio.initialBalance),
            holdings: holdings.map(h => ({
                symbol:      h.symbol,
                quantity:    Number(h.quantity),
                avgBuyPrice: Number(h.avgBuyPrice)
            }))
        };
    }

    async getHolding(userId, symbol) {
        return await holdingRepo.fetchUserSymbolHolding(userId, symbol);
    }

    // called by the order service
    async buyAsset(userId, symbol, quantity, price) {
        const totalCost = quantity * price;
        const t = await sequelize.transaction();

        try {
            const portfolio = await portfolioRepo.fetchUserBalanceDetails(userId, t);

            if (Number(portfolio.cashBalance) < totalCost) {
                throw new Error(`Insufficient funds. Need $${totalCost}, have $${portfolio.cashBalance}`);
            }

            const newBalance = Number(portfolio.cashBalance) - totalCost;
            await portfolioRepo.updateBalance(userId, newBalance, t);

            const existing = await holdingRepo.doesUserHaveSomeHoldingForSymbol(userId, symbol, t);
            if (existing) {
                await holdingRepo.updateHolding(existing.id, quantity, price, t);
            } else {
                await holdingRepo.createHolding(userId, symbol, quantity, price, t);
            }

            await t.commit();
            return { success: true, newBalance, symbol, quantity, price };

        } catch (err) {
            await t.rollback();
            throw err;
        }
    }

    // called by the ordere service
    async sellAsset(userId, symbol, quantity, price) {
        const totalGain = quantity * price;
        const t = await sequelize.transaction();

        try {
            const holding = await holdingRepo.doesUserHaveSomeHoldingForSymbol(userId, symbol, t);

            if (!holding) throw new Error(`No holding found for ${symbol}`);
            if (Number(holding.quantity) < quantity) {
                throw new Error(`Cannot sell ${quantity}, only ${holding.quantity} held`);
            }

            await holdingRepo.reduceHolding(userId, symbol, quantity, t);

            const portfolio = await portfolioRepo.fetchUserBalanceDetails(userId, t);
            const newBalance = Number(portfolio.cashBalance) + totalGain;
            await portfolioRepo.updateBalance(userId, newBalance, t);

            await t.commit();
            return { success: true, newBalance, symbol, quantity, price };

        } catch (err) {
            await t.rollback();
            throw err;
        }
    }
}

module.exports = new PortfolioService();