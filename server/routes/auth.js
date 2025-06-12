const express = require('express');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User'); // Ensure correct path
const router = express.Router();
require('dotenv').config();
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
//const { UserEmail} = require( "./script.js");

const VerificationCode = require('../models/VerificationCode'); // adjust path as needed
const fs = require('fs');
const path = require('path');

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
    console.log('Missing fields:', { name: !!name, email: !!email, password: !!password });
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existingUser = await User.findOne({ UserEmail: email });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: 'Email already exists' });
    }

    //Validate Password
    let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/;
    if(regex.test(password) == false)
    {
      alert("Password doesn't meet the requirements");
      return res.status(400).json({ message: 'Password doesn\'t meet the requirements' });
    }
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      UserName: name,
      UserEmail: email,
      UserPassword: hashedPassword,
      timeWorked: 0
    });

    await newUser.save();
    console.log('User registered successfully:', email);
    res.status(201).json({ message: 'User registered successfully!' });

  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

async function isPasswordValid(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
}

// Sign In Route
router.post('/signIn', async (req, res) => {
  console.log('Sign In Request Body:', req.body);

  const { email, password } = req.body;

  if (!email || !password) {
    console.log('Missing fields in sign in:', { email: !!email, password: !!password });
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Fetch user by email
    const user = await User.findOne({ UserEmail: email });
    
    if (!user) {
      console.log('User not found:', email);
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.UserPassword);

    if (!isPasswordValid) {
      console.log('Invalid password for user:', email);
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    
    // Successful login response
    console.log('User signed in successfully:', email);
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
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});



router.post('/requestCode', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ UserEmail: email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    // Upsert the code in VerificationCode collection
    await VerificationCode.findOneAndUpdate(
      { email },
      { code: resetCode, expiresAt: new Date(Date.now() + 10 * 60 * 1000) },
      { upsert: true, new: true }
    );

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Read and use the HTML template
    const templatePath = path.join(__dirname, '../../client/passwordResetEmail.html');
    let htmlTemplate = fs.readFileSync(templatePath, 'utf8');
    htmlTemplate = htmlTemplate.replace('{{PIN}}', resetCode);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Code',
      html: htmlTemplate,
      text: `Your password reset code is: ${resetCode}` // fallback
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Reset code sent!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error sending reset code' });
  }
});
// routes/user.js or wherever you define your user-related routes



// POST /user/reset/verify-code
router.post('/reset/verifyCode', async (req, res) => {
    const { email, code } = req.body;

    if (!email || !code) {
        return res.status(400).json({ message: 'Email and code are required.' });
    }

    try {
        const record = await VerificationCode.findOne({ email });

        if (!record) {
            return res.status(400).json({ message: 'No verification code found for this email.' });
        }

        const now = new Date();
        if (record.expiresAt < now) {
            return res.status(400).json({ message: 'Verification code has expired.' });
        }

        if (record.code !== code) {
            return res.status(400).json({ message: 'Incorrect verification code.' });
        }

        return res.status(200).json({ message: 'Verification successful.' });
    } catch (error) {
        console.error('Verification error:', error);
        res.status(500).json({ message: 'Server error during code verification.' });
    }
});

// POST /user/auth/reset/update-password
router.post('/reset/update-password', async (req, res) => {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
        return res.status(400).json({ message: 'Email and new password are required.' });
    }
    try {
        // Check if a valid verification code exists for this email
        const record = await VerificationCode.findOne({ email });
        if (!record) {
            return res.status(400).json({ message: 'No valid verification code found. Please request a new code.' });
        }
        // Update the user's password
        const user = await User.findOne({ UserEmail: email });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        user.UserPassword = hashedPassword;
        await user.save();
        // Remove the verification code after successful password reset
        await VerificationCode.deleteOne({ email });
        res.status(200).json({ message: 'Password updated successfully.' });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ message: 'Server error during password update.' });
    }
});

module.exports = router;

