const mongoose = require('mongoose');

const purchaseProductModelSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.ObjectId,
        ref: "users",
        required: true,
    },
    product_id: {
        type: mongoose.ObjectId,
        ref: "products",
        required: true,
    },
    user: {
        type: String,
        required: true,
    },
    name_en: {
        type: String,
        required: true,
    },
    name_mr: {
        type: String,
        required: true,
    },
    type_en: {
        type: String,
        required: true,
    },
    type_mr: {
        type: String,
        required: true,
    },
    quantity: {
        type: String,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    states: {
        type: String,
        enum: ["Pending", "Confirm", "Cancelled", "Delivered", "Returned"],
        default: "Pending",
    },
    paymentStates: {
        type: String,
        enum: ["Pending", "Online", "Cash"],
        default: "Pending",
    },
    purchaseDate: {
        type: Date,
        default: Date.now
    }
    // transactionId: { type: String, unique: true, required: true }
});

const purchaseProductModel = mongoose.model("purchaseProduct", purchaseProductModelSchema);
module.exports = purchaseProductModel;