const mongoose = require('mongoose');

const verificationCodeSchema = new mongoose.Schema({
    email: String,
    code: String,
    expiresAt: Date
});

module.exports = mongoose.model('VerificationCode', verificationCodeSchema);
