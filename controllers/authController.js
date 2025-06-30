const User = require("../models/User");
const jwt = require("jsonwebtoken");
const sendOtpToEmail = require("../utils/sendOtp");

// exports.loginOrSignup = async (req, res) => {
//   const { email } = req.body;
//   let user = await User.findOne({ email });

//   // Always generate new OTP
//   const otp = Math.floor(100000 + Math.random() * 900000).toString();
//   const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

//   if (!user) {
//     // New user signup
//     user = await User.create({
//       email,
//       otp,
//       otpExpiry,
//       isVerified: false,
//     });
//     await sendOtpToEmail(email, otp);
//     return res.json({
//       message: "Signup initiated. OTP sent. Please verify to continue.",
//     });
//   }

//   // Existing user (verified or not) - always send OTP
//   user.otp = otp;
//   user.otpExpiry = otpExpiry;
//   await user.save();
//   await sendOtpToEmail(email, otp);

//   if (user.isVerified) {
//     return res.json({
//       message: "OTP sent to your email. Please verify to login.",
//     });
//   } else {
//     return res.json({
//       message: "OTP sent. Please verify your email to complete signup.",
//     });
//   }
// };

exports.loginOrSignup = async (req, res) => {
  const { email } = req.body;
  let user = await User.findOne({ email });

  // Always generate new OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

  if (!user) {
    // New user signup
    user = await User.create({
      email,
      otp,
      otpExpiry,
      isVerified: false,
    });
    await sendOtpToEmail(email, otp);
    return res.json({
      message: "Signup initiated. OTP sent. Please verify to continue.",
      userId: user._id,
    });
  }

  // Existing user (verified or not) - always send OTP
  user.otp = otp;
  user.otpExpiry = otpExpiry;
  await user.save();
  await sendOtpToEmail(email, otp);

  if (user.isVerified) {
    return res.json({
      message: "OTP sent to your email. Please verify to login.",
      userId: user._id,
    });
  } else {
    return res.json({
      message: "OTP sent. Please verify your email to complete signup.",
      userId: user._id,
    });
  }
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
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );

  return res.json({
    message: "OTP verified successfully. You are now logged in.",
    token,
  });
};
exports.updateProfile = async (req, res) => {
  try {
    const { userId, name, walletName, card } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.name = name || user.name;
    user.walletName = walletName || user.walletName;
    user.card = card || user.card;

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        email: user.email,
        name: user.name,
        walletName: user.walletName,
        card: user.card,
      },
    });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
