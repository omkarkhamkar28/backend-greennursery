const mongoose = require('mongoose');

// Define the schema
const feedbackSchema = new mongoose.Schema({
    name: {
        type: mongoose.ObjectId,
        ref: "users",
        required: true,
                type: String,

    },
    msg: {
        type: String,
        required: true,
     },
    phone: {
        type: mongoose.ObjectId,
        ref: "users",
        required: true,
                type: String,

     },
    address: {
        type: mongoose.ObjectId,
        ref: "users",
        required: true,
                type: String,

    }, 
    photo: {
        data: Buffer,
        contentType: String,
    }
}, { timestamps: true });

// Create the model using the schema
const feedback = mongoose.model("feedback", feedbackSchema);

module.exports = feedback;