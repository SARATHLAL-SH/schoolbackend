const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../../modals/User");
require("dotenv").config();
const refreshAccessToken = require( "../../middlewares/refreshAccessToken");

const router = express.Router();

router.post("/reset-password",refreshAccessToken, async (req, res) => {
  const { email, newPassword } = req.body;

  // Input validation
  if (!email || !newPassword) {
    return res.status(400).json({ message: "Email and new password are required." });
  }

  try {
    // Check if the user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Hash the new password
    const saltRounds = parseInt(process.env.SALT_ROUNDS, 10) || 10;
    if (isNaN(saltRounds) || saltRounds <= 0) {
      throw new Error("Invalid salt rounds");
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ message: "Error updating password.", error: error.message });
  }
});

module.exports = router;
