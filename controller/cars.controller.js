const mongoose = require("mongoose");
const Car = require("../models/Car");
const Category = require("../models/Category");
const BaseError = require("../utils/BaseError");

const createCar = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      throw BaseError.Unauthorized("Foydalanuvchi autentifikatsiyadan o‘tmagan");
    }

    const {
      nomi,
      markasi,
      motor,
      color,
      gearBook,
      interior_Img,
      description,
      tanirovkasi,
      year,
      distance,
      narxi,
      valyuta,
      outdoor_img,
      model_turi_uchun_rasm
    } = req.body;

    // Narxi va distance ni tekshirish (validateCar da tekshirilgan, lekin qo‘shimcha xavfsizlik uchun)
    const parsedNarxi = Number(narxi);
    const parsedDistance = Number(distance);
    const parsedYear = Number(year);

    // Kategoriya tekshirish va kerak bo‘lsa yaratish
    let category = await Category.findOne({ name: markasi.trim() });
    if (!category) {
      category = await Category.create({ name: markasi.trim() });
    }

    // Car yaratish
    const car = new Car({
      nomi,
      markasi,
      motor,
      color,
      gearBook,
      interior_Img,
      description,
      tanirovkasi,
      year: parsedYear || undefined,
      distance: parsedDistance,
      narxi: parsedNarxi,
      valyuta,
      outdoor_img,
      model_turi_uchun_rasm,
      createdBy: req.user.id,
      image: req.file ? req.file.path : null,
      category: category._id,
    });

    await car.save();
    res.status(201).json({
      message: "Mashina muvaffaqiyatli qo‘shildi",
      car
    });
  } catch (error) {
    console.error('Mashina qo‘shish xatosi:', error.message);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: "Validation error", errors });
    }
    res.status(error.statusCode || 500).json({ message: error.message || "Server xatosi" });
  }
};

const getAllCars = async (req, res) => {
  try {
    const cars = await Car.find().populate("category").populate("createdBy", "-password");
    res.status(200).json(cars);
  } catch (error) {
    console.error('Mashinalarni olish xatosi:', error.message);
    res.status(500).json({ message: 'Server xatosi' });
  }
};

// const getCarById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       throw new BaseError(400, "Noto‘g‘ri ID formati");
//     }

//     const car = await Car.findById(id).populate("category").populate("createdBy", "-password");
//     if (!car) {
//       throw new BaseError(404, "Mashina topilmadi");
//     }
//     res.status(200).json(car);
//   } catch (error) {
//     console.error('Mashina olish xatosi:', error.message);
//     res.status(error.statusCode || 500).json({ message: error.message || "Server xatosi" });
//   }
// };

const updateCar = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BaseError(400, "Noto‘g‘ri ID formati");
    }

    const {
      nomi,
      markasi,
      motor,
      color,
      gearBook,
      interior_Img,
      description,
      tanirovkasi,
      year,
      distance,
      narxi,
      valyuta,
      outdoor_img,
      model_turi_uchun_rasm
    } = req.body;

    const car = await Car.findById(id);
    if (!car) {
      throw new BaseError(404, "Mashina topilmadi");
    }

    // Kategoriyani yangilash (agar markasi o‘zgartirilgan bo‘lsa)
    if (markasi && markasi !== car.markasi) {
      let category = await Category.findOne({ name: markasi.trim() });
      if (!category) {
        category = await Category.create({ name: markasi.trim() });
      }
      car.category = category._id;
    }

    car.nomi = nomi || car.nomi;
    car.markasi = markasi || car.markasi;
    car.motor = motor || car.motor;
    car.color = color || car.color;
    car.gearBook = gearBook || car.gearBook;
    car.interior_Img = interior_Img || car.interior_Img;
    car.description = description || car.description;
    car.tanirovkasi = tanirovkasi || car.tanirovkasi;
    car.year = year || car.year;
    car.distance = distance || car.distance;
    car.narxi = narxi || car.narxi;
    car.valyuta = valyuta || car.valyuta;
    car.outdoor_img = outdoor_img || car.outdoor_img;
    car.model_turi_uchun_rasm = model_turi_uchun_rasm || car.model_turi_uchun_rasm;
    car.image = req.file ? req.file.path : car.image;

    await car.save();
    res.status(200).json({
      message: "Mashina muvaffaqiyatli yangilandi",
      car
    });
  } catch (error) {
    console.error('Mashina yangilash xatosi:', error.message);
    res.status(error.statusCode || 500).json({ message: error.message || "Server xatosi" });
  }
};

const deleteCar = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BaseError(400, "Noto‘g‘ri ID formati");
    }

    const car = await Car.findByIdAndDelete(id);
    if (!car) {
      throw new BaseError(404, "Mashina topilmadi");
    }

    res.status(200).json({ message: 'Mashina muvaffaqiyatli o‘chirildi' });
  } catch (error) {
    console.error('Mashina o‘chirish xatosi:', error.message);
    res.status(error.statusCode || 500).json({ message: error.message || "Server xatosi" });
  }
};

module.exports = {
  createCar,
  getAllCars,
  updateCar,
  deleteCar,
};