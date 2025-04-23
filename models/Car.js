const mongoose = require('mongoose');

const CarSchema = mongoose.Schema({
    markasi: {
        type: String,
        required: [true, "mashina markasi talab qilinadi !"],

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
        required:true,
        minLength:10,
        maxLength:200
    },
    tanirovkasi :{
        type:String,
        required:true,
        enum:["ha","yo'q"],

    },
    year:{
        type:Date,
        required:true,
        default:Date.now()
    },
    distance:{
        type :Number,
        required:true,
        default:0
    },
    narxi:{
        type:Number,
        required:true,
        valyuta : String,
        min:1000,
        max:1000000
    },
    outdoor_img :{
        type:String,
        required:true,

    },
    model_turi_uchun_rasm:{
        type:String,
        required:true,

    }

},
{versionKey:false})

module.exports = mongoose.model('Car', CarSchema);