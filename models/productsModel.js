const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
    day: {
        type: Number,
        required: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    }
}, { _id: false });


// Define the schema
const productSchema = new mongoose.Schema({
    name_en: {
        type: String,
        required: true,
        trim: true
    },
    name_mr: {
        type: String,
        required: true,
        trim: true
    },
    type_en: {
        type: String,
        required: true,
        trim: true
    },
    type_mr: {
        type: String,
        required: true,
        trim: true
    },
    description_en: {
        type: String,
        required: true,
        trim: true
    },
    description_mr: {
        type: String,
        required: true,
        trim: true
    },
    rate: {
        type: String,
        required: true,
    },
    stock: {
        type: String,
        required: true,
    },
    photo: {
        type: String, // file path
    },
    schedule: {
        type: [scheduleSchema],
        default: []
    }
}, { timestamps: true });

// Create the model using the schema
const product = mongoose.model("product", productSchema);

module.exports = product;