const User = require('../models/User');
const Category = require('../models/Category');
const Car = require('../models/Car');
const BaseError = require('../utils/BaseError');

const getProfile = async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        throw BaseError.Unauthorized("Foydalanuvchi autentifikatsiyadan o‘tmagan");
      }
  
      const user = await User.findById(req.user.id);
      if (!user) {
        throw new BaseError(404, "Foydalanuvchi topilmadi");
      }
  
      console.log("USER:", user);
  
      const response = {
        profile: {
          phoneNumber: user.profile?.phoneNumber || '',
          username: user.username,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      };
  
      if (user.role === 'admin' || user.role === 'superadmin') {
        const cars = await Car.find({ createdBy: req.user.id }).select('_id nomi markasi');
        response.cars = cars;
      }
  
      res.status(200).json(response);
    } catch (error) {
      console.error("Profil olish xatosi:", error);
      const statusCode = error.statusCode && Number.isInteger(error.statusCode) ? error.statusCode : 500;
      res.status(statusCode).json({ message: error.message || "Server xatosi" });
    }
  };

const updateProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      throw BaseError.Unauthorized("Foydalanuvchi autentifikatsiyadan o‘tmagan");
    }

    const { fullName, phone } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      throw BaseError.NotFound("Foydalanuvchi topilmadi");
    }

    user.profile = { fullName, phone };
    await user.save();

    res.status(200).json(user.profile);
  } catch (error) {
    console.error('Profil yangilash xatosi:', error.message);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: "Validation error", errors });
    }
    res.status(error.statusCode || 500).json({ message: error.message || "Server xatosi" });
  }
};

const getAdminProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      throw BaseError.Unauthorized("Foydalanuvchi autentifikatsiyadan o‘tmagan");
    }

    const categories = await Category.find({ createdBy: req.user.id });
    const cars = await Car.find({ createdBy: req.user.id }).populate('category');

    res.status(200).json({
      message: "Admin profilingizdagi yaratilgan obyektlar",
      categories,
      cars
    });
  } catch (error) {
    console.error('Admin profilingni olishda xatolik:', error.message);
    res.status(error.statusCode || 500).json({ message: error.message || "Server xatosi" });
  }
};

const getProfileData = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      throw BaseError.Unauthorized("Foydalanuvchi autentifikatsiyadan o‘tmagan");
    }

    const categories = await Category.find({ createdBy: req.user.id }).select('_id name');
    const cars = await Car.find({ createdBy: req.user.id }).select('_id name model');

    res.status(200).json({
      categories,
      cars
    });
  } catch (error) {
    console.error('Ma\'lumotlarni olishda xatolik:', error.message);
    res.status(error.statusCode || 500).json({ message: error.message || "Server xatosi" });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getAdminProfile,
  getProfileData
};