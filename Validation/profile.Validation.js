const Joi = require('joi');

const profileSchema = Joi.object({
    fullName: Joi.string().min(3).max(100).required(),
    phone: Joi.string().pattern(/^\+?\d{9,15}$/).required()
});

const validateProfileUpdate = (req, res, next) => {
    const { error } = profileSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: 'Validation xatosi', error: error.details[0].message });
    }
    next();
};

module.exports = {
    validateProfileUpdate,
};
