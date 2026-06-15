const OrderRepository = require("../repository/orderRepository");
const callPortfolio = require("./callPortfolio");

const orderRepo = new OrderRepository();

// Called by Limit Order Worker when price condition is met
const executeLimitOrder = async (orderId) => {
    const order = await orderRepo.getOrderById(orderId);
    if (!order || order.status !== 'PENDING') return;

    try {
        await callPortfolio(
            order.transactionType.toLowerCase(),
            order.userId,
            order.symbol,
            order.amount,
            order.price
        );
        await orderRepo.updateOrderStatus(orderId, 'COMPLETED');
    } catch (err) {
        await orderRepo.updateOrderStatus(orderId, 'FAILED');
        throw new Error(err.response?.data?.error || err.message);
    }

    return orderRepo.getOrderById(orderId);
};

module.exports = executeLimitOrder