const {createNotification,fetchAll} = require('../services/notifyService');

const createEmail = async (req,res) => {
    try {
        const notificationData = {
            subject : req.body.type,
            content : req.body.content,
            userEmail : req.body.userEmail
        }

        const notification = await createNotification(notificationData);
        return res.status(200).json({
            data : notification,
            success : true,
            message : 'Successfully created notification',
            err : {}
        })
        
    } catch (error) {
            return res.status(500).json({
            data:{},
            success:false,
            message : error.message || 'Not able to create notification',
            err : error.explaination || error
        })
    }
}

const getAll = async (req,res) => {
    try {
        const notifications = await fetchAll();
        return res.status(200).json({
            data : notifications,
            success : true,
            message : 'Successfully fetched all notifications',
            err : {}
        })
    } catch (error) {
        return res.status(500).json({
            data:{},
            success:false,
            message : error.message || 'Not able to fetch notifications',
            err : error.explaination || error
        })
    }
}

module.exports = {
    createEmail,
    getAll
}