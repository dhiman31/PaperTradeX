const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    PORT : process.env.PORT,
    JWT_KEY : process.env.JWT_KEY,
    JWT_EXP : process.env.JWT_EXP,
    KAFKA_BROKER_IP : process.env.KAFKA_BROKER_IP,
    KAFKA_TOPIC_MARKET_PRICE : process.env.KAFKA_TOPIC_MARKET_PRICE
}