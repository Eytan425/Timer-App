const mongoose = require('mongoose');
mongoose.pluralize(null);



const User_Schema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    UserEmail: { type: String, trim: true, required: true },
    UserPassword: { type: String, trim: true, required: true }
});

module.exports = mongoose.model('users', User_Schema);


