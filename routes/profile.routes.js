const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controller/profile.controller');
const authMiddleware = require("../middleware/auth.middleware");
const ValidationProfile = require("../Validation/profile.Validation")

router.get('/', authMiddleware, getProfile);

router.put('/', authMiddleware, ValidationProfile.validateProfileUpdate, updateProfile);

module.exports = router;
