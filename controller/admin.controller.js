const User = require('../models/User'); // User modelini import qilamiz

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password -refreshToken -otp -resetPasswordCode -otpExpires'); // Sezgir ma'lumotlarni olib tashlaymiz
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
        const { id } = req.params;
        const { role } = req.body;

        if (!role) {
            return res.status(400).json({ message: 'Rolni kiritish majburiy' });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'Foydalanuvchi topilmadi' });
        }

        // User modelidagi enum bilan moslashtiramiz
        const validRoles = ['user', 'admin', 'superadmin']; // User.js da aniqlangan rollar
        if (!validRoles.includes(role)) {
            return res.status(400).json({ message: `Noto'g'ri rol. Faqat ${validRoles.join(', ')} rollaridan birini tanlang.` });
        }

        user.role = role;
        await user.save();

        res.status(200).json({ message: 'Foydalanuvchi roli yangilandi', user: user.toJSON() }); // toJSON ni ishlatamiz (User.js da aniqlangan transform)
    } catch (error) {
        console.error('Rol o‘zgartirish xatosi:', error);
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: 'Validatsiya xatosi', errors });
        }
        res.status(500).json({ message: 'Server xatosi' });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // O‘chirilayotgan foydalanuvchi o‘zi bo‘lmasligini tekshirish (agar kerak bo‘lsa)
        if (req.user.id === id) {
            return res.status(400).json({ message: 'O‘zingizni o‘chira olmaysiz' });
        }

        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: 'Foydalanuvchi topilmadi' });
        }

        res.status(200).json({ message: 'Foydalanuvchi o‘chirildi' });
    } catch (error) {
        console.error('Foydalanuvchi o‘chirish xatosi:', error);
        res.status(500).json({ message: 'Server xatosi' });
    }
};

module.exports = {
    getAllUsers,
    updateUserRole,
    deleteUser,
};