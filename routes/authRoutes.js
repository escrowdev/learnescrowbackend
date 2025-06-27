// File: routes/authRoutes.js
const express = require("express");
const router = express.Router();
const { loginOrSignup, verifyOtp } = require("../controllers/authController");

router.post("/signup", loginOrSignup);
router.post("/verify", verifyOtp);

module.exports = router; // ✅ MUST export the router
