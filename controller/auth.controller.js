const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendEmail } = require("../utils/email");
const BaseError = require("../utils/BaseError");
const { generateAccessToken, generateRefreshToken, REFRESH_SECRET } = require("../utils/jwt");
const JWT_SECRET = process.env.JWT_SECRET;


const register = async (req, res) => {
  try {
    const { username, email, password, phoneNumber } = req.body;


    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BaseError("Bu email bilan foydalanuvchi allaqachon mavjud", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);


    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const user = new User({
      username,
      email,
      password:hashedPassword,
      phoneNumber,
      otp:verificationCode,
      otpExpires: new Date(Date.now() + 10 * 60 * 1000), 
      isVerified: false,
    });

    await user.save();
    await sendEmail(email, `Parolni tasdiqlash kodi: ${verificationCode}`);

    res.status(201).json({
      message: "Ro'yxatdan o'tildi, kod emailingizga yuborildi.",
      // user: {
      //   // username: user.username,
      //   // email: user.email,
      //   // otp: user.otp,
      //   // otpExpires: user.otpExpires,
      //   // isVerified: user.isVerified,
      //   // phoneNumber: user.phoneNumber,
      // },
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || "Server xatosi" });
  }
};

// 2. Emailni tasdiqlash (Verify Email)
const verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw new BaseError("Foydalanuvchi topilmadi", 404);
    }

    // Tasdiqlash kodini tekshirish
    if (user.otp !== String(code) || new Date() > user.otpExpires) {
      throw new BaseError("Noto‘g‘ri yoki eskirgan tasdiqlash kodi", 400);
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.status(200).json({
      message: "Email muvaffaqiyatli tasdiqlandi",
      user: {
        username: user.username,
        email: user.email,
        isVerified: user.isVerified,
        phoneNumber: user.phoneNumber,
      },
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || "Server xatosi" });
  }
};

// 3. Kirish (Login)
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
      return res.status(400).json({ message: "Email yoki parolni to'ldiring" });
  }

  try {
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(404).json({ message: "Foydalanuvchi topilmadi" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(401).json({ message: "Parol noto‘g‘ri" });
      }

      const accessToken = jwt.sign(
          { id: user._id, email: user.email },
          JWT_SECRET,
          { expiresIn: '15m' }
      );

      const refreshToken = jwt.sign(
          { id: user._id, email: user.email },
          process.env.REFRESH_SECRET,
          { expiresIn: '7d' }
      );

      user.refreshToken = refreshToken;
      await user.save();

      res.cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 15 * 60 * 1000, 
      });

      res.status(200).json({
          message: "Tizimga kirish muvaffaqiyatli",
          accessToken,
          refreshToken,
      });
  } catch (error) {
      console.error("Login xatosi:", error.message);
      res.status(500).json({ message: "Serverda xato yuz berdi" });
  }
};
// 4. Refresh Token
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    const user = await User.findOne({ refreshToken });
    if (!user) {
      throw new BaseError("Refresh token yaroqsiz", 403);
    }

    jwt.verify(refreshToken, REFRESH_SECRET, (err, decoded) => {
      if (err) {
        throw new BaseError("Refresh token xato", 403);
      }
      const accessToken = generateAccessToken(user._id);
      res.status(200).json({ accessToken });
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || "Server xatosi" });
  }
};

// 5. Chiqish (Logout)
const logout = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      throw new BaseError("Foydalanuvchi topilmadi", 404);
    }

    // Refresh tokenni o'chirish
    user.refreshToken = null;
    await user.save();

    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({
      message: "Chiqildi",
      user: {
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
      },
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || "Server xatosi" });
  }
};

// 6. Parolni tiklash kodi yuborish (Forgot Password)
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw new BaseError("Bu email bilan foydalanuvchi topilmadi", 404);
    }

    // Parolni tiklash kodi yaratish
    const resetPasswordCode = Math.floor(100000 + Math.random() * 900000).toString();
    const resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 daqiqa

    // Kodni foydalanuvchiga yuborish
    user.resetPasswordCode = resetPasswordCode;
    user.resetPasswordExpires = resetPasswordExpires;
    await user.save();

    await sendEmail(user.email, `Parolni tiklash kodi: ${resetPasswordCode}`);

    res.status(200).json({
      message: "Parolni tiklash kodi emailingizga yuborildi",
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || "Server xatosi" });
  }
};

// 7. Parolni yangilash (Change Password)
const changePassword = async (req, res) => {
  try {
    const { email, resetPasswordCode, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw new BaseError("Foydalanuvchi topilmadi", 404);
    }

    // Reset kodi va muddati tekshiriladi
    if (user.resetPasswordCode !== resetPasswordCode || new Date() > user.resetPasswordExpires) {
      throw new BaseError("Noto‘g‘ri yoki eskirgan parol tiklash kodi", 400);
    }

    // Parolni yangilash
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordCode = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.status(200).json({
      message: "Parol muvaffaqiyatli yangilandi",
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || "Server xatosi" });
  }
};

module.exports = {
  register,
  verifyEmail,
  login,
  refreshToken,
  logout,
  forgotPassword,
  changePassword,
};
