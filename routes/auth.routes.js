const express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const {
    validateRegister,
    validateVerifyEmail,
    validateLogin,
    validateRefreshToken,
    validateForgotPassword,
    validateChangePassword,
} = require("../Validation/auth.Validation");
const {
    register,
    verifyEmail,
    login,
    refreshToken,
    logout,
    forgotPassword,
    changePassword,
} = require("../controller/auth.controller");


router.post('/register', validateRegister, register);
router.post('/verify', validateVerifyEmail, verifyEmail);
router.post('/login', validateLogin, login);
router.post('/refresh-token', validateRefreshToken, refreshToken);
router.post('/forgot-password', validateForgotPassword, forgotPassword);
router.post('/logout', authMiddleware, logout);
router.post('/change-password', validateChangePassword, changePassword);

module.exports = router;