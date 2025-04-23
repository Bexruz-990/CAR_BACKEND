const Joi = require('joi');

// Validation schema for id parameter (MongoDB ObjectId)
const idSchema = Joi.object({
    id: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
            'string.pattern.base': 'ID noto‘g‘ri formatda, 24 belgili ObjectId bo‘lishi kerak',
            'string.empty': 'ID bo‘sh bo‘lmasligi kerak',
            'any.required': 'ID talab qilinadi',
        }),
});

const validateId = (req, res, next) => {
    const { error } = idSchema.validate(req.params);
    if (error) {
        return res.status(400).json({ message: 'Validation error', errors: error.details.map(err => err.message) });
    }
    next();
};

module.exports = {
    validateId,
};