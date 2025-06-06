const express = require('express');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User'); // Ensure correct path
const router = express.Router();
require('dotenv').config();
const bcrypt = require('bcrypt');
//const { UserEmail} = require( "./script.js");


// Log Time Route
router.post('/logTimes', async (req, res) => {
  console.log("Received request:", req.body); // Debugging

  const { UserEmail, timeWorked } = req.body;

  if (!UserEmail) {
      console.log("🚨 UserEmail is missing in request!");
      return res.status(400).json({ message: "User email is required." });
  }

  try {
      const user = await User.findOne({ UserEmail });

      if (!user) {
          console.log("❌ User not found:", UserEmail);
          return res.status(404).json({ message: "User not found!" });
      }

      console.log("✅ User found:", user);

      user.timeWorked = user.timeWorked || 0;
      user.timeWorked += timeWorked || 0;

      await user.save();
      console.log("✅ User updated successfully:", user);

      res.status(200).json({ message: "Logged time successfully!" });
  } catch (error) {
      console.error("❌ Error logging time:", error);
      res.status(500).json({ message: "Server error", error: error.message });
  }
});


// Register User Route
router.post('/register', async (req, res) => {
  console.log('Request Body:', req.body);

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existingUser = await User.findOne({ UserEmail: email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const newUser = new User({
      UserName: name,
      UserEmail: email,
      UserPassword: password,
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully!' });

  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

async function isPasswordValid(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
}

// Sign In Route
router.post('/signIn', async (req, res) => {
  console.log('Request Body:', req.body); // Debugging

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Fetch user by email (must await the findOne operation)
    const user = await User.findOne({ UserEmail: email });
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare password (plain text comparison)
    const isPasswordValid = await isPasswordValid(password, user.UserPassword);

    // If password is incorrect, return an error
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    
    // Successful login response
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.UserName,
        email: user.UserEmail,
      },
    });

  } catch (error) {
    console.error('Error signing in:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;