const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        // required: true, 
        minlength: 6, 
        maxlength: 20, 
        // unique: true,
    },
    name: {
        type: String,
        required: true, 
    },
    gender: {
        type: String,
        // required: true,
    },
    email: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 50,
        // unique: true,
    },
    phone: {
        type: String,
        // required: true,
        // unique: true,
    },
    address: {
        type: String,
    },
    dateOfBirth: {
        type: Date, 
    },
    age: {
        type: Number,
    },
    password: {
        type: String,
        // required: true,
        minlength: 6,
    },
    image: {
        type: String,
    },
    googleId: {
        type: String,
    },
    bio: {
        type: String,
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    dislikes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    matches: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
}, {
    timestamps: true,
});

module.exports = mongoose.model("User", userSchema);