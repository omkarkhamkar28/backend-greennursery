const express = require("express");
const {
  saveChatMessageController,
  getUserChatHistoryController,
  getAdminConversationsController,
  deleteChatHistoryController,
  getAllManualChatsController,
} = require("../controllers/msgController");
const { requireSignIn, isAdmin } = require("../middlewares/authMiddlewares");

const router = express.Router();

// Common
router.post("/save-message", requireSignIn, saveChatMessageController);
router.get("/history/:chatType", requireSignIn, getUserChatHistoryController);
router.delete("/clear-history/:chatType", requireSignIn, deleteChatHistoryController);

// Admin Only
router.get("/admin/conversations", requireSignIn, isAdmin, getAdminConversationsController);

router.get("/admin/manual-chats", requireSignIn, isAdmin, getAllManualChatsController);
module.exports = router;
