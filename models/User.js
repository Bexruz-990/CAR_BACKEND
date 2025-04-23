const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Foydalanuvchi ismi kiritilishi shart!"],
      minlength: [3, "Foydalanuvchi ismi kamida 3 belgidan iborat bo'lishi kerak!"],
      maxlength: [30, "Foydalanuvchi ismi 30 belgidan oshmasligi kerak!"],
    },
    email: {
      type: String,
      required: [true, "Email kiritilishi shart!"],
      unique: [true, "Bu email allaqachon ro'yxatdan o'tgan!"],
      match: [/.+@.+\.(com|net|org)$/, "Email to'g'ri formatda bo'lishi kerak!"],
    },
    password: {
      type: String,
      required: [true, "Parol kiritilishi shart!"],
      minlength: [1, "Parol kamida 1 belgidan iborat bo'lishi kerak!"],
    },
    role: {
      type: String,
      enum: {
        values: ["user", "admin", "superadmin"],
        message: "Rol faqat user, admin yoki superadmin bo'lishi mumkin!",
      },
      default: "user",
    },
    refreshToken: {
      type: String,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp:{
     type: String,
     default:null
    },
    otpExpires: {
      type: Date,
    },
    resetPasswordCode: {
      type: String,
      match: [/^[a-zA-Z0-9]*$/, "Parolni tiklash kodi faqat harf va raqamlardan iborat bo'lishi kerak!"],
    },
    resetPasswordExpires: {
      type: Date,
    },
  },
  { timestamps: true, versionKey: false }
);
userSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = model("User", userSchema);