const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    PORT : process.env.PORT,
    JWT_KEY : process.env.JWT_KEY,
    PRICE_SERVICE_URL : process.env.PRICE_SERVICE_URL,
    INTERNAL_SECRET : process.env.INTERNAL_SECRET,
    PORTFOLIO_SERVICE_URL : process.env.PORTFOLIO_SERVICE_URL,
    KAFKA_BROKER_IP : process.env.KAFKA_BROKER_IP
}