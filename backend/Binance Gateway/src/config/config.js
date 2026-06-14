const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    KAFKA_CLIENT_ID : process.env.KAFKA_CLIENT_ID,
    KAFKA_TOPIC_MARKET_PRICE : process.env.KAFKA_TOPIC_MARKET_PRICE,
    KAFKA_BROKER_IP : process.env.KAFKA_BROKER_IP,
    BINANCE_STREAM_URL : process.env.BINANCE_STREAM_URL
}