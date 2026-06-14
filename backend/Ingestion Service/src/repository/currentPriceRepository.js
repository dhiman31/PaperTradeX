const { CurrentPrice } = require('../models');

async function bulkUpsertPrices(records) {

    return await CurrentPrice.bulkCreate(
        records,
        {
            updateOnDuplicate: [
                'currentPrice',
                'openPrice',
                'highPrice',
                'lowPrice',
                'updatedAt'
            ]
        }
    );

}

module.exports = {
    bulkUpsertPrices
};