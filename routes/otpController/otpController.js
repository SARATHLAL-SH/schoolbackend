require("dotenv").config();
const nodemailer = require("nodemailer");
const express = require("express");
const router = express.Router();

const otpStorage = {}; // Temporary storage (Consider using a database for production)

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Generate 6-digit OTP
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// ✅ Send OTP to Email
router.post("/send-email-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  const otp = generateOTP();
  otpStorage[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 }; // OTP expires in 5 minutes

  try {
    await transporter.sendMail({
      from: `"Support Team" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is: ${otp}. It is valid for 5 minutes.`,
    });

    console.log(`OTP for ${email}: ${otp}`); // ✅ Log OTP (Remove in production)
    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("OTP Email Error:", error);
    res
      .status(500)
      .json({ error: "Failed to send OTP", details: error.message });
  }
});

// ✅ Verify OTP
router.post("/verify-email-otp", (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp)
    return res.status(400).json({ error: "Email and OTP are required" });

  const storedOTP = otpStorage[email];

  if (!storedOTP || storedOTP.expiresAt < Date.now()) {
    return res.status(400).json({ error: "OTP expired or invalid" });
  }

  if (storedOTP.otp !== otp) {
    return res.status(400).json({ error: "Incorrect OTP" });
  }

  delete otpStorage[email]; // Remove OTP after successful verification
  res.json({ message: "OTP verified successfully" });
});

module.exports = router;
