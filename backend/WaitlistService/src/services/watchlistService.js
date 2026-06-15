const WatchlistRepository = require('../repository/watchlistRepository');

const watchlistRepository = new WatchlistRepository();

class WatchlistService{
   
    async addSymbol(userId,symbol){
        return await watchlistRepository.addSymbolToUser(userId,symbol);
    }

    async removeSymbol(userId,symbol){
        return await watchlistRepository.removeSymbol(userId,symbol);
    }

    async getWatchlist(userId){
        return await watchlistRepository.fetchAllWatchListSymbols(userId);
    }
}

module.exports = WatchlistService;