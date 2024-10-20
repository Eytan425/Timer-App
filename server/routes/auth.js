const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Assuming User model is in the models directory

// Register User Route
router.post('/register', async (req, res) => {
  console.log('Request Body:', req.body); // Log the request body to debug

  const { name, email, password } = req.body;

  // Check if any required fields are missing
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Create a new user with the correct field names
    const newUser = new User({
      UserName: name,
      UserEmail: email,
      UserPassword: password,
    });

    const savedUser = await newUser.save();
    res.status(201).json({ message: 'User registered successfully!'});

  } catch (error) {
    console.error('Error registering user:', error);

    if (error.code === 11000) {
      // Handle duplicate email error (unique field violation)
      return res.status(400).json({ message: 'Email already exists' });
    }

    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
