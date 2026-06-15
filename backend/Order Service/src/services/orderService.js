const OrderRepository = require('../repository/orderRepository');
const fetchCurrentPrice = require('./fetchCurrentPrice');
const callPortfolio = require('./callPortfolio');
const { publishOrderEvent } = require('./kafkaProducer');
const { removeLimitOrder, pushLimitOrder } = require('./redisProducer');

const orderRepo = new OrderRepository();

const placeMarketOrder = async (userId, transactionType, symbol, amount) => {

    // 1. Get current price from Price Service
    const price = await fetchCurrentPrice(symbol);

    // 2. Create order record as PENDING
    const order = await orderRepo.createOrder(
        userId, 'MARKET', transactionType, symbol, amount, price
    );

    // 3. Call Portfolio Service to deduct cash / update holding
    try{
        await callPortfolio(transactionType.toLowerCase(), userId, symbol, amount, price);
        await orderRepo.updateOrderStatus(order.id, 'COMPLETED');
    } catch (err) {
        // Portfolio call failed (e.g. insufficient funds) — mark order FAILED
        await orderRepo.updateOrderStatus(order.id, 'FAILED');
        await publishOrderEvent('ORDER_FAILED',{
                orderId: order.id,
                userId,
                symbol
        });
        throw new Error(err.response?.data?.error || err.message);
    }

    await publishOrderEvent('MARKET_ORDER_COMPLETED',{
            orderId: order.id,
            userId,
            symbol,
            amount,
            price
    });

    return await orderRepo.getOrderById(order.id);
};

const placeLimitOrder = async (userId, transactionType, symbol, amount, limitPrice) => {
    // Just save it as PENDING — Limit Order Worker will execute it when price is hit
    const order = await orderRepo.createOrder(
        userId, 'LIMIT', transactionType, symbol, amount, limitPrice
    );

    await pushLimitOrder(order);
    await publishOrderEvent('LIMIT_ORDER_CREATED',{
        orderId: order.id,
        userId,
        symbol,
        amount,
        limitPrice
    });
    return order;
};

const cancelOrder = async (orderId,userId) => {

    const order = await orderRepo.getOrderById(orderId);
    if(!order){
        throw new Error(
            'Order not found'
        );
    }

    if(order.userId !== userId){
        throw new Error(
            'Unauthorized'
        );
    }

    if(order.status !== 'PENDING'){
        throw new Error(
            'Order cannot be cancelled'
        );
    }

    if(order.orderType !== 'LIMIT'){
        throw new Error(
            'Only limit orders can be cancelled'
        );
    }

    await removeLimitOrder(order);
    await orderRepo.updateOrderStatus(
        orderId,
        'CANCELLED'
    );

    await publishOrderEvent('LIMIT_ORDER_CANCELLED',{
            orderId,
            userId,
            symbol: order.symbol
        }
    );

    return await orderRepo.getOrderById(orderId);
};

const getUserOrders = (userId) => orderRepo.getUserOrders(userId);
const getPendingLimits = (symbol) => orderRepo.getPendingLimitOrders(symbol);

module.exports = {
    placeMarketOrder,
    placeLimitOrder,
    getUserOrders,
    cancelOrder,
    getPendingLimits
};