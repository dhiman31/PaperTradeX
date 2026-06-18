const redis = require('redis');

const client = redis.createClient({
    url: process.env.REDIS_URL
});

client.on('error', (err) => {
    console.log(err);
});

const connectRedis = async () => {
    try {
        await client.connect();
        console.log('Redis connected');
    } catch(err){
        console.log(err);
        process.exit(1);
    }
};

module.exports = {
    client,
    connectRedis
};