const axios = require('axios');
const { PORTFOLIO_SERVICE_URL, INTERNAL_SECRET } = require('../config/serverConfig');

const internalHeaders = { 'x-internal-secret': INTERNAL_SECRET };

const callPortfolio = async (type, userId, symbol, amount, price) => {
    await axios.post(
        `${PORTFOLIO_SERVICE_URL}/api/v1/portfolio/internal/${type}`, // 'buy' | 'sell'
        { userId, symbol, quantity: amount, price },
        { headers: internalHeaders }
    );
};

module.exports = callPortfolio