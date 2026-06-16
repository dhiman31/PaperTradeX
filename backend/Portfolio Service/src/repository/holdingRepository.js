const {Holding} = require('../models/index');

class HoldingRepository{
    async createHolding(userId,symbol,quantity,price,transaction){
        try {
            return await Holding.create({
                    userId,
                    symbol,
                    quantity,
                    avgBuyPrice:price
                },{
                    transaction
                }
            );
        } catch (error) {
            console.log("Error in the holding repository");
            throw error;
        }
    }

    async doesUserHaveSomeHoldingForSymbol(userId,symbol,transaction){
        try {
            return await Holding.findOne({
                where:{
                    userId,
                    symbol
                },
                transaction
            });

        }catch(error){
            console.log("Error in the holding repository");
            throw error;
        }
    }

    async updateHolding(holdingId,quantity,price,transaction){
        try {
            const holding = await Holding.findByPk(
                holdingId,
                {
                    transaction
                }
            );
            const oldQuantity = Number(holding.quantity);

            const oldAvgPrice = Number(holding.avgBuyPrice);

            const newQuantity = oldQuantity + Number(quantity);

            const newAvgPrice = ( oldQuantity * oldAvgPrice + Number(quantity) * Number(price)) / newQuantity;

            await Holding.update({ quantity:newQuantity, avgBuyPrice:newAvgPrice},
                {
                    where:{
                        id:holdingId
                    },
                    transaction
                }
            );

            return await Holding.findByPk(holdingId,
                {
                    transaction
                }
            );

        } catch (error) {
            console.log("Error in the holding repository");
            throw error;
        }
    }

    async reduceHolding(userId,symbol,quantity,transaction){
        try {
            const holding = await Holding.findOne(
                {
                    where:{
                        userId,
                        symbol
                    },
                    transaction
                }
            );

            const remainingQuantity = Number(holding.quantity) - Number(quantity);

            if(remainingQuantity === 0){
                await Holding.destroy(
                    {
                        where:{
                            id:holding.id
                        },
                        transaction
                    }
                );
                return null;
            }

            await Holding.update({
                    quantity:remainingQuantity
                },
                {
                    where:{
                        id:holding.id
                    },
                    transaction
                }
            );

            return await Holding.findByPk(holding.id,
                {
                    transaction
                }
            );
        } catch (error) {
            console.log("Error in the holding repository");
            throw error;
        }
    }

    async fetchUserAllHolding(userId){
        try {
            return await Holding.findAll({
                where:{
                    userId
                }
            });
        } catch (error) {
            console.log("Error in the holding repository");
            throw error;
        }
    }

    async fetchUserSymbolHolding(userId,symbol){
        try {
            return await Holding.findOne({
                where:{
                    userId,
                    symbol
                }
        });
        }catch(error) {
            console.log("Error in the holding repository");
            throw error;
        }
    }
}

module.exports = HoldingRepository;