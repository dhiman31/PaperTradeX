const { cacheClient } = require('../../../config/redisClient');
const {subscribeSymbol} = require('../subscriptionManager');

async function handleSymbol(ws,symbol) {

    subscribeSymbol(symbol,ws);
    const price = await cacheClient.hGet('LATEST_PRICES', symbol);

    ws.send( JSON.stringify({ type: 'INITIAL_PRICE', symbol, price}));
}

module.exports = {
    handleSymbol
};