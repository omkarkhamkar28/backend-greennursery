const mongoose = require("mongoose");

const replySchema = new mongoose.Schema(
  {
    comm_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "comments",
      required: true,
      index: true, // fast lookup
    },

    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },

    user: {
      type: String,
      required: true,
      trim: true,
    },

    reply: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
    },
  },
  {
    timestamps: true, // createdAt & updatedAt auto
  }
);

module.exports = mongoose.model("replies", replySchema);
