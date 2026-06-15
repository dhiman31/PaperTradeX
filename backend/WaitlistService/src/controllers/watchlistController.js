const WatchlistService = require('../services/watchlistService');

const watchlistService = new WatchlistService();

async function addSymbol(req,res){
    try{
        const {id,symbol} = req.body;
        const response = await watchlistService.addSymbol(id,symbol);
        return res.status(201).json({
            success:true,
            data:response
        });
    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        });
    }
}

async function removeSymbol(req,res){
    try{
        const {id,symbol} = req.body;
        const response = await watchlistService.removeSymbol(id,symbol);

        return res.status(200).json({
            success:true,
            data:response
        });

    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        });
    }
}

async function getWatchlist(req,res){
    try{
        const {id} = req.body;
        const response = await watchlistService.getWatchlist(id);
        return res.status(200).json({
            success:true,
            data:response
        });
    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        });
    }
}

module.exports = {
    addSymbol,
    removeSymbol,
    getWatchlist
};