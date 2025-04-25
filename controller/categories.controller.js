const Category = require('../models/Category');
const Car = require('../models/Car'); // Car modelini qo'shish
const axios = require('axios');

const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        console.error('Kategoriyalarni olish xatosi:', error.message);
        res.status(500).json({ message: 'Server xatosi' });
    }
};

const createCategory = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Kategoriya nomi kerak' });
        }

        const existing = await Category.findOne({ name });
        if (existing) {
            return res.status(400).json({ message: 'Bu kategoriya allaqachon mavjud' });
        }

        const category = new Category({ name });
        await category.save();

        res.status(201).json({ message: 'Kategoriya qo‘shildi', category });
    } catch (error) {
        console.error('Kategoriya qo‘shish xatosi:', error.message);
        res.status(500).json({ message: 'Server xatosi' });
    }
};

const deleteCategory = async (req, res) => {
    try {
      // Superadmin yoki admin rolini tekshirish
      if (!req.user || (req.user.role !== 'superadmin' && req.user.role !== 'admin')) {
        return res.status(403).json({ message: 'Faoliyatni bajarishga ruxsat yo‘q' });
      }
  
      // Kategoriya markasini olish
      const { name } = req.params; // URL parametrlardan 'name' ni olish
  
      // Markasi parametrining to'g'riligini tekshirish
      if (typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({ message: 'Iltimos, to‘g‘ri kategoriya nomini kiriting' });
      }
  
      // Kategoriya topish
      const category = await Category.findOne({ name: name.trim() });
      if (!category) {
        return res.status(404).json({ message: 'Kategoriya topilmadi' });
      }
  
      // Bu kategoriya bilan bog'langan mashinalarni o'chirish
      const cars = await Car.find({ category: category._id });
      if (cars.length > 0) {
        await Car.deleteMany({ category: category._id });
      }
  
      // Kategoriyani o‘chirish
      await Category.findOneAndDelete({ name: name.trim() });
  
      res.status(200).json({ message: 'Kategoriya va unga bog‘langan mashinalar o‘chirildi' });
    } catch (error) {
      console.error('Kategoriya o‘chirish xatosi:', error.message);
      res.status(500).json({ message: 'Server xatosi' });
    }
};


module.exports = {
    getAllCategories,
    createCategory,
    deleteCategory,
};
