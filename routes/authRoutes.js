// File: routes/authRoutes.js
const express = require("express");
const router = express.Router();
const { loginOrSignup, verifyOtp, updateProfile } = require("../controllers/authController");

router.post("/signup", loginOrSignup);
router.post("/verify", verifyOtp);
router.post("/profile", updateProfile);

module.exports = router; // ✅ MUST export the router
