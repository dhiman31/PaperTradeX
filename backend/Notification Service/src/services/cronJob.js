const cron = require('node-cron');
const notifyService = require('../services/notifyService');
const { EMAIL_ID } = require('../config/serverConfig');
const sender = require('../config/emailConfig');
const {Notification} = require('../models/index')
const emailService = require('./emailService');

const setUpJobs = () => {

    const notifyServ = new notifyService()
    const emailServ = new emailService()

    cron.schedule('*/10 * * * * *' , async() => {

        const notifications = await notifyServ.fetchAllPending();
        console.log(notifications);
        
        for (const element of notifications) {
            
            await emailServ.sendEmailVerification(element.dataValues.userEmail , element.dataValues.content)
            await Notification.update(
                { status: 'SENT' },
                { where: { id: element.dataValues.id } }
            );
        }
    })
}

module.exports = {
    setUpJobs
}