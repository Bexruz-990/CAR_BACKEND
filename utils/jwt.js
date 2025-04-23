const jwt = require('jsonwebtoken');
require("dotenv").config()
const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;
const generateAccessToken = (user) => {
    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET muhit o‘zgaruvchisi mavjud emas');
    }
    return jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '15m' });
};
const generateRefreshToken = (user) => {
    if (!REFRESH_SECRET) {
        throw new Error('REFRESH_SECRET muhit o‘zgaruvchisi mavjud emas');
    }
    return jwt.sign({ id: user._id }, REFRESH_SECRET, { expiresIn: '7d' });
};
module.exports = { generateAccessToken, generateRefreshToken };

