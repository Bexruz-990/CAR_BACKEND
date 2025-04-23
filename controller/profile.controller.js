const User = require('../models/User');
const Category = require('../models/Category');
const Car = require('../models/Car');


// GET /api/profile
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'Foydalanuvchi topilmadi' });
        }
        res.status(200).json(user.profile || {});
    } catch (error) {
        console.error('Profil olish xatosi:', error.message);
        res.status(500).json({ message: 'Server xatosi' });
    }
};

// PUT /api/profile
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

// GET /api/profile/admin
const getAdminProfile = async (req, res) => {
    try {
        const categories = await Category.find({ createdBy: req.user.id });
        const cars = await Car.find({ createdBy: req.user.id }).populate('category');

        res.status(200).json({
            message: "Admin profilingizdagi yaratilgan obyektlar",
            categories,
            cars
        });
    } catch (error) {
        console.error('Admin profilingni olishda xatolik:', error.message);
        res.status(500).json({ message: 'Server xatosi' });
    }
};
const getProfileData = async (req, res) => {
    try {
      const categories = await Category.find({ createdBy: req.user.id }).select('_id name');
      const cars = await Car.find({ createdBy: req.user.id }).select('_id name model');
  
      res.status(200).json({
        categories,
        cars
      });
    } catch (error) {
      console.error('Ma\'lumotlarni olishda xatolik:', error.message);
      res.status(500).json({ message: 'Server xatosi' });
    }
  };
  

module.exports = {
    getProfile,
    updateProfile,
    getAdminProfile,
    getProfileData
};
