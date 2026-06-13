const { where } = require('sequelize');
const {User} = require('../models/index')

class authRepository{

    async register(data){
        try {
            data.isVerified = false;
            const user = await User.create(data);
            return user;
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    async findUserByEmail(data){
        try {
            const user = await User.findOne({
                where : {
                    email : data.email
                }
            })
            return user;
        } catch (error) {
            console.log("Cannot find user")
            throw error;
        }
    }
    
    async deleteAccount (userId) {
        try {
            await User.destroy({
                where : {
                    id: userId
                }
            })
        } catch (error) {
            console.log("Cannot Delete the Account")
            throw error
        }
    }

   async updateVerificationStatus(data) {
        try {
            const user = await this.findUserByEmail({
                email:data.email
            })

            if(user.isVerified){
                throw new Error("Already verified")
            }

            await User.update(
                {
                    isVerified: true
                },
                {
                    where: {
                        id: data.id
                    }
                }
            );

            return true;
        } catch (error) {
            console.log("Cannot update verification status");
            throw error;
        }
    }

}

module.exports = authRepository