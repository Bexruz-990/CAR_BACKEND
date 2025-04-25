const express = require('express');
const router = express.Router();
const {register, verifyEmail, refreshToken, login, logout, forgotPassword, changePassword} = require("../controller/auth.controller");


router.post('/register', register);
router.post('/verify', verifyEmail);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/change-password', changePassword);

module.exports = router;
/////////////////////////////////////////////////