const Car = require('../models/Car');

const createCar = async (req, res) => {
    try {
        const { name, category, price, description } = req.body;

        const car = new Car({
            name,
            category,
            price: Number(price),
            description,
            image: req.file ? req.file.path : null,
        });

        await car.save();
        res.status(201).json(car);
    } catch (error) {
        console.error('Mashina qo‘shish xatosi:', error.message);
        res.status(500).json({ message: 'Server xatosi' });
    }
};

const getAllCars = async (req, res) => {
    try {
        const cars = await Car.find();
        res.status(200).json(cars);
    } catch (error) {
        console.error('Mashinalarni olish xatosi:', error.message);
        res.status(500).json({ message: 'Server xatosi' });
    }
};

const getCarById = async (req, res) => {
    try {
        const { id } = req.params;
        const car = await Car.findById(id);
        if (!car) {
            return res.status(404).json({ message: 'Mashina topilmadi' });
        }
        res.status(200).json(car);
    } catch (error) {
        console.error('Mashina olish xatosi:', error.message);
        res.status(500).json({ message: 'Server xatosi' });
    }
};

const updateCar = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, category, price, description } = req.body;

        const car = await Car.findById(id);
        if (!car) {
            return res.status(404).json({ message: 'Mashina topilmadi' });
        }

        car.name = name;
        car.category = category;
        car.price = Number(price);
        car.description = description;
        car.image = req.file ? req.file.path : car.image;

        await car.save();
        res.status(200).json(car);
    } catch (error) {
        console.error('Mashina yangilash xatosi:', error.message);
        res.status(500).json({ message: 'Server xatosi' });
    }
};

const deleteCar = async (req, res) => {
    try {
        const { id } = req.params;
        const car = await Car.findByIdAndDelete(id);
        if (!car) {
            return res.status(404).json({ message: 'Mashina topilmadi' });
        }

        res.status(200).json({ message: 'Mashina o‘chirildi' });
    } catch (error) {
        console.error('Mashina o‘chirish xatosi:', error.message);
        res.status(500).json({ message: 'Server xatosi' });
    }
};

module.exports = {
    createCar,
    getAllCars,
    getCarById,
    updateCar,
    deleteCar,
};
