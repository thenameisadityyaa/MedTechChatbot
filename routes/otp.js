const express = require("express");
const router = express.Router();

let otpStore = {}; // In-memory store, use DB in production

router.post("/send-otp", (req, res) => {
  const { contact } = req.body;

  if (!contact) return res.status(400).json({ success: false, error: "Contact is required" });

  const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();

  otpStore[contact] = generatedOTP;

  console.log(`OTP for ${contact}: ${generatedOTP}`); // Simulate sending

  // Normally you'd use nodemailer or Twilio here

  return res.json({ success: true, message: "OTP sent." });
});

router.post("/verify-otp", (req, res) => {
  const { contact, otp } = req.body;

  if (otpStore[contact] === otp) {
    delete otpStore[contact];
    return res.json({ success: true });
  } else {
    return res.status(400).json({ success: false, error: "Invalid OTP." });
  }
});

module.exports = router;
