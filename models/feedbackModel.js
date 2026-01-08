const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    user: {
        type: mongoose.ObjectId,
        ref: "users",
        required: true,
    },
    msg: {
        type: String,
        required: true,
    },
    name:{
        type: String,
        required: true
    },
    address:{
        type: String,
     },
    phone:{
        type: String,
        required: true
    }
}, { timestamps: true });

const feedback = mongoose.model("feedback", feedbackSchema);

module.exports = feedback;