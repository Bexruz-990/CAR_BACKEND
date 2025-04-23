const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const {
  validateRegister,
  validateVerifyEmail,
  validateLogin,
  validateRefreshToken,
  validateForgotPassword,
  validateChangePassword,
} = require("../validation/auth.validation");
const {
  register,
  verifyEmail,
  login,
  refreshToken,
  logout,
  forgotPassword,
  changePassword,
} = require("../controller/auth.controller");

// Ro'yxatdan o'tish
router.post("/register", validateRegister, register);

// Email tasdiqlash
router.post("/verify", validateVerifyEmail, verifyEmail);

// Tizimga kirish
router.post("/login", validateLogin, login);

// Refresh token orqali yangi access token olish
router.post("/refresh-token", validateRefreshToken, refreshToken);

// Parolni unutganlar uchun kod yuborish
router.post("/forgot-password", validateForgotPassword, forgotPassword);

// Tizimdan chiqish (JWT autentifikatsiyasi talab qilinadi)
router.post("/logout", authMiddleware, logout);

// Parolni o'zgartirish
router.post("/change-password", validateChangePassword, changePassword);

module.exports = router;