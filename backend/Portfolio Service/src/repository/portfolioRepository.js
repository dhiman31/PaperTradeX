const {Portfolio} = require('../models/index');

class PortfolioRepository{

    async createUserPortfolio(userId){
        try {
            return await Portfolio.create({
                userId,
                cashBalance:10000,
                initialBalance:10000
            });
        } catch (error) {
            console.log("Error in the portfolio repository");
            throw error;
        }
    }

    async fetchUserBalanceDetails(userId,transaction){
        try {
            return await Portfolio.findOne({
                where:{
                    userId
                },
                transaction
            });
        } catch (error) {
            console.log("Error in the portfolio repository");
            throw error;
        }
    }

    async updateBalance(userId,updatedBalance,transaction){
        try {
            await Portfolio.update(
                {
                    cashBalance:updatedBalance
                },
                {
                    where:{
                        userId
                    },
                    transaction
                }
            );

            return await Portfolio.findOne({
                    where:{
                        userId
                    },
                    transaction
                }
            );
        } catch (error) {
            console.log("Error in the portfolio repository");
            throw error;
        }
    }
}

module.exports = PortfolioRepository;