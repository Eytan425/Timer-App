const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./server/routes/auth.js');
const cors = require('cors'); // Import CORS middleware
require('dotenv').config()
const app = express();
const port = process.env.PORT || 3000;



// Use CORS middleware
app.use(cors({
  origin: ['http://localhost:5500', 'http://127.0.0.1:5500'], // Allow both origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
  credentials: true // Allow credentials
}));

mongoose.connect(process.env.MONGODB_URI) //, { useNewUrlParser: true, useUnifiedTopology: true }
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware to parse JSON request bodies
app.use(express.json());

// Routes
app.use('/user/auth', authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
