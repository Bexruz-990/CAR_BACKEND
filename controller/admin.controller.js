
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET muhit o‘zgaruvchisi aniqlanmagan');
}

const verifyToken = (token, secret) => {
    return jwt.verify(token, secret);
};

const authMiddleware = async (req, res, next) => {
    const token = req.cookies.accessToken || 
     (req.headers['authorization'] && req.headers['authorization'].startsWith('Bearer ') 
     ? req.headers['authorization'].split(' ')[1] 
     : null);

    if (!token) {
        return res.status(401).json({ message: 'Token topilmadi' });
    }

    try {
        const decoded = verifyToken(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            return res.status(403).json({ message: 'Token noto‘g‘ri' });
        }
        if (err.name === 'TokenExpiredError') {
            return res.status(403).json({ message: 'Token muddati tugagan' });
        }
        return res.status(403).json({ message: 'Token tekshirishda xato' });
    }
};
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password -refreshToken -otp -resetPasswordCode -otpExpires'); 
        if (!users || users.length === 0) {
            return res.status(404).json({ message: 'Foydalanuvchilar topilmadi' });
        }
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        console.error('Foydalanuvchilarni olish xatosi:', error);
        res.status(500).json({ success: false, message: 'Server xatosi' });
    }
};
const updateUserRole = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id);
        if (!currentUser || currentUser.role !== 'superadmin') {
            return res.status(403).json({ message: 'Faqat superadmin rol o‘zgartira oladi' });
        }

        const { id } = req.params;
        const { role } = req.body;

        if (req.user.id === id) {
            return res.status(400).json({ message: 'O‘z rolingizni o‘zgartira olmaysiz' });
        }

        const validRoles = ['user', 'admin', 'superadmin'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ message: `Ruxsat etilgan rollar: ${validRoles.join(', ')}` });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'Foydalanuvchi topilmadi' });
        }

        user.role = role;
        await user.save();

        res.status(200).json({ message: 'Roli yangilandi', user: { id: user._id, role: user.role } });
    } catch (error) {
        console.error('updateUserRole xatolik:', { error, userId: req.params.id, role: req.body.role });
        res.status(500).json({ message: 'Server xatosi' });
    }
};

const deleteUser = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id);
        if (!currentUser || !['admin', 'superadmin'].includes(currentUser.role)) {
            return res.status(403).json({ message: 'Faqat admin yoki superadmin foydalanuvchini o‘chira oladi' });
        }

        const { id } = req.params;

        if (req.user.id === id) {
            return res.status(400).json({ message: 'O‘zingizni o‘chira olmaysiz' });
        }

        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: 'Foydalanuvchi topilmadi' });
        }

        res.status(200).json({ message: 'Foydalanuvchi o‘chirildi', userId: id });
    } catch (error) {
        console.error('deleteUser xatolik:', { error, userId: req.params.id });
        res.status(500).json({ message: 'Server xatosi' });
    }
};

module.exports = {
    authMiddleware,
    getAllUsers,
    updateUserRole,
    deleteUser,
};


