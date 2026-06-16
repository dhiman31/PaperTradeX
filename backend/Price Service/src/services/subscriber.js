const { subscriberClient } = require('../config/redisClient');
const {updatePrice} = require('./cacher');
const {broadcastPrice} = require('./websocket/broadcaster');

async function startSubscriber(){

  await subscriberClient.subscribe(
    'PRICE_UPDATES',
    async(message) => {
      const updates = JSON.parse(message);
      console.log(
        'REDIS MESSAGE:',
        updates
      );

      for(const ticker of updates){
        await updatePrice(ticker);
        broadcastPrice(ticker);
      }
    }
  );
}

module.exports = {
  startSubscriber
};