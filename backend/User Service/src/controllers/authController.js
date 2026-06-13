const authService = require('../services/authService')

const userServ = new authService()

const register = async (req,res) => {
    try {
        const user = await userServ.register(req.body);
        const userData = user.toJSON();
        userData.password = '*****';

        return res.status(201).json({
            data : userData,
            success : true,
            message : 'Successfully created user',
            err : {}
        })

    } catch (error) {
        return res.status(400).json({
            data:{},
            success:false,
            message : error.message,
            err : error
        })
    }
}

const login = async (req,res) => {
    try {
        const token = await userServ.login(req.body);
        return res.status(201).json({
            data : token,
            success : true,
            message : 'Successfully login',
            err : {}
        })

    } catch (error) {
        console.log("Something went wrong in controller")
        return res.status(500).json({
            data:{},
            success:false,
            message : error.message,
            err : error
        })
    }
}

const deleteAccount = async (req,res) => {
    try {
        const response = await userServ.deleteAccount(req.body);
        return res.status(201).json({
            data : response ,
            success : true,
            message : 'Successfully deleted user',
            err : {}
        })

    } catch (error) {
        console.log("Issue in controller");
        return res.status(500).json({
            data:{},
            success:false,
            message : error.message,
            err : error
        })
    }
}

const initiateVerification = async (req,res) => {
    try {
        const response = await userServ.initiateVerification(req.body);
        return res.status(201).json({
            data : response ,
            success : true,
            message : 'Successfully initiated user email',
            err : {}
        })

    } catch (error) {
        console.log("Issue in controller");
        return res.status(500).json({
            data:{},
            success:false,
            message : error.message,
            err : error
        })
    }
}

const verifyEmailViaOTP = async (req,res) => {
    try {
        const response = await userServ.verifyEmailViaOTP(req.body);
        return res.status(201).json({
            data : response ,
            success : true,
            message : 'Successfully verified user email',
            err : {}
        })

    } catch (error) {
        console.log("Issue in controller");
        return res.status(500).json({
            data:{},
            success:false,
            message : error.message,
            err : error
        })
    }
}

module.exports = {
    register,
    login,
    deleteAccount,
    initiateVerification,
    verifyEmailViaOTP
}