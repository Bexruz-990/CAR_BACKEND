const User = require('../models/User');

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'Foydalanuvchi topilmadi' });
        }

        // Ensure profile exists; return empty object if undefined
        res.status(200).json(user.profile || {});
    } catch (error) {
        console.error('Profil olish xatosi:', error.message);
        res.status(500).json({ message: 'Server xatosi' });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { fullName, phone } = req.body;
        if (!fullName || !phone) {
            return res.status(400).json({ message: 'To‘liq ism va telefon raqami kiritilishi shart' });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'Foydalanuvchi topilmadi' });
        }

        user.profile = { fullName, phone };
        await user.save();

        res.status(200).json(user.profile);
    } catch (error) {
        console.error('Profil yangilash xatosi:', error.message);
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: 'Validation error', errors });
        }
        res.status(500).json({ message: 'Server xatosi' });
    }
};

module.exports = {
    getProfile,
    updateProfile,
};