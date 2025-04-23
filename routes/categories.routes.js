const express = require('express');
const router = express.Router();
const { getAllCategories, createCategory, deleteCategory } = require('../controller/categories.controller');
const { validateCategory } = require('../Validation/category.validation');

router.get('/', getAllCategories);
router.post('/', validateCategory, createCategory);
router.delete('/:name', deleteCategory);

module.exports = router;