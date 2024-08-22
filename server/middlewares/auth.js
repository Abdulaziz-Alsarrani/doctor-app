const models = require('../models');
const jsonwebtoken = require('jsonwebtoken');

const isLoggedIn = async (req, res, next) => {
    try{
        if(!req.headers.authorization){
            res.status(400).json({message: 'there is no code'})
        }

        const token = req.headers.authorization.split(" ")[1];
        const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
        req.currentUser = decoded;
        next()
    } catch (e) {
        res.status(500).json(e.message)
    }
}

module.exports = isLoggedIn;