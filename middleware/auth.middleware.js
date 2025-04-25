// const jwt = require('jsonwebtoken');
// require('dotenv').config();

// const JWT_SECRET = process.env.JWT_SECRET;

// const verifyToken = (token, secret) => {
//     return new Promise((resolve, reject) => {
//         jwt.verify(token, secret, (err, decoded) => {
//             if (err) {
//                 reject(err);
//             } else {
//                 resolve(decoded);
//             }
//         });
//     });
// };

// const authMiddleware = async (req, res, next) => {
//     const token = req.cookies.accessToken || req.headers['authorization']?.split(' ')[1]; 


//     if (!token) {
//         return res.status(401).json({ message: "Token topilmadi" });
//     }

//     try {
//         const decoded = await verifyToken(token, JWT_SECRET);
//         req.user = decoded; // Foydalanuvchi ma'lumotlarini qo‘shish
//         console.log(req.user);
        
//         next();
//     } catch (err) {
//         return res.status(403).json({ message: "Token noto‘g‘ri yoki muddati tugagan" });
//     }
// };


// // Profilega kirishni tekshiruvchi middleware
// const profileMiddleware = (req, res, next) => {
//     if (!req.user) {
//         return res.status(403).json({ message: "Foydalanuvchi ma'lumotlari mavjud emas" });
//     }

//     if (req.user.id !== req.params.id) {
//         return res.status(403).json({ message: "Siz faqat o'zingizning profilga kirishingiz mumkin" });
//     }

//     next();
// };

// module.exports = { authMiddleware, profileMiddleware };







const jwt = require("jsonwebtoken");
const BaseError = require("../utils/BaseError");

const profileMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw BaseError.Unauthorized("Token taqdim etilmagan yoki noto‘g‘ri formatda");
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      throw BaseError.Unauthorized("Token taqdim etilmagan");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.id) {
      throw BaseError.Unauthorized("Token noto‘g‘ri: foydalanuvchi ID topilmadi");
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error("Autentifikatsiya xatosi:", error.message);
    res.status(error.statusCode || 401).json({ message: error.message || "Autentifikatsiya xatosi" });
  }
};

// Agar authMiddleware kerak bo‘lsa, uni qo‘shishingiz mumkin
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw BaseError.Unauthorized("Token taqdim etilmagan yoki noto‘g‘ri formatda");
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      throw BaseError.Unauthorized("Token taqdim etilmagan");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.id) {
      throw BaseError.Unauthorized("Token noto‘g‘ri: foydalanuvchi ID topilmadi");
    }

    req.user = decoded;

    // Faqat parametrli so‘rovlar uchun tekshirish
    if (req.params.id && req.user.id !== req.params.id) {
      throw new BaseError(403, "Siz faqat o'zingizning profilga kirishingiz mumkin");
    }

    next();
  } catch (error) {
    console.error("Autentifikatsiya xatosi:", error.message);
    res.status(error.statusCode || 401).json({ message: error.message || "Autentifikatsiya xatosi" });
  }
};

module.exports = { authMiddleware, profileMiddleware };