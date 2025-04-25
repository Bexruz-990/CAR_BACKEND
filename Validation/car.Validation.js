const { body, validationResult } = require("express-validator");

const validateCar = [
  body("nomi")
    .notEmpty()
    .withMessage("Mashina nomi talab qilinadi")
    .isString()
    .withMessage("Mashina nomi matn bo‘lishi kerak")
    .trim(),
  body("markasi")
    .notEmpty()
    .withMessage("Mashina markasi talab qilinadi")
    .isString()
    .withMessage("Mashina markasi matn bo‘lishi kerak")
    .trim(),
  body("motor")
    .notEmpty()
    .withMessage("Motor talab qilinadi")
    .isLength({ min: 1, max: 25 })
    .withMessage("Motor 1-25 belgi oralig‘ida bo‘lishi kerak")
    .trim(),
  body("color")
    .notEmpty()
    .withMessage("Rang talab qilinadi")
    .isLength({ min: 2, max: 25 })
    .withMessage("Rang 2-25 belgi oralig‘ida bo‘lishi kerak")
    .trim(),
  body("gearBook")
    .notEmpty()
    .withMessage("GearBook talab qilinadi")
    .isLength({ min: 2, max: 50 })
    .withMessage("GearBook 2-50 belgi oralig‘ida bo‘lishi kerak")
    .trim(),
  body("interior_Img")
    .notEmpty()
    .withMessage("Ichki rasm URL talab qilinadi")
    .isURL()
    .withMessage("Ichki rasm URL to‘g‘ri formatda bo‘lishi kerak")
    .trim(),
  body("description")
    .notEmpty()
    .withMessage("Tavsif talab qilinadi")
    .isLength({ min: 10, max: 200 })
    .withMessage("Tavsif 10-200 belgi oralig‘ida bo‘lishi kerak")
    .trim(),
  body("tanirovkasi")
    .notEmpty()
    .withMessage("Tanirovka holati talab qilinadi")
    .isIn(["ha", "yo'q"])
    .withMessage("Tanirovka 'ha' yoki 'yo'q' bo‘lishi kerak"),
  body("year")
    .optional()
    .isInt({ min: 1900, max: new Date().getFullYear() })
    .withMessage(`Yil 1900-${new Date().getFullYear()} oralig‘ida bo‘lishi kerak`),
  body("distance")
    .notEmpty()
    .withMessage("Distance talab qilinadi")
    .isInt({ min: 0 })
    .withMessage("Distance 0 dan kichik bo‘lmasligi kerak"),
  body("narxi")
    .notEmpty()
    .withMessage("Narx talab qilinadi")
    .isInt({ min: 1000, max: 1000000 })
    .withMessage("Narx 1000-1000000 oralig‘ida bo‘lishi kerak"),
  body("valyuta")
    .notEmpty()
    .withMessage("Valyuta talab qilinadi")
    .isIn(["USD", "UZS", "EUR"])
    .withMessage("Valyuta 'USD', 'UZS' yoki 'EUR' bo‘lishi kerak"),
  body("outdoor_img")
    .notEmpty()
    .withMessage("Tashqi rasm URL talab qilinadi")
    .isURL()
    .withMessage("Tashqi rasm URL to‘g‘ri formatda bo‘lishi kerak")
    .trim(),
  body("model_turi_uchun_rasm")
    .notEmpty()
    .withMessage("Model turi uchun rasm URL talab qilinadi")
    .isURL()
    .withMessage("Model turi uchun rasm URL to‘g‘ri formatda bo‘lishi kerak")
    .trim(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation error",
        errors: errors.array().map(err => err.msg),
      });
    }
    next();
  },
];

module.exports = { validateCar };