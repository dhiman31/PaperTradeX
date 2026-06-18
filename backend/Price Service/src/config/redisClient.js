const redis = require('redis');

const cacheClient = redis.createClient({
    url: process.env.REDIS_URL
});
const subscriberClient = redis.createClient({
    url: process.env.REDIS_URL
});

async function connectRedis() {

    cacheClient.on('error', err => {
        console.error('Cache Redis Error:', err);
    });
    subscriberClient.on('error', err => {
        console.error('Subscriber Redis Error:', err);
    });

    await cacheClient.connect();
    await subscriberClient.connect();
    console.log('Redis Connected');
}

module.exports = {
    connectRedis,
    cacheClient,
    subscriberClient
};