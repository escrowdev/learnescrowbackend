const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String }, // optional
  otp: { type: String },
  otpExpiry: { type: Date },
  isVerified: { type: Boolean, default: false },

    // new fields
  name: { type: String },
  walletName: { type: String },
  card: {
    number: { type: String },
    expiry: { type: String },
    cvc: { type: String }
  }
});

module.exports = mongoose.model("User", UserSchema);
