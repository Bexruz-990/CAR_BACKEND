const jwt = require("jsonwebtoken");

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "your-access-secret";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "your-refresh-secret";

const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, ACCESS_SECRET, { expiresIn: "15m" });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, REFRESH_SECRET, { expiresIn: "7d" });
};

module.exports = { generateAccessToken, generateRefreshToken, REFRESH_SECRET };


const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token topilmadi' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // decoded ichida `id` va `role` bo‘lishi kerak
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Token noto‘g‘ri yoki muddati o‘tgan' });
    }
};

module.exports = authenticate