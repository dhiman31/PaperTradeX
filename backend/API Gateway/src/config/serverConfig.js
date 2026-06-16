const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    PORT : process.env.PORT,
    USER_PORT : process.env.USER_PORT,
    PRICE_PORT : process.env.PRICE_PORT,
    WATCHLIST_PORT : process.env.WATCHLIST_PORT,
    PORTFOLIO_PORT : process.env.PORTFOLIO_PORT,
    ORDER_PORT : process.env.ORDER_PORT,
    JWT_KEY : process.env.JWT_KEY
}