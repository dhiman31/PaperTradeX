const axios = require('axios');
const { PORTFOLIO_SERVICE_URL, INTERNAL_SECRET } = require('../config/serverConfig');

const internalHeaders = { 'x-internal-secret': INTERNAL_SECRET };

const createPortfolio = async (userId) => {
    await axios.post(
        `${PORTFOLIO_SERVICE_URL}/api/v1/portfolio/internal/create`,
        { userId },
        { headers: internalHeaders }
    );
};

module.exports = createPortfolio;