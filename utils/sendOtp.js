const { Resend } = require("resend");

const sendOtpToEmail = async (email, otp) => {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY); // ✅ MOVE HERE

    await resend.emails.send({
      from: "Escrow App <onboarding@resend.dev>",
      to: email,
      subject: "Your OTP for Signup",
      html: `<h2>Your OTP is: <strong>${otp}</strong></h2><p>This will expire in 10 minutes.</p>`,
    });
  } catch (err) {
    console.error("❌ Resend OTP Error:", err);
  }
};

module.exports = sendOtpToEmail;
