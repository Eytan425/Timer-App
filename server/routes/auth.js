// const express = require('express');
// const router = express.Router();

// // const User = require('./client/script');

// // router.post('/register', User.registerUser())

// module.exports = router;


const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Adjust path if needed

// Register User Route
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    const newUser = new User({ email, password });
    const savedUser = await newUser.save();
    res.status(201).json({ message: 'User registered successfully', user: savedUser });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
