var mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        secretid: { type: Number },
        name: { type: String },
        email: { type: String, unique: true, required: true },
        isVerified: { type: Boolean, default: false },
        phone: { type: Number },
        address: { type: String },
        genOtp: { type: Number },
        password: { type: String },
        image: String,
        token: String
    }
);
const User = mongoose.model('User', userSchema);
module.exports = User
