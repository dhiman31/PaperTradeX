const { cacheClient } = require("../config/redisClient");

async function updatePrice(symbol,price){
    await cacheClient.hSet('LATEST_PRICES',symbol,price);
}

module.exports = {
    updatePrice
};