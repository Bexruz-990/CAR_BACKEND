const Joi = require('joi');

// Register Schema
const registerSchema = Joi.object({
    username: Joi.string()
        .min(3)
        .max(30)
        .required()
        .messages({
            'string.min': 'Username kamida 3 belgidan iborat bo‘lishi kerak',
            'string.max': 'Username 30 belgidan oshmasligi kerak',
            'string.empty': 'Username bo‘sh bo‘lmasligi kerak',
            'any.required': 'Username talab qilinadi',
        }),
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Email noto‘g‘ri formatda',
            'string.empty': 'Email bo‘sh bo‘lmasligi kerak',
            'any.required': 'Email talab qilinadi',
        }),
    password: Joi.string()
        .min(6)
        .required()
        .messages({
            'string.min': 'Parol kamida 6 belgidan iborat bo‘lishi kerak',
            'string.empty': 'Parol bo‘sh bo‘lmasligi kerak',
            'any.required': 'Parol talab qilinadi',
        }),
    phoneNumber: Joi.string()
        .pattern(/^\+998\d{9}$/)
        .required()
        .messages({
            'string.pattern.base': 'Telefon raqami +998 bilan boshlanib, 9 ta raqamdan iborat bo‘lishi kerak',
            'string.empty': 'Telefon raqami bo‘sh bo‘lmasligi kerak',
            'any.required': 'Telefon raqami talab qilinadi',
        }),
});

// Validation Middleware
const validateRegister = (req, res, next) => {
    const { error } = registerSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: 'Validatsiya xatosi', errors: error.details.map(err => err.message) });
    }
    next();
};

// Verify Email Schema
const verifyEmailSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Email noto‘g‘ri formatda',
            'string.empty': 'Email bo‘sh bo‘lmasligi kerak',
            'any.required': 'Email talab qilinadi',
        }),
    code: Joi.string()
        .length(6)
        .required()
        .messages({
            'string.length': 'Kod 6 belgidan iborat bo‘lishi kerak',
            'string.empty': 'Kod bo‘sh bo‘lmasligi kerak',
            'any.required': 'Kod talab qilinadi',
        }),
});

// Validation Middleware
const validateVerifyEmail = (req, res, next) => {
    const { error } = verifyEmailSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: 'Validatsiya xatosi', errors: error.details.map(err => err.message) });
    }
    next();
};

// Login Schema
const loginSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Email noto‘g‘ri formatda',
            'string.empty': 'Email bo‘sh bo‘lmasligi kerak',
            'any.required': 'Email talab qilinadi',
        }),
    password: Joi.string()
        .required()
        .messages({
            'string.empty': 'Parol bo‘sh bo‘lmasligi kerak',
            'any.required': 'Parol talab qilinadi',
        }),
});

// Validation Middleware
const validateLogin = (req, res, next) => {
    const { error } = loginSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: 'Validatsiya xatosi', errors: error.details.map(err => err.message) });
    }
    next();
};

// Refresh Token Schema
const refreshTokenSchema = Joi.object({
    refreshToken: Joi.string()
        .required()
        .messages({
            'string.empty': 'Refresh token bo‘sh bo‘lmasligi kerak',
            'any.required': 'Refresh token talab qilinadi',
        }),
});

// Validation Middleware
const validateRefreshToken = (req, res, next) => {
    const { error } = refreshTokenSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: 'Validatsiya xatosi', errors: error.details.map(err => err.message) });
    }
    next();
};

// Forgot Password Schema
const forgotPasswordSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Email noto‘g‘ri formatda',
            'string.empty': 'Email bo‘sh bo‘lmasligi kerak',
            'any.required': 'Email talab qilinadi',
        }),
});

// Validation Middleware
const validateForgotPassword = (req, res, next) => {
    const { error } = forgotPasswordSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: 'Validatsiya xatosi', errors: error.details.map(err => err.message) });
    }
    next();
};

// Change Password Schema
const changePasswordSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Email noto‘g‘ri formatda',
            'string.empty': 'Email bo‘sh bo‘lmasligi kerak',
            'any.required': 'Email talab qilinadi',
        }),
    code: Joi.string()
        .length(6)
        .required()
        .messages({
            'string.length': 'Kod 6 belgidan iborat bo‘lishi kerak',
            'string.empty': 'Kod bo‘sh bo‘lmasligi kerak',
            'any.required': 'Kod talab qilinadi',
        }),
    newPassword: Joi.string()
        .min(6)
        .required()
        .messages({
            'string.min': 'Yangi parol kamida 6 belgidan iborat bo‘lishi kerak',
            'string.empty': 'Yangi parol bo‘sh bo‘lmasligi kerak',
            'any.required': 'Yangi parol talab qilinadi',
        }),
});

// Validation Middleware
const validateChangePassword = (req, res, next) => {
    const { error } = changePasswordSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: 'Validatsiya xatosi', errors: error.details.map(err => err.message) });
    }
    next();
};

module.exports = {
    validateRegister,
    validateVerifyEmail,
    validateLogin,
    validateRefreshToken,
    validateForgotPassword,
    validateChangePassword,
};
