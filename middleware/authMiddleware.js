const jwt = require('jsonwebtoken');
require('dotenv').config()
const ADMIN = require('../models/admin');

const authenticateToken = async (req, res, next) => {
    try {

        const authHeader = req.headers.authorization;

        if (!authHeader) {
            throw new Error("No Token Provided !");
        }

        const Token = authHeader.split(' ')[1];

        if (!Token) {
            throw new Error("Invalid Token Format !");
        }

        const validateToken = await jwt.verify(Token, process.env.JWT_SECRET_KEY);

        if (!validateToken) {
            throw new Error("Invalid signature !");
        }

        const validateUser = await ADMIN.findById(validateToken._id);

        if (!validateUser) {
            throw new Error("No valid Admin Found For This Token OR Invalid Token Detect !")
        }

        next()

    } catch (error) {
        // Handle specific JWT errors
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token has expired. Please log in again !" });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Invalid token. Please log in again !" });
        }

        // For other errors
        res.status(404).json({
            message: error.message
        });
    }

};

module.exports = authenticateToken;