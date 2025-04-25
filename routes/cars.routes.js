const express = require('express');
const router = express.Router();

const {getAllCars, deleteCar,} = require('../controller/cars.controller');
const chekAdmin = require('../middleware/admin');



router.get('/Allcars', getAllCars);
router.delete("/delete/:id", chekAdmin, deleteCar)

module.exports = router;


/////////////////////////////////