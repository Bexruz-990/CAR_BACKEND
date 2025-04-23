const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controller/profile.controller');
const authMiddleware = require("../middleware/auth.middleware"); // foydalanuvchini aniqlash uchun
const ValidationProfile = require("../Validation/profile.Validation")
// Foydalanuvchi o‘z profilini ko‘rish
router.get('/', authMiddleware, getProfile);

router.put('/', authMiddleware, ValidationProfile.validateProfileUpdate, updateProfile);

module.exports = router;
