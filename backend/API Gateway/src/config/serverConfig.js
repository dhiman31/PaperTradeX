const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    PORT : process.env.PORT,
    USER_URL : process.env.USER_URL,
    PRICE_URL : process.env.PRICE_URL,
    WATCHLIST_URL : process.env.WATCHLIST_URL,
    PORTFOLIO_URL : process.env.PORTFOLIO_URL,
    ORDER_URL : process.env.ORDER_URL,
    JWT_KEY : process.env.JWT_KEY
}