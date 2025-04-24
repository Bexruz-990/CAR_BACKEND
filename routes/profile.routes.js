const express = require('express');
const router = express.Router();

const {
  getProfile,
  updateProfile,
  getProfileData // bu yerda to‘g‘ri nomda import qilinganiga ishonch hosil qiling
} = require('../controller/profile.controller');

const {profileMiddleware} = require("../middleware/auth.middleware");
const  {validateProfileUpdate} = require("../Validation/profile.Validation");

router.get('/', profileMiddleware, getProfile);
router.put('/', profileMiddleware, validateProfileUpdate, updateProfile);

router.get('/data', profileMiddleware, getProfileData);

module.exports = router;
