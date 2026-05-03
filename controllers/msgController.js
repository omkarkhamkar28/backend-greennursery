const messageModel = require("../models/msgModel");

// ✅ 1. Message Save Karne (User kiva Admin)
const saveChatMessageController = async (req, res) => {
  try {
    const { chatType, sender, message, userId } = req.body;

    const newMessage = new messageModel({
      // Jar Admin (expert) asel tar to userId pathvato, naitar login user chi ID
      user: sender === "expert" ? userId : req.user._id,
      chatType,
      sender,
      message,
      isRead: sender === "expert" ? true : false, // Admin cha message nehami read asto
    });

    await newMessage.save();

    res.status(201).send({ success: true, newMessage });
  } catch (error) {
    res.status(500).send({ success: false, message: "Save error" });
  }
};

// ✅ 2. Chat History (User sathi ani Admin sathi)
const getUserChatHistoryController = async (req, res) => {
  try {
    const { chatType } = req.params;
    const { userId } = req.query;

    // Admin history bghat asel tar to query madhun userId pathvato
    const targetUser = req.user.role === 1 && userId ? userId : req.user._id;

    const history = await messageModel
      .find({ user: targetUser, chatType })
      .sort({ createdAt: 1 });

    // Jar Admin ne chat open kela, tar sagle "user" messages Read mark kara
    if (req.user.role === 1 && chatType === "manual") {
      await messageModel.updateMany(
        { user: targetUser, sender: "user", isRead: false },
        { isRead: true }
      );
    }

    res.status(200).send({ success: true, history });
  } catch (err) {
    res.status(500).send({ success: false });
  }
};

const getAdminConversationsController = async (req, res) => {
  try {
    const chats = await messageModel
      .find({ chatType: "manual" })
      .populate("user", "name photo phone")
      .sort({ createdAt: -1 });

    const usersMap = {};

    chats.forEach((chat) => {
      const userId = chat.user._id.toString();

      // ❌ Admin ला skip करा
      if (chat.user.role === 1) return;

      if (!usersMap[userId]) {
        usersMap[userId] = {
          _id: userId,
          name: chat.user.name,
          photo: chat.user.photo,
          phone: chat.user.phone,
          lastMessage: chat.message,
          time: chat.createdAt,
          unreadCount: chat.sender === "user" && !chat.isRead ? 1 : 0,
        };
      } else {
        if (chat.sender === "user" && !chat.isRead) {
          usersMap[userId].unreadCount += 1;
        }
      }
    });

    const conversations = Object.values(usersMap).sort(
      (a, b) => new Date(b.time) - new Date(a.time)
    );

    res.status(200).send({
      success: true,
      conversations,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false });
  }
};


// ✅ 4. Clear History (Bot kiva Manual)
const deleteChatHistoryController = async (req, res) => {
  try {
    const { chatType } = req.params;
    await messageModel.deleteMany({ user: req.user._id, chatType });
    res.status(200).send({ success: true });
  } catch (error) {
    res.status(500).send({ success: false });
  }
};


// ✅ Admin ला ALL manual chats (grouped by user)
const getAllManualChatsController = async (req, res) => {
  try {
    const chats = await messageModel
      .find({ chatType: "manual" })
      .populate("user", "name photo phone role")
      .sort({ createdAt: 1 }); // oldest first for proper chat flow

    const usersMap = {};

    chats.forEach((chat) => {
      const userId = chat.user._id.toString();

      // ❌ Admin ला skip करा
      if (chat.user.role === 1) return;

      if (!usersMap[userId]) {
        usersMap[userId] = {
          _id: userId,
          name: chat.user.name,
          photo: chat.user.photo,
          phone: chat.user.phone,
          messages: [],
          lastMessage: "",
          time: chat.createdAt,
          unreadCount: 0,
        };
      }

      // push messages
      usersMap[userId].messages.push(chat);

      // last message update
      usersMap[userId].lastMessage = chat.message;
      usersMap[userId].time = chat.createdAt;

      // unread count
      if (chat.sender === "user" && !chat.isRead) {
        usersMap[userId].unreadCount += 1;
      }
    });

    // sort latest chat वर
    const conversations = Object.values(usersMap).sort(
      (a, b) => new Date(b.time) - new Date(a.time)
    );

    res.status(200).send({
      success: true,
      conversations,
    });
  } catch (error) {
    console.log("Admin All Chat Error:", error);
    res.status(500).send({ success: false });
  }
};


module.exports = {
  saveChatMessageController,
  getUserChatHistoryController,
  getAdminConversationsController,
  deleteChatHistoryController,
  getAllManualChatsController,
};
 
