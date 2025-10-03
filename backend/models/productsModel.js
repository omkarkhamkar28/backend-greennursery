const mongoose = require('mongoose');

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
        data: Buffer,
        contentType: String,
    },

    schedulDay: {
        type: [String],
    },
    description: {
        type: [String],
    },
}, { timestamps: true });

// Create the model using the schema
const product = mongoose.model("product", productSchema);

module.exports = product;