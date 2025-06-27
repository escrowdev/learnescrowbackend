const User = require("../models/User");
const jwt = require("jsonwebtoken");
const sendOtpToEmail = require("../utils/sendOtp");

exports.loginOrSignup = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (user && user.isVerified) {
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET
    );
    return res.json({ message: "Login successful", token });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

  await User.findOneAndUpdate(
    { email },
    { email, otp, otpExpiry, isVerified: false },
    { upsert: true, new: true }
  );

  await sendOtpToEmail(email, otp);
  return res.json({ message: "OTP sent to email" });
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });

  if (!user || user.otp !== otp || new Date() > user.otpExpiry) {
    return res.status(400).json({ error: "Invalid or expired OTP" });
  }

  user.isVerified = true;
  user.otp = null;
  user.otpExpiry = null;
  await user.save();

  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET
  );
  return res.json({ message: "OTP verified", token });
};
