const { cacheClient } = require("../config/redisClient");

async function updatePrice(ticker){

  if(!ticker || !ticker.symbol){
    console.log(
      "Invalid ticker:",
      ticker
    );
    return;
  }

  await cacheClient.hSet(
    'LATEST_PRICES',
    ticker.symbol,
    JSON.stringify(ticker)
  );
}

async function getPrice(symbol){
  const data = await cacheClient.hGet(
    'LATEST_PRICES',
    symbol.toUpperCase()
  );

  if(!data){
    return null;
  }

  return JSON.parse(data);
}

module.exports = {
  updatePrice,
  getPrice
};