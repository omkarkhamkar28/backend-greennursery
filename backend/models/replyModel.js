const mongoose = require('mongoose');

// Define the schema
const replySchema = new mongoose.Schema({
    comm_id: {
        type: mongoose.ObjectId,
        ref: "comments",
        required: true,
    },
    user: {
        type: String
    },
    reply: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Create the model using the schema
const reply = mongoose.model("reply", replySchema);

module.exports = reply;