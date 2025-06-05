// const express = require('express');
// const mongoose = require('mongoose');
// const path = require('path');
// const authRoutes = require('./server/routes/auth.js');
// const cors = require('cors'); 
// require('dotenv').config();

// const app = express();
// const port = process.env.PORT || 3000;

// // Use CORS middleware
// app.use(cors({
//   origin: [
//     'http://localhost:5500',
//     'http://127.0.0.1:5500',
//     'https://timer-app-ka3v.onrender.com' // Added deployed frontend URL
//   ],
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   credentials: true 
// }));

// // Connect to MongoDB
// mongoose.connect(process.env.MONGODB_URI)
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => console.error('MongoDB connection error:', err));

// // Middleware to parse JSON request bodies
// app.use(express.json());

// // Serve static frontend files
// app.use(express.static(path.join(__dirname, 'client')));

// // Main frontend route
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'client', 'index.html'));
// });

// // API routes
// app.use('/user/auth', authRoutes);

// // Error handler
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send('Something broke!');
// });

// // Start server
// app.listen(port, () => {
//   console.log(`Server listening on port ${port}`);
// });



const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const authRoutes = require('./server/routes/auth.js');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// ✅ CORS for both development and production
const allowedOrigins = [
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'https://timer-app-ka3v.onrender.com',
  'https://timer-app-079v.onrender.com',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// ✅ Middleware to parse JSON request bodies
app.use(express.json());

// ✅ Serve static frontend files (HTML, JS, CSS, etc.)
app.use(express.static(path.join(__dirname, 'client')));

// ✅ Serve index.html at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

// ✅ Serve dashboard.html at /dashboard
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dashboard.html'));
});

// ✅ API routes for auth
app.use('/user/auth', authRoutes);

// ✅ Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// ✅ Start server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
