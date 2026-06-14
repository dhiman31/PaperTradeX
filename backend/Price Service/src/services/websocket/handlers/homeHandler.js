const { cacheClient } = require('../../../config/redisClient');
const {subscribeSymbol} = require('../subscriptionManager');

const DEFAULT_HOME_SYMBOLS = [
    'BTCUSDT',
    'ETHUSDT',
    'SOLUSDT'
];

async function handleHome(ws) {

    const prices = {};
    for(const symbol of DEFAULT_HOME_SYMBOLS) {
        subscribeSymbol(symbol,ws);
        prices[symbol] = await cacheClient.hGet('LATEST_PRICES',symbol);
    }

    ws.send(JSON.stringify({type: 'INITIAL_DATA',data: prices}));
}

module.exports = {
    handleHome
};