const FriendRequest = require("../models/FriendRequest");
const Notification = require("../models/Notification");
const { emitToUser } = require("../socket/socketServer");
const User = require("../models/User");

// @desc    Send a friend request
// @route   POST /api/friends/request/:id
// @access  Private
const sendFriendRequest = async (req, res, next) => {
  try {
    const receiverId = req.params.id;
    const senderId = req.user._id;

    if (receiverId === senderId.toString()) {
      res.status(400);
      throw new Error("You cannot send a friend request to yourself");
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      res.status(404);
      throw new Error("User not found");
    }

    const sender = await User.findById(senderId);
    if (
      receiver.blockedUsers.includes(senderId) ||
      sender.blockedUsers.includes(receiverId)
    ) {
      res.status(403);
      throw new Error("Unable to send friend request to this user");
    }

    // Already friends?
    if (sender.friends.includes(receiverId)) {
      res.status(400);
      throw new Error("You are already friends with this user");
    }

    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
      status: "pending",
    });

    if (existingRequest) {
      res.status(400);
      throw new Error("A friend request already exists between you two");
    }

    const request = await FriendRequest.create({
      sender: senderId,
      receiver: receiverId,
    });
    const notification = await Notification.create({
      recipient: receiverId,
      sender: req.user._id,
      type: "friend_request",
      friendRequest: request._id,
      message: `${req.user.name} sent you a friend request`,
    });

    const populatedNotification = await notification.populate(
      "sender",
      "name profilePicture",
    );
    emitToUser(receiverId, "notification", populatedNotification);

    res.status(201).json({ success: true, request });
  } catch (error) {
    next(error);
  }
};

// @desc    Accept a friend request
// @route   PUT /api/friends/accept/:requestId
// @access  Private
const acceptFriendRequest = async (req, res, next) => {
  try {
    const request = await FriendRequest.findById(req.params.requestId);

    if (!request) {
      res.status(404);
      throw new Error("Friend request not found");
    }

    if (!request.receiver.equals(req.user._id)) {
      res.status(403);
      throw new Error("You are not authorized to accept this request");
    }

    if (request.status !== "pending") {
      res.status(400);
      throw new Error("This request has already been handled");
    }

    request.status = "accepted";
    await request.save();

    await User.findByIdAndUpdate(request.sender, {
      $addToSet: { friends: request.receiver },
    });
    await User.findByIdAndUpdate(request.receiver, {
      $addToSet: { friends: request.sender },
    });

    const notification = await Notification.create({
      recipient: request.sender,
      sender: req.user._id,
      type: "friend_accept",
      message: `${req.user.name} accepted your friend request`,
    });

    const populatedNotification = await notification.populate(
      "sender",
      "name profilePicture",
    );
    emitToUser(request.sender, "notification", populatedNotification);

    res.status(200).json({ success: true, message: "Friend request accepted" });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject a friend request
// @route   PUT /api/friends/reject/:requestId
// @access  Private
const rejectFriendRequest = async (req, res, next) => {
  try {
    const request = await FriendRequest.findById(req.params.requestId);

    if (!request) {
      res.status(404);
      throw new Error("Friend request not found");
    }

    if (!request.receiver.equals(req.user._id)) {
      res.status(403);
      throw new Error("You are not authorized to reject this request");
    }

    if (request.status !== "pending") {
      res.status(400);
      throw new Error("This request has already been handled");
    }

    await request.deleteOne();

    res.status(200).json({ success: true, message: "Friend request rejected" });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a sent friend request
// @route   DELETE /api/friends/cancel/:requestId
// @access  Private
const cancelFriendRequest = async (req, res, next) => {
  try {
    const request = await FriendRequest.findById(req.params.requestId);

    if (!request) {
      res.status(404);
      throw new Error("Friend request not found");
    }

    // Sirf sender hi cancel kar sakta hai
    if (!request.sender.equals(req.user._id)) {
      res.status(403);
      throw new Error("You are not authorized to cancel this request");
    }

    await request.deleteOne();

    res
      .status(200)
      .json({ success: true, message: "Friend request cancelled" });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove an existing friend
// @route   DELETE /api/friends/:id
// @access  Private
const removeFriend = async (req, res, next) => {
  try {
    const friendId = req.params.id;

    await User.findByIdAndUpdate(req.user._id, {
      $pull: { friends: friendId },
    });
    await User.findByIdAndUpdate(friendId, {
      $pull: { friends: req.user._id },
    });

    res.status(200).json({ success: true, message: "Friend removed" });
  } catch (error) {
    next(error);
  }
};

// @desc    Get pending requests received by me
// @route   GET /api/friends/requests/received
// @access  Private
const getReceivedRequests = async (req, res, next) => {
  try {
    const requests = await FriendRequest.find({
      receiver: req.user._id,
      status: "pending",
    }).populate("sender", "name profilePicture");

    res.status(200).json({ success: true, requests });
  } catch (error) {
    next(error);
  }
};

// @desc    Get pending requests I've sent
// @route   GET /api/friends/requests/sent
// @access  Private
const getSentRequests = async (req, res, next) => {
  try {
    const requests = await FriendRequest.find({
      sender: req.user._id,
      status: "pending",
    }).populate("receiver", "name profilePicture");

    res.status(200).json({ success: true, requests });
  } catch (error) {
    next(error);
  }
};

const getFriendsList = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "friends",
      "name profilePicture bio",
    );

    res.status(200).json({ success: true, friends: user.friends });
  } catch (error) {
    next(error);
  }
};
// @desc    Get suggested users to connect with (not friends, no pending request, not blocked)
// @route   GET /api/friends/suggestions
// @access  Private
const getSuggestions = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.user._id);

    // Find all pending/accepted request pairs involving me, so I can exclude those users
    const existingRequests = await FriendRequest.find({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }],
    });

    const excludedIds = new Set([
      req.user._id.toString(),
      ...currentUser.friends.map((id) => id.toString()),
      ...currentUser.blockedUsers.map((id) => id.toString()),
      ...existingRequests.map((r) =>
        r.sender.toString() === req.user._id.toString()
          ? r.receiver.toString()
          : r.sender.toString(),
      ),
    ]);

    // Also exclude users who have blocked me
    const usersWhoBlockedMe = await User.find({
      blockedUsers: req.user._id,
    }).select("_id");
    usersWhoBlockedMe.forEach((u) => excludedIds.add(u._id.toString()));

    const suggestions = await User.find({
      _id: { $nin: Array.from(excludedIds) },
      isVerified: true,
    })
      .select("name username profilePicture bio professionalTitle friends")
      .limit(20);

    // Rank by mutual friends count (people you likely actually know)
    const withMutualCount = suggestions.map((u) => {
      const mutualCount = u.friends.filter((fid) =>
        currentUser.friends.some((myFriendId) => myFriendId.equals(fid)),
      ).length;
      return {
        ...u.toObject(),
        mutualFriendsCount: mutualCount,
        friends: undefined,
      };
    });

    withMutualCount.sort((a, b) => b.mutualFriendsCount - a.mutualFriendsCount);

    res.status(200).json({ success: true, suggestions: withMutualCount });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  cancelFriendRequest,
  removeFriend,
  getReceivedRequests,
  getSentRequests,
  getFriendsList,
  getSuggestions,
};
