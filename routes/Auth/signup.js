const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const express = require("express");
const User = require("../../modals/User");
require("dotenv").config(); 

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { name, email, password, role } = req.body;

  // Input validation
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "All fields (name, email, password) are required" });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ where: { email,  } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const saltRounds = parseInt(process.env.SALT_ROUNDS, 10) || 10;
    if (isNaN(saltRounds) || saltRounds <= 0) {
      throw new Error("Invalid salt rounds");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    // Generate Token and Refresh Token
    

    // Return success response
    res.status(201).json({
      message: "User created successfully",
      userId: newUser.id,
     
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res
      .status(500)
      .json({ message: "Error creating user", error: error.message || error });
  }
});

module.exports = router;
