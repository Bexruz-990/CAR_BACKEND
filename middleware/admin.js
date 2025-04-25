// const BaseError = require("../Utils/BaseError");
// const jwt = require("jsonwebtoken");
// const User = require("../models/User"); // User modelini import qilamiz

// const chekAdmin = async (req, res, next) => {
//   try {
//     // Authorization header’ni tekshiramiz
//     const authHeader = req.headers.authorization;
//     console.log("Authorization Header:", authHeader);

//     if (!authHeader || !authHeader.startsWith("Bearer")) {
//       return next(BaseError.Unauthorized(401, "Token topilmadi!"));
//     }

//     // Tokenni olish va dekod qilish
//     const accessToken = authHeader.split(" ")[1];
//     const decode = jwt.verify(accessToken, process.env.JWT_SECRET);
//     console.log("Decoded Token:", decode);
//     req.user = decode;

//     // Foydalanuvchini bazadan topamiz
//     const user = await User.findById(req.user.id);
//     if (!user) {
//       return next(BaseError.Unauthorized(404, "Foydalanuvchi topilmadi!"));
//     }

//     // Foydalanuvchi rolini tekshiramiz
//     const allowedRoles = ["admin", "superadmin"];
//     if (!allowedRoles.includes(user.role)) {
//       return next(BaseError.Unauthorized(403, `Sizda bunday ruxsat yo‘q! Role: ${user.role}`));
//     }

//     // Agar hamma narsa to‘g‘ri bo‘lsa, req.user ga role’ni qo‘shamiz (keyingi middleware’lar uchun foydali)
//     req.user.role = user.role;

//     next();
//   } catch (error) {
//     console.error("Token Verification Error:", error.message);
//     return next(BaseError.Unauthorized(401, `Noto‘g‘ri yoki muddati o‘tgan token! Xato: ${error.message}`));
//   }
// };

// module.exports = chekAdmin;
const BaseError = require("../utils/BaseError")
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const chekAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    // console.log("Authorization Header:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(401).json({ error: 401, message: "Token topilmadi!" });
    }

    const accessToken = authHeader.split(" ")[1];
    const decode = jwt.verify(accessToken, process.env.JWT_SECRET);
    // console.log("Decoded Token:", decode);
    req.user = decode;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 404, message: "Foydalanuvchi topilmadi!" });
    }

    const allowedRoles = ["admin", "superadmin"];
    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ error: 403, message: `Sizda bunday ruxsat yo‘q! Role: ${user.role}` });
    }

    req.user.role = user.role;
    next();
  } catch (error) {
    console.error("Token Verification Error:", error.message);
    return res.status(401).json({ error: 401, message: `Noto‘g‘ri yoki muddati o‘tgan token! Xato: ${error.message}` });
  }
};

module.exports = chekAdmin;