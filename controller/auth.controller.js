const bcrypt = require('bcrypt');
const User = require('../models/User');
const { generateAccessToken, generateRefreshToken, REFRESH_SECRET } = require('../utils/jwt');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../utils/email');
const BaseError = require("../utils/BaseError");

const register = async (req, res) => {
    try {
        const { username, email, password, phoneNumber } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Bu email bilan foydalanuvchi allaqachon mavjud' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        const user = new User({
            username,
            email,
            password: hashedPassword,
            phoneNumber,
            otp: verificationCode,
            isVerified: false,
        });

        await user.save();
        await sendEmail(email, verificationCode);

        res.status(201).json({ message: "Ro'yxatdan o'tildi, kod emailingizga yuborildi." });
    } catch (error) {
        console.error('Register xatosi:', error.message);
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: 'Validation error', errors });
        }
        res.status(500).json({ message: 'Server xatosi' });
    }
};

const verifyEmail = async (req, res) => {
    try {
        const { email, code } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'Foydalanuvchi topilmadi' });

        if (user.otp !== String(code)) {
            return res.status(400).json({ message: 'Noto‘g‘ri tasdiqlash kodi' });
        }

        user.isVerified = true;
        user.otp = null;
        await user.save();

        res.status(200).json({ message: 'Email muvaffaqiyatli tasdiqlandi' });
    } catch (error) {
        console.error('Verify xatosi:', error.message);
        res.status(500).json({ message: 'Server xatosi' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Foydalanuvchi topilmadi' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Parol noto‘g‘ri' });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Refresh tokenni foydalanuvchi ma'lumotlar bazasida saqlaymiz
        user.refreshToken = refreshToken;
        await user.save();

        // Cookie sozlamasini to‘g‘rilaymiz
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // boolean qiymat
            sameSite: "strict",
            maxAge: 15 * 60 * 1000 // 15 daqiqa (access token muddati bilan mos)
        });

        res.status(200).json({
            message: "Tizimga kirish muvaffaqiyatli",
            accessToken,
            refreshToken,
        });
    } catch (error) {
        console.error('Login xatolik:', error);
        res.status(500).json({ message: 'Tizimga kirishda xatolik yuz berdi' });
    }
};

const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        const user = await User.findOne({ refreshToken });
        if (!user) return res.status(403).json({ message: 'Refresh token yaroqsiz' });

        jwt.verify(refreshToken, REFRESH_SECRET, (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Refresh token xato' });
            const accessToken = generateAccessToken(user);
            res.status(200).json({ accessToken });
        });
    } catch (error) {
        console.error('Refresh token xatosi:', error.message);
        res.status(500).json({ message: 'Server xatosi' });
    }
};

const logout = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'Foydalanuvchi topilmadi' });
        }

        user.refreshToken = null;
        await user.save();

        // Cookie’ni tozalaymiz
        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        res.status(200).json({ message: 'Chiqildi' });
    } catch (error) {
        console.error('Logout xatosi:', error.message);
        res.status(500).json({ message: 'Server xatosi' });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'Foydalanuvchi topilmadi' });

        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetPasswordCode = resetCode;
        user.resetPasswordExpires = new Date(Date.now() + 3600000);
        await user.save();

        await sendEmail(email, `Parolni tiklash uchun kod: ${resetCode}`);

        res.status(200).json({ message: 'Parolni tiklash kodi emailingizga yuborildi' });
    } catch (error) {
        console.error('Forgot password xatosi:', error.message);
        res.status(500).json({ message: 'Server xatosi' });
    }
};

const changePassword = async (req, res) => {
    try {
        const { email, code, newPassword } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Foydalanuvchi topilmadi" });
        }

        if (
            user.resetPasswordCode !== code ||
            new Date() > user.resetPasswordExpires
        ) {
            return res.status(400).json({ message: "Kod noto‘g‘ri yoki eskirgan" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetPasswordCode = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        return res.status(200).json({ message: "Parol muvaffaqiyatli o'zgartirildi!" });
    } catch (error) {
        console.error('Change password xatosi:', error.message);
        return res.status(500).json({ message: "Server xatosi", error: error.message });
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