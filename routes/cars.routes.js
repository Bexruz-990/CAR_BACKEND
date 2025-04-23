const express = require('express');
const router = express.Router();
const upload = require('../utils/multerConfig');
const {
    createCar, getAllCars, getCarById, updateCar, deleteCar
} = require('../controller/cars.controller');
const { validateCar } = require('../Validation/car.Validation');
router.post('/', upload.single('image'), validateCar, createCar);
router.get('/', getAllCars);
router.get('/:id', getCarById);
router.put('/:id', upload.single('image'), validateCar, updateCar);
router.delete('/:id', deleteCar);

module.exports = router;
