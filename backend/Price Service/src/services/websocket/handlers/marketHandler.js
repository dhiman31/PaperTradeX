const { cacheClient } = require('../../../config/redisClient');
const {addMarketClient} = require('../subscriptionManager');

async function handleMarket(ws) {

    console.log('MARKET CLIENT CONNECTED');
    
    addMarketClient(ws);
    const prices = await cacheClient.hGetAll('LATEST_PRICES');

    ws.send(JSON.stringify({type: 'INITIAL_DATA', data: prices}));
}

module.exports = {
    handleMarket
};