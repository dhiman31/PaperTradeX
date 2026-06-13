const authService = require('../services/authService')

const validAuthRequest = (req,res,next) => {
    const {email , passwordHash} = req.body;
    if(!email || email.trim() === '')
    {
        return res.status(400).json({
        success: false,
        message: 'Email is required',
        data: {},
        err: {}
        });
    }
    if(!passwordHash || passwordHash.trim() === '')
    {
        return res.status(400).json({
        success: false,
        message: 'Password is required',
        data: {},
        err: {}
    });
    }

    next();
}

const isAuthenticated = async (req, res, next) => {
    try {
        const authServ = new authService()
        const token = req.headers['x-access-token'];
        const response = await authServ.isAuthenticated(token);

        if (!req.body) {
            req.body = {};
        }

        req.body.id = response.id
        req.body.email = response.email
        req.body.isVerified = response.isVerified
        
        next();
    } catch (error) {
        return res.status(401).json({
            data: {},
            success: false,
            message: error.message,
            err: error
        });
    }
};

module.exports = {
    validAuthRequest,
    isAuthenticated
}