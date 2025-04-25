const express = require('express');
const router = express.Router();
const upload = require('../utils/multerConfig');
const { authMiddleware, profileMiddleware } = require("../middleware/auth.middleware");
const { createCar, getAllCars, getCarById, updateCar, deleteCar } = require('../controller/cars.controller');
const { validateCar } = require("../Validation/car.Validation");
const { getProfile } = require('../controller/profile.controller');

router.get("/profile", authMiddleware, getProfile, getAllCars); 
router.get('/Allcars', getAllCars);


router.post('/AddCars', profileMiddleware, upload.single('image'), validateCar, createCar);
router.put('/updateCar/:id', authMiddleware, upload.single('image'), validateCar, updateCar);
router.delete('/deleteCar/:id', authMiddleware, deleteCar);

module.exports = router;
