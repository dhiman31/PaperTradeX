const cron = require('node-cron');
const { client } = require('../config/redisClient');
const fetchCurrentPrice = require('../services/fetchCurrentPrice');
const executeLimitOrder = require('../services/limitWorkers');
const OrderRepository = require('../repository/orderRepository');

const orderRepo = new OrderRepository();

const processSymbol = async (symbol) => {
    const key = `limit-orders:${symbol}`;
    const currentPrice = await fetchCurrentPrice(symbol);

    // Get all orders for this symbol, sorted by limit price (score)
    const orders = await client.zRangeWithScores(key, 0, -1);

    for (const { value: orderId, score: limitPrice } of orders) {

        const order = await orderRepo.getOrderById(orderId);
        if (!order || order.status !== 'PENDING') {
            await client.zRem(key, orderId);
            continue;
        }

        const shouldExecute =
            (order.transactionType === 'BUY' && currentPrice <= limitPrice) ||
            (order.transactionType === 'SELL' && currentPrice >= limitPrice);

        if (shouldExecute) {
            await executeLimitOrder(orderId);
            await client.zRem(key, orderId);
        }
    }
};

const startWorker = () => {
    console.log("LIMIT WORKER STARTED!!")
    cron.schedule('*/10 * * * * *', async () => {
        try {
            const keys = await client.keys('limit-orders:*');

            for (const key of keys) {
                const symbol = key.split(':')[1];
                await processSymbol(symbol);
            }
        } catch (err) {
            console.error('Limit Order Worker error:', err.message);
        }
    });
};

module.exports = { startWorker };