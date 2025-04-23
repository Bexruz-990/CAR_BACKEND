const Category = require('../models/Category');

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
        const { name } = req.params;

        const category = await Category.findOneAndDelete({ name });
        if (!category) {
            return res.status(404).json({ message: 'Kategoriya topilmadi' });
        }

        res.status(200).json({ message: 'Kategoriya o‘chirildi' });
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
