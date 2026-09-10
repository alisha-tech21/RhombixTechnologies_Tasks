const express = require("express");
const router = express.Router();

const {
  getConversations,
  getOrCreateConversation,
  getMessages,
  sendMessage,
  deleteMessage,
  deleteConversation,
  markConversationRead,
} = require("../controllers/messageController");

const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.get("/conversations", getConversations);
router.post("/conversations/:userId", getOrCreateConversation);

router.delete("/conversations/:conversationId", deleteConversation);

router.get("/:conversationId", getMessages);
router.post("/:conversationId", sendMessage);
router.put("/:conversationId/read", markConversationRead);

router.delete("/:messageId", deleteMessage);

module.exports = router;
