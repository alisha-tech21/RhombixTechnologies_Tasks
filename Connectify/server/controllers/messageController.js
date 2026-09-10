const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const User = require("../models/User");
const { emitToUser } = require("../socket/socketServer");

// @desc    Get all my conversations, sorted by most recent activity
// @route   GET /api/messages/conversations
// @access  Private
const getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id,
      deletedFor: { $ne: req.user._id },
    })
      .populate("participants", "name profilePicture")
      .populate("lastMessage")
      .sort({ lastMessageAt: -1 });

    // Attach unread count per conversation, and simplify "the other person" for a 1-on-1 chat
    const withDetails = await Promise.all(
      conversations.map(async (conv) => {
        const otherUser = conv.participants.find(
          (p) => !p._id.equals(req.user._id),
        );
        const unreadCount = await Message.countDocuments({
          conversation: conv._id,
          sender: { $ne: req.user._id },
          read: false,
        });

        return {
          _id: conv._id,
          otherUser,
          lastMessage: conv.lastMessage,
          lastMessageAt: conv.lastMessageAt,
          unreadCount,
        };
      }),
    );

    // Skip conversations where the other participant no longer exists
    const validConversations = withDetails.filter((c) => c.otherUser);

    res.status(200).json({ success: true, conversations: validConversations });
  } catch (error) {
    next(error);
  }
};

// @desc    Get or create a new 1-on-1 conversation
// @route   POST /api/messages/conversations/:userId
// @access  Private
const getOrCreateConversation = async (req, res, next) => {
  try {
    const otherUserId = req.params.userId;

    if (otherUserId === req.user._id.toString()) {
      res.status(400);
      throw new Error("You cannot message yourself");
    }

    const otherUser = await User.findById(otherUserId);

    if (!otherUser) {
      res.status(404);
      throw new Error("User not found");
    }

    // Block check
    const me = await User.findById(req.user._id);

    if (
      me.blockedUsers.includes(otherUserId) ||
      otherUser.blockedUsers.includes(req.user._id)
    ) {
      res.status(403);
      throw new Error("Unable to start a conversation with this user");
    }

    const participantsKey = [req.user._id.toString(), otherUserId]
      .sort()
      .join("_");

    // Atomic "find or create" — the unique index on participantsKey guarantees
    // this never creates a duplicate, even if called twice at once (e.g. React StrictMode)
    let conversation = await Conversation.findOneAndUpdate(
      { participantsKey },
      {
        $setOnInsert: {
          participants: [req.user._id, otherUserId],
          participantsKey,
        },
      },
      { new: true, upsert: true },
    );

    // If I had deleted this conversation before, opening it again should unhide it for me
    if (conversation.deletedFor?.some((id) => id.equals(req.user._id))) {
      conversation.deletedFor = conversation.deletedFor.filter(
        (id) => !id.equals(req.user._id),
      );
      await conversation.save();
    }

    conversation = await conversation.populate(
      "participants",
      "name profilePicture",
    );

    res.status(200).json({
      success: true,
      conversation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all messages in a conversation
// @route   GET /api/messages/:conversationId
// @access  Private
const getMessages = async (req, res, next) => {
  try {
    const conversation = await Conversation.findById(req.params.conversationId);

    if (!conversation) {
      res.status(404);
      throw new Error("Conversation not found");
    }

    if (!conversation.participants.some((p) => p.equals(req.user._id))) {
      res.status(403);
      throw new Error("Not authorized to view this conversation");
    }

    const messages = await Message.find({ conversation: conversation._id })
      .populate("sender", "name profilePicture")
      .sort({ createdAt: 1 });

    // Mark all messages sent TO me in this conversation as read
    await Message.updateMany(
      {
        conversation: conversation._id,
        sender: { $ne: req.user._id },
        read: false,
      },
      { read: true },
    );

    res.status(200).json({ success: true, messages });
  } catch (error) {
    next(error);
  }
};

// @desc    Send a message in a conversation
// @route   POST /api/messages/:conversationId
// @access  Private
// @desc    Send a message in a conversation
// @route   POST /api/messages/:conversationId
// @access  Private
const sendMessage = async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      res.status(400);
      throw new Error("Message text is required");
    }

    let conversation = await Conversation.findById(req.params.conversationId);

    if (!conversation) {
      res.status(404);
      throw new Error("Conversation not found");
    }

    if (!conversation.participants.some((p) => p.equals(req.user._id))) {
      res.status(403);
      throw new Error("Not authorized to send messages in this conversation");
    }

    // Find the other participant
    // Find the other participant
    const recipientId = conversation.participants.find(
      (p) => !p.equals(req.user._id),
    );

    // Sending a message un-hides the conversation for BOTH people —
    // same conversation, same history, just reappears in whoever's list had it hidden
    conversation.deletedFor = (conversation.deletedFor || []).filter(
      (id) => !id.equals(req.user._id) && !id.equals(recipientId),
    );

    const message = await Message.create({
      conversation: conversation._id,
      sender: req.user._id,
      text: text.trim(),
    });

    conversation.lastMessage = message._id;
    conversation.lastMessageAt = new Date();

    await conversation.save();

    const populatedMessage = await message.populate(
      "sender",
      "name profilePicture",
    );

    // Send real-time message to recipient
    emitToUser(recipientId, "new_message", {
      conversationId: conversation._id,
      message: populatedMessage,
    });

    res.status(201).json({
      success: true,
      message: populatedMessage,
      conversationId: conversation._id,
    });
  } catch (error) {
    next(error);
  }
};
const deleteMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.messageId);

    if (!message) {
      return res.status(404).json({
        message: "Message not found",
      });
    }

    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You can only delete your own messages",
      });
    }

    await Message.findByIdAndDelete(req.params.messageId);

    // Update last message if deleted message was the latest one
    const conversation = await Conversation.findById(message.conversation);

    if (conversation?.lastMessage?.toString() === message._id.toString()) {
      const latestMessage = await Message.findOne({
        conversation: message.conversation,
      }).sort({ createdAt: -1 });

      conversation.lastMessage = latestMessage?._id || null;
      conversation.lastMessageAt = latestMessage?.createdAt || null;

      await conversation.save();
    }

    res.status(200).json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
const deleteConversation = async (req, res, next) => {
  try {
    const { conversationId } = req.params;

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      res.status(404);
      throw new Error("Conversation not found");
    }

    const isParticipant = conversation.participants.some(
      (id) => id.toString() === req.user._id.toString(),
    );

    if (!isParticipant) {
      res.status(403);
      throw new Error("You are not part of this conversation");
    }

    await Conversation.findByIdAndUpdate(conversationId, {
      $addToSet: {
        deletedFor: req.user._id,
      },
    });

    res.status(200).json({
      success: true,
      message: "Conversation deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
// @desc    Mark all messages in a conversation as read (used for real-time sync,
//          e.g. when a new message arrives while the conversation is already open)
// @route   PUT /api/messages/:conversationId/read
// @access  Private
const markConversationRead = async (req, res, next) => {
  try {
    await Message.updateMany(
      {
        conversation: req.params.conversationId,
        sender: { $ne: req.user._id },
        read: false,
      },
      { read: true },
    );
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getConversations,
  getOrCreateConversation,
  getMessages,
  sendMessage,
  deleteMessage,
  deleteConversation,
  markConversationRead,
};
