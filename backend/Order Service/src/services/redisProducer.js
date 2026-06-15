const { client } = require('../config/redisClient');

const pushLimitOrder = async(order)=>{
    const key = `limit-orders:${order.symbol}`;
    await client.zAdd(
        key,
        [
            {
                score:Number(order.price),
                value:String(order.id)
            }
        ]
    );
};

const removeLimitOrder = async (order) => {
    const key = `limit-orders:${order.symbol}`;
    await client.zRem(key,String(order.id));
};

module.exports = {
    pushLimitOrder,
    removeLimitOrder
};