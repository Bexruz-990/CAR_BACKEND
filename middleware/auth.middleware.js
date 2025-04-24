const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

const verifyToken = (token, secret) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                reject(err);
            } else {
                resolve(decoded);
            }
        });
    });
};

const authMiddleware = async (req, res, next) => {
    const token = req.cookies.accessToken || req.headers['authorization']?.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ message: "Token topilmadi" });
    }

    try {
        const decoded = await verifyToken(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: "Token noto‘g‘ri yoki muddati tugagan" });
    }
};

const profileMiddleware = (req, res, next) => {
    if (!req.user) {
        return res.status(403).json({ message: "Foydalanuvchi ma'lumotlari mavjud emas" });
    }

    if (req.user.id !== req.params.id) {
        return res.status(403).json({ message: "Siz faqat o'zingizning profilga kirishingiz mumkin" });
    }

    next();
};

module.exports = { authMiddleware, profileMiddleware };
