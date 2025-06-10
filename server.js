
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const authRoutes = require('./server/routes/auth.js');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS
app.use(cors({
  origin: [
    'http://localhost:5500',
    'http://127.0.0.1:5500',
    'https://timer-app-079v.onrender.com'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Middleware to parse JSON request bodies
app.use(express.json());

// Serve static frontend files (HTML, JS, CSS, etc.)
app.use(express.static(path.join(__dirname, 'client')));

// Serve index.html at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

// Serve dashboard.html at /dashboard
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dashboard.html'));
});

// API routes for auth
app.use('/user/auth', authRoutes);

// Error handler middleware (returns JSON)
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
