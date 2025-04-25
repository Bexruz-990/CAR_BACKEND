const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Foydalanuvchi nomi majburiy"],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email majburiy"],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Parol majburiy"],
    minlength: [6, "Parol kamida 6 belgidan iborat bo‘lishi kerak"],
  },
  phoneNumber: {
    type: String,
    trim: true,
    default: null,
  },
  otp: {
    type: String,
    default: null,
  },
  otpExpires: {
    type: Date,
    default: null,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  resetPasswordCode: {
    type: String,
    default: null,
  },
  resetPasswordExpires: {
    type: Date,
    default: null,
  },
  refreshToken: {
    type: String,
    default: null,
  },
  role: {
    type: String,
    enum: ["user", "admin", "superadmin"],
    default: "user",
  },
}, {
  timestamps: true,
});

// Maxfiy ma’lumotlarni yashirish uchun toJSON metodi
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshToken;
  delete obj.otp;
  delete obj.otpExpires;
  delete obj.resetPasswordCode;
  delete obj.resetPasswordExpires;
  return obj;
};

const User = mongoose.model("User", userSchema);
module.exports = User;