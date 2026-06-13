const {Notification} = require('../models/index')

class notifyRepository {

    async createNotification (data) {
        try {
            const notification = await Notification.create(data);
            return notification;
        } catch (error) {
            throw error;
        }
    }

    // fetch all the notification
    async fetchAll () {
        try {
            const notifications = await Notification.findAll();
            return notifications;
        } catch (error) {
            throw error;
        }
    }

    // fetch all pendings
    async fetchAllPending (filter) {
        try {
            const notifications = await Notification.findAll({
                where : {
                    status : filter.status
                }
            });
            return notifications;
        } catch (error) {
            throw error;
        }
    }

}

module.exports = notifyRepository;