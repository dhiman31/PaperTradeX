const notifyRepository = require('../repository/notifyRepository');
const sendEmailVerification = require('./emailService');

class notifyService{

    constructor(){
        this.notifyRepo = new notifyRepository()
    }

    sendVerificationEmail = async(data) => {
        try {
            const email = data.email;
            const otp = data.email;
            await sendEmailVerification(email , otp);
        } catch (error) {
            console.log("Error in notify Service")
            throw error;
        }
    }

    createNotification = async (data) => {
        try {
        const {type, otp, userEmail} = data;
            
        if (!type || !otp || !userEmail) {
        throw new Error('Invalid notification payload');
        }

        const payload = {
            content : otp,
            type,
            userEmail,
            status : "PENDING"
        }
        const notification = await this.notifyRepo.createNotification(payload);
        return notification;

        } catch (error) {
        throw error;
        }
    }

    fetchAll = async () => {
    try {
        const notification = await this.notifyRepo.fetchAll();
        return notification;
    } catch (error) {
        throw error;
    }
    }

    fetchAllPending = async () => {
    try {
        const notifications = await this.notifyRepo.fetchAllPending({status:'PENDING'});
        return notifications;
    } catch (error) {
        throw error;
    }
    }

}

module.exports = notifyService
