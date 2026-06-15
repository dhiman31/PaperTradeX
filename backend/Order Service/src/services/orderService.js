const axios = require('axios');
const OrderRepository = require('../repository/orderRepository');
const fetchCurrentPrice = require('./fetchCurrentPrice');
const callPortfolio = require('./callPortfolio');

const orderRepo = new OrderRepository();

const placeMarketOrder = async (userId, transactionType, symbol, amount) => {

    // 1. Get current price from Price Service
    const price = await fetchCurrentPrice(symbol);

    // 2. Create order record as COMPLETED straight away
    const order = await orderRepo.createOrder(
        userId, 'MARKET', transactionType, symbol, amount, price
    );

    // 3. Call Portfolio Service to deduct cash / update holding
    try{
        await callPortfolio(transactionType.toLowerCase(), userId, symbol, amount, price);
    } catch (err) {
        // Portfolio call failed (e.g. insufficient funds) — mark order FAILED
        await orderRepo.updateOrderStatus(order.id, 'FAILED');
        throw new Error(err.response?.data?.error || err.message);
    }
    return order;
};

const placeLimitOrder = async (userId, transactionType, symbol, amount, limitPrice) => {
    // Just save it as PENDING — Limit Order Worker will execute it when price is hit
    const order = await orderRepo.createOrder(
        userId, 'LIMIT', transactionType, symbol, amount, limitPrice
    );
    return order;
};

const getUserOrders = (userId) => orderRepo.getUserOrders(userId);
const cancelOrder = (orderId, userId) => orderRepo.cancelOrder(orderId, userId);
const getPendingLimits = (symbol) => orderRepo.getPendingLimitOrders(symbol);

module.exports = {
    placeMarketOrder,
    placeLimitOrder,
    getUserOrders,
    cancelOrder,
    getPendingLimits
};