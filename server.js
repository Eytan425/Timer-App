require('dotenv').config(); // Assuming you have dotenv configured

const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./server/routes/auth.js');
// const timeRecordsRoutes = require('./server/routes/timerRecords.js');
const cors = require('cors'); // Import CORS middleware

const app = express();
const port = process.env.PORT || 3000;

// Use CORS middleware
app.use(cors({
  origin: 'http://127.0.0.1:5500', // Allow requests from your frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
}));
//useNewUrlParser: true, useUnifiedTopology: true 
mongoose.connect(process.env.MONGODB_URI, {}) // Assuming MONGODB_URI is configured in .env
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware to parse JSON request bodies
app.use(express.json());

// Routes
app.use('/user/auth', authRoutes);
// app.use('/user/timeRecords', timeRecordsRoutes); // Updated route for time records

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
