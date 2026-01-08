const mongoose = require('mongoose');

// Define the schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    phone: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    answer: {
        type: String,
        required: true,
    },
    address: {
        type: String,
    },
    photo: {
        type: String,  
    },
    role: {
        type: Number,
        default: 0,
    },
    likedProducts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product"
        }
    ],
    collectedProducts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product"
        }
    ],
    cartProducts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product"
        }
    ]
}, { timestamps: true });

// Create the model using the schema
const user = mongoose.model("user", userSchema);

module.exports = user;