const mongoose = require('mongoose');

// Schedule notification sub-schema
const scheduleNotificationSchema = new mongoose.Schema({
    day: {              
        type: Number,
        required: true
    },
    message: {     
        type: String,
        required: true,
        trim: true
    },
    notifyDate: {       
        type: Date,
        required: true
    }
}, { _id: false });

// Main notification schema
const notificationSchema = new mongoose.Schema({
    user: {         
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    product: {        
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        required: true
    },
    schedule: {       
        type: [scheduleNotificationSchema],
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Model
const Notification = mongoose.model("notification", notificationSchema);
module.exports = Notification;
