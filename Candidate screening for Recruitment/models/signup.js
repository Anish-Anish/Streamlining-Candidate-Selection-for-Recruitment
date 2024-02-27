const mongoose = require('mongoose');

const signupSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"]
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
});

const Signup = mongoose.model('Signup', signupSchema);

module.exports = Signup;
