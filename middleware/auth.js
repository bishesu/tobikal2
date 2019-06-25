const User = require('../models/user');
const jwt = require('jsonwebtoken');

const auth = async(req, response, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer', '')
        const decoded = jwt.verify(token, 'thisisloginuser')
        const user = await User.findOne({
            _id: decoded._id,
            'tokens.token': token
        })
        if (!user) {
            throw new Error()
        }
        req.token = token;
        req.user = user;
        next()
    } catch (error) {
        response.status(401).send({
            error: 'Authentication failed.'
        })
    }
}
module.exports = auth;