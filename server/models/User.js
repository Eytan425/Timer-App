const mongoose = require('mongoose');
mongoose.pluralize(null);



const User_Schema = new mongoose.Schema({
    UserName:{type:String, required:true},
    UserEmail: { type: String, trim: true, required: true },
    UserPassword: { type: String, trim: true, required: true },
    timeWorked :[{dayWorked:{type:String}, time:{type:Number}}]
    // timeWorked: {type: Number},
});

module.exports = mongoose.model('users', User_Schema);


