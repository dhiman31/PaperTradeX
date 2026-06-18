const redis = require('redis');

const publisher = redis.createClient({
    url: process.env.REDIS_URL
});

async function connectRedis() {
    await publisher.connect();
    console.log('Redis Connected');
}

module.exports = {
    connectRedis,
    publisher
};