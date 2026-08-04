const FriendRequest = require("../models/FriendRequest");
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

module.exports = {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  cancelFriendRequest,
  removeFriend,
  getReceivedRequests,
  getSentRequests,
  getFriendsList,
};
