const users = require('../models/User');

async function registerUser() {
    const signUpEmail = document.getElementById("signUpEmail").value;
    const signUpPassword = document.getElementById("signUpPassword").value;
    const signUpPasswordAgain = document.getElementById("signUpPasswordAgain").value;
  
    // Check if passwords match
    if (signUpPassword !== signUpPasswordAgain) {
      alert("Passwords do not match.");
      return;
    }
    try
    {
        const newUser = new users
        ({
            _id: new mongoose.Types.ObjectId(),
            signUpEmail,
            signUpPassword
        });
        const savedUser = await newUser.save();
        console.alert(`Username: ${signUpUsername}\nPassword: ${signUpPassword}`);
        return res.status(201).json({ message: 'User registered successfully', user: savedUser });
        
    }
    catch (error)
    {
        console.error("Error saving user:", error);
        alert("An error occurred during registration. Please try again.");
        res.status(500).json({ message: 'Server error' });
    }
    
    
  }