const Order = require('../models/order');

class OrderRepository {

    async createOrder(userId, orderType, transactionType, symbol, amount, price) {
        try {
            return await Order.create({
                userId,
                orderType,          // 'MARKET' | 'LIMIT'
                transactionType,    // 'BUY' | 'SELL'
                symbol,
                amount,
                price,
                total_amount: amount * price,
                status: 'PENDING'
                // Market orders complete immediately, limit orders start as pending
            });
        } catch (err) {
            console.log("Error in order repository");
            throw err;
        }
    }

    async getOrderById(orderId) {
        try {
            return await Order.findByPk(orderId);
        } catch (err) {
            console.log("Error in order repository");
            throw err;
        }
    }

    async getUserOrders(userId) {
        try {
            return await Order.findAll({
                where: { userId },
                order: [['createdAt', 'DESC']]
            });
        } catch (err) {
            console.log("Error in order repository");
            throw err;
        }
    }

    async getPendingLimitOrders(symbol) {
        try {
            return await Order.findAll({
                where: {
                    symbol,
                    orderType: 'LIMIT',
                    status: 'PENDING'
                }
            });
        } catch (err) {
            console.log("Error in order repository");
            throw err;
        }
    }

    async updateOrderStatus(orderId, status) {
        try {
            await Order.update({ status }, { where: { id: orderId } });
            return await Order.findByPk(orderId);
        } catch (err) {
            console.log("Error in order repository");
            throw err;
        }
    }

    async cancelOrder(orderId, userId) {
        try {
            const order = await Order.findOne({ where: { id: orderId, userId } });
            if (!order) throw new Error('Order not found');
            if (order.status !== 'PENDING') throw new Error(`Cannot cancel a ${order.status} order`);
            return await this.updateOrderStatus(orderId, 'CANCELLED');
        } catch (err) {
            console.log("Error in order repository");
            throw err;
        }
    }
}

module.exports = OrderRepository;