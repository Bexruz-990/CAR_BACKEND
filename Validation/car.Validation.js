const Joi = require('joi');

const carSchema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    category: Joi.string().min(2).max(30).required(),
    price: Joi.number().positive().required(),
    description: Joi.string().min(5).max(500).required(),
});

const validateCar = (req, res, next) => {
    const { name, category, price, description } = req.body;
    const { error } = carSchema.validate({ name, category, price, description });

    if (error) {
        return res.status(400).json({
            message: 'Validation error',
            errors: error.details.map(e => e.message),
        });
    }

    next();
};

module.exports = { validateCar };
