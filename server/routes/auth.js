const express = require('express');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User'); // Ensure correct path
const router = express.Router();

// Replace these with your GitHub app credentials
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

// Configure GitHub strategy for use by Passport
passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: 'http://localhost:5500/auth/callback' // Change this to your callback URL
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if the user already exists in the database
      let user = await User.findOne({ UserEmail: profile.emails[0].value });
      if (!user) {
        // Create a new user if not found
        user = new User({
          UserName: profile.displayName || profile.username,
          UserEmail: profile.emails[0].value,
          UserPassword: null, // Password is not needed for GitHub logins
          timeWorked: 0,
        });
        await user.save();
      }
      return done(null, user);
    } catch (error) {
      console.error('Error during GitHub authentication:', error);
      return done(error, null);
    }
  }
));

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Log Time Route
router.post('/logTimes', async (req, res) => {
  const { email, timeWorked } = req.body;

  try {
    console.log('Request received with:', req.body);

    // Find the user by email
    const user = await User.findOne({ UserEmail: email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(404).json({ message: "User not found!" });
    }

    console.log('User found:', user);
    user.timeWorked = user.timeWorked || 0; // Initialize if undefined
    user.timeWorked += timeWorked; // Now safe to add

    // Save the updated user document
    console.log('Saving updated user...');
    await user.save();

    console.log('User updated successfully');
    res.status(200).json({ message: "Logged time successfully!" });
  } catch (error) {
    console.error("Error logging time: ", error);
    res.status(500).json({ message: 'Server error', error: error.message });
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
    const isPasswordValid = password === user.UserPassword; // Use strict equality

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

// GitHub Authentication Routes
router.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/auth/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    // Successful authentication, redirect to your desired page.
    res.redirect('/profile'); // Change this to your profile route or desired location
  }
);

// Profile Route
router.get('/profile', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.json({
    message: 'Profile retrieved successfully',
    user: {
      id: req.user._id,
      name: req.user.UserName,
      email: req.user.UserEmail,
      timeWorked: req.user.timeWorked,
    },
  });
});

module.exports = router;
