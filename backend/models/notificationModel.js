const mongoose = require('mongoose');

const notificationModelSchema = new mongoose.Schema({
    // name: {
    //     type: mongoose.ObjectId,
    //     ref: "users",
    //     required: true,
    // },
    name_en: {
        type: mongoose.ObjectId,
        ref: "products",
        required: true,
    },
    name_mr: {
        type: mongoose.ObjectId,
        ref: "products",
        required: true,
    },
    type_en: {
        type: mongoose.ObjectId,
        ref: "products",
        required: true,
    },
    type_mr: {
        type: mongoose.ObjectId,
        ref: "products",
        required: true,
    },
    states: {
        type: String,
        enum: ["Pending", "Cancelled", "Delivered", "Returend"],
        default: "Pending",
    },
    purchaseDate: {
        type: Date,
        default: Date.now
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    firstWater:{
        type: Date,
     },
    secondWater:{
        type: Date,
     },
    thirdWater:{
        type: Date,
     },
    fourthWater:{
        type: Date,
     },
    fifthhWater:{
        type: Date,
     }
    // transactionId: { type: String, unique: true, required: true }
});

const notificationModelSchemaModel = mongoose.model("notification", notificationModelSchema);
module.exports = notificationModelSchemaModel;