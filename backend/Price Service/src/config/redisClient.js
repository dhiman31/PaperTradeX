const redis = require('redis');

const cacheClient = redis.createClient({
    url: "redis://localhost:6379"
});
const subscriberClient = redis.createClient({
    url: "redis://localhost:6379"
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