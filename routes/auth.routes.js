const express = require('express');
const router = express.Router();
const {register, verifyEmail, refreshToken, login, logout, forgotPassword, changePassword} = require("../controller/auth.controller");
const {authMiddleware} = require("../middleware/auth.middleware");

// Ro'yxatdan o'tish
router.post('/register', register);

// Emailni tasdiqlash
router.post('/verify', verifyEmail);

// Kirish
router.post('/login', login);

// Refresh token
router.post('/refresh-token', refreshToken);

// Chiqish
router.post('/logout', authMiddleware, logout);

// Parolni tiklash kodi yuborish
router.post('/forgot-password', forgotPassword);

// Parolni yangilash
router.post('/change-password', changePassword);

module.exports = router;
