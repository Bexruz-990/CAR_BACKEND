const User = require('../models/User');

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        if (!users || users.length === 0) {
            return res.status(404).json({ message: 'Foydalanuvchilar topilmadi' });
        }
        res.status(200).json(users);
    } catch (error) {
        console.error('Foydalanuvchilarni olish xatosi:', error);
        res.status(500).json({ message: 'Server xatosi' });
    }
};

const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        // Role mavjudligini tekshirish
        if (!role) {
            return res.status(400).json({ message: 'Rolni kiritish majburiy' });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'Foydalanuvchi topilmadi' });
        }

        user.role = role;
        await user.save();

        res.status(200).json({ message: 'Foydalanuvchi roli yangilandi', user });
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