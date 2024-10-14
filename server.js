require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./server/routes/auth.js');
const timeRecordsRoutes = require('./server/routes/timerRecords.js');

const app = express();
const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware to parse JSON request bodies
app.use(express.json());

app.use('/user/auth', authRoutes);
app.use('/user/timeRecordsRoutes', timeRecordsRoutes);


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
