const jwt = require('jsonwebtoken');
const { JWT_KEY, INTERNAL_SECRET } = require('../config/serverConfig');

const verifyJwt = (req, res, next) => {
    const token = req.headers['x-access-header']?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    try {
        req.user = jwt.verify(token, JWT_KEY);
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};

const internalOnly = (req, res, next) => {
    if (req.headers['x-internal-secret'] !== INTERNAL_SECRET) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
};

module.exports = { verifyJwt, internalOnly };