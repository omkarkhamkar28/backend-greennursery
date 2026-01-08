const mongoose = require('mongoose');

// Define the schema
const commentSchema = new mongoose.Schema({
    product_id: {
        type: mongoose.ObjectId,
        ref: "products",
        required: true,
    },
    user_id: {
        type: mongoose.ObjectId,
        ref: "users",
     },
    user: {
        type: String
    },
    comm: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Create the model using the schema
const comments = mongoose.model("comments", commentSchema);

module.exports = comments;