const mongoose = require('mongoose');
mongoose.pluralize(null);

const User_Schema = new mongoose.Schema({
  UserName: { type: String, required: true },
  UserEmail: { type: String, trim: true, required: true },
  UserPassword: { type: String, trim: true, required: true },
  timeWorked: { type: Number },
  resetCode: { type: Number },
  resetCodeExpiry: { type: Date },
});

module.exports = mongoose.model('users', User_Schema);
