const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    // He field nehami Customer chi ID store karel (Tya doghanmadhle conversation link karnyasaathi)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", // Tumcha User Model
      required: true,
    },
    chatType: {
      type: String,
      enum: ["ai_bot", "manual"],
      required: true,
    },
    sender: {
      type: String,
      enum: ["user", "bot", "expert"], // expert = Admin
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("message", messageSchema);
