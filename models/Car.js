const mongoose = require('mongoose');

const CarSchema = mongoose.Schema({
    nomi: {
        type: String,
        required: [true, "Mashina nomi talab qilinadi"],
    },
    markasi: {
        type: String,
        required: [true, "Mashina markasi talab qilinadi"],
    },
    motor: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 25
    },
    color: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 25
    },
    gearBook: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 50,
    },
    interior_Img: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
        minLength: 10,
        maxLength: 200
    },
    tanirovkasi: {
        type: String,
        required: true,
        enum: ["ha", "yo'q"],
    },
    year: {
        type: Number,
        required: true,
        min: 1900,
        max: new Date().getFullYear(),
        default: new Date().getFullYear()
    },
    distance: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    narxi: {
        type: Number,
        required: true,
        min: 1000,
        max: 1000000
    },
    valyuta: {
        type: String,
        required: true,
        enum: ["USD", "UZS", "EUR"],
        default: "USD"
    },
    outdoor_img: {
        type: String,
        required: true,
    },
    model_turi_uchun_rasm: {
        type: String,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    image: {
        type: String,
        default: null,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true, // Kategoriya har doim mavjud bo‘ladi, chunki topilmasa yaratiladi
    }
}, { versionKey: false });

module.exports = mongoose.model('Car', CarSchema);