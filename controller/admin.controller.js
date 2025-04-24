const User = require('../models/User');

// Barcha foydalanuvchilarni olish (admin yoki superadmin)
const getAllUsers = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id);
        if (!currentUser || !['admin', 'superadmin'].includes(currentUser.role)) {
            return res.status(403).json({ message: 'Ruxsat yo‘q' });
        }

        const users = await User.find().select('-password -refreshToken -otp -resetPasswordCode -otpExpires');
        if (!users.length) {
            return res.status(404).json({ message: 'Foydalanuvchilar topilmadi' });
        }

        res.status(200).json({ success: true, data: users });
    } catch (error) {
        console.error('getAllUsers xatolik:', error);
        res.status(500).json({ message: 'Server xatosi' });
    }
};

// Foydalanuvchining rolini yangilash (faqat superadmin)
const updateUserRole = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id);
        if (!currentUser || currentUser.role !== 'superadmin') {
            return res.status(403).json({ message: 'Faqat superadmin rol o‘zgartira oladi' });
        }

        const { id } = req.params;
        const { role } = req.body;

        const validRoles = ['user', 'admin', 'superadmin'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ message: `Noto‘g‘ri rol. Faqat ${validRoles.join(', ')}` });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'Foydalanuvchi topilmadi' });
        }

        user.role = role;
        await user.save();

        res.status(200).json({ message: 'Roli yangilandi', user });
    } catch (error) {
        console.error('updateUserRole xatolik:', error);
        res.status(500).json({ message: 'Server xatosi' });
    }
};

// Foydalanuvchini o‘chirish (o‘zini o‘chirib bo‘lmaydi)
const deleteUser = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id);

        if (req.user.id === req.params.id) {
            return res.status(400).json({ message: 'O‘zingizni o‘chira olmaysiz' });
        }

        if (!currentUser || !['admin', 'superadmin'].includes(currentUser.role)) {
            return res.status(403).json({ message: 'Faqat admin yoki superadmin foydalanuvchini o‘chira oladi' });
        }

        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Foydalanuvchi topilmadi' });
        }

        res.status(200).json({ message: 'Foydalanuvchi o‘chirildi' });
    } catch (error) {
        console.error('deleteUser xatolik:', error);
        res.status(500).json({ message: 'Server xatosi' });
    }
};

module.exports = {
    getAllUsers,
    updateUserRole,
    deleteUser,
};
