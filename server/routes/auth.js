const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Ensure correct path

// Register User Route
router.post('/register', async (req, res) => {
  console.log('Request Body:', req.body); // Debugging

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newUser = new User({
      UserName: name,
      UserEmail: email,
      UserPassword: password,
    });

    const savedUser = await newUser.save();
    res.status(201).json({ message: 'User registered successfully!' });

  } catch (error) {
    console.error('Error registering user:', error);

    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    res.status(500).json({ message: 'Server error' });
  }
});

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
    const isPasswordValid = password === user.UserPassword;

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
