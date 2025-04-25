const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth.middleware');
const { getAllCategories, createCategory, deleteCategory } = require('../controller/categories.controller');
const { validateCategory } = require('../Validation/category.validation');
const chekAdmin = require('../middleware/admin');

// Barcha kategoriyalarni olish
router.get('/AllCategory', getAllCategories);

// Kategoriya qo‘shish
router.post('/Addcategory', chekAdmin, validateCategory, createCategory);

// Kategoriya o‘chirish
router.delete('/deleteCategory/:name', chekAdmin, deleteCategory);

module.exports = router;
/////////////////////////////