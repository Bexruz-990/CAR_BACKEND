// const Joi = require('joi');

// const profileSchema = Joi.object({
//     fullName: Joi.string().min(3).max(100).required(),
//     phone: Joi.string().pattern(/^\+?\d{9,15}$/).required()
// });

// const validateProfileUpdate = (req, res, next) => {
//     const { error } = profileSchema.validate(req.body);
//     if (error) {
//         return res.status(400).json({ message: 'Validation xatosi', error: error.details[0].message });
//     }
//     next();
// };

// module.exports = {
//     validateProfileUpdate,
// };




const { body, validationResult } = require("express-validator");

const validateProfileUpdate = [
  body("fullName")
    .notEmpty()
    .withMessage("To‘liq ism kiritilishi shart")
    .isString()
    .withMessage("To‘liq ism matn bo‘lishi kerak")
    .isLength({ min: 2, max: 50 })
    .withMessage("To‘liq ism 2-50 belgi oralig‘ida bo‘lishi kerak"),
  body("phone")
    .notEmpty()
    .withMessage("Telefon raqami kiritilishi shart")
    .isString()
    .withMessage("Telefon raqami matn bo‘lishi kerak")
    .matches(/^\+?[1-9]\d{8,14}$/)
    .withMessage("Telefon raqami to‘g‘ri formatda bo‘lishi kerak (masalan, +998901234567)"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Validation error", errors: errors.array().map(err => err.msg) });
    }
    next();
  },
];

module.exports = { validateProfileUpdate };