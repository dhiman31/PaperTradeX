const axios = require('axios');
const {PRICE_SERVICE_URL} = require('../config/serverConfig');

const fetchCurrentPrice = async (symbol) => {

  const response = await axios.get(
    `${PRICE_SERVICE_URL}/api/v1/prices/${symbol}`
  );

  const ticker = response.data?.data;

  if (!ticker) {
    throw new Error(
      `Price not found for ${symbol}`
    );
  }

  const price = Number(
    ticker.price.currentPrice
  );

  if(Number.isNaN(price)){
    throw new Error(
      `Invalid price for ${symbol}`
    );
  }
  return price;
};

module.exports = fetchCurrentPrice;