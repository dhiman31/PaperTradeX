const axios = require('axios');
const { PRICE_SERVICE_URL } = require('../config/serverConfig');

const fetchCurrentPrice = async (symbol) => {
    const { data } = await axios.get(`${PRICE_SERVICE_URL}/api/v1/prices/${symbol}`);
    return Number(data.price);
};

module.exports = fetchCurrentPrice