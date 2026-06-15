const { Watchlist } = require('../models');

class WatchlistRepository {

    async addSymbolToUser(userId, symbol) {
        const [watchlist, created] = await Watchlist.findOrCreate({
            where: {
                userId,
                symbol
            },
            defaults: {
                userId,
                symbol
            }
        });

        return {
            watchlist,
            created
        };
    }

    async removeSymbol(userId, symbol) {
        return await Watchlist.destroy({
            where: {
                userId,
                symbol
            }
        });
    }

    async fetchAllWatchListSymbols(userId) {
        const records = await Watchlist.findAll({
            where: {
                userId
            },
            attributes: ['symbol']
        });
        return records.map(record => record.symbol);
    }

}

module.exports = WatchlistRepository;