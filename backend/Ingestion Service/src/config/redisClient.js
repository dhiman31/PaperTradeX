const redis = require('redis');

const publisher = redis.createClient({
    url: "redis://localhost:6379"
});

async function connectRedis() {
    await publisher.connect();
    console.log('Redis Connected');
}

module.exports = {
    connectRedis,
    publisher
};