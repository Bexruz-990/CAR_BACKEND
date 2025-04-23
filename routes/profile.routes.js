const express = require('express');
const router = express.Router();

const {
  getProfile,
  updateProfile,
  getProfileData // bu yerda to‘g‘ri nomda import qilinganiga ishonch hosil qiling
} = require('../controller/profile.controller');

const authMiddleware = require("../middleware/auth.middleware");
const ValidationProfile = require("../Validation/profile.Validation");

router.get('/', authMiddleware, getProfile);
router.put('/', authMiddleware, ValidationProfile.validateProfileUpdate, updateProfile);

router.get('/data', authMiddleware, getProfileData);

module.exports = router;
