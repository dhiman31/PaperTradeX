const { getPrice } = require("../services/cacher");

async function getLatestPrice(req,res){
    try{
        const { symbol } = req.params;
        const price = await getPrice(symbol);

        if(!price){
            return res.status(404).json({
                success: false,
                message: 'Symbol not found'
            });
        }

        return res.status(200).json({
            success: true,
            data:{
                symbol,
                price
            }
        });

    }catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch price',
            error: error.message
        });
    }
}

module.exports = {
    getLatestPrice
};