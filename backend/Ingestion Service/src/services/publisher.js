const {publisher} = require('../config/redisClient');

async function publishPriceUpdates(updates){

    try{
        await publisher.publish('PRICE_UPDATES', JSON.stringify(updates));

    }catch (error){
        console.log('Price Publish Error:',error);
    }
}

module.exports = {
    publishPriceUpdates
};