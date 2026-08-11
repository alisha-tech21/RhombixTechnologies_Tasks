const User = require("../models/User");
const fs = require("fs");
const path = require("path");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const FriendRequest = require("../models/FriendRequest");
const Notification = require("../models/Notification");
// @desc    Get a user's profile (respects privacy settings)
// @route   GET /api/users/:id
// @access  Private
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    const isSelf = user._id.equals(req.user._id);
    const isFriend = user.friends.some((f) => f.equals(req.user._id));
    const viewerIsBlocked = user.blockedUsers.some((b) =>
      b.equals(req.user._id),
    );

    // Agar profile owner ne viewer ko block kiya hai, kuch bhi na dikhao
    if (viewerIsBlocked && !isSelf) {
      res.status(403);
      throw new Error("You cannot view this profile");
    }

    // Privacy check
    if (!isSelf) {
      if (user.privacy.profileVisibility === "private") {
        res.status(403);
        throw new Error("This profile is private");
      }
      if (user.privacy.profileVisibility === "friends" && !isFriend) {
        res.status(403);
        throw new Error("This profile is only visible to friends");
      }
    }

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        bio: user.bio,
        profilePicture: user.profilePicture,
        coverPhoto: user.coverPhoto,
        skills: user.skills,
        professionalTitle: user.professionalTitle,
        location: user.location,
        website: user.website,
        githubUrl: user.githubUrl,
        linkedinUrl: user.linkedinUrl,
        education: user.education,
        experience: user.experience,
        friendsCount: user.friends.length,
        isSelf,
        isFriend,
        privacy: isSelf ? user.privacy : undefined,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update own profile info (name, bio)
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const {
      name,
      bio,
      skills,
      professionalTitle,
      location,
      website,
      githubUrl,
      linkedinUrl,
      education,
      experience,
    } = req.body;

    const user = await User.findById(req.user._id);

    if (name !== undefined) {
      if (name.trim().length < 2) {
        res.status(400);
        throw new Error("Name must be at least 2 characters");
      }
      user.name = name.trim();
    }

    if (bio !== undefined) {
      if (bio.length > 300) {
        res.status(400);
        throw new Error("Bio cannot exceed 300 characters");
      }
      user.bio = bio;
    }

    if (skills !== undefined) user.skills = Array.isArray(skills) ? skills : [];
    if (professionalTitle !== undefined)
      user.professionalTitle = professionalTitle;
    if (location !== undefined) user.location = location;
    if (website !== undefined) user.website = website;
    if (githubUrl !== undefined) user.githubUrl = githubUrl;
    if (linkedinUrl !== undefined) user.linkedinUrl = linkedinUrl;
    if (education !== undefined)
      user.education = Array.isArray(education) ? education : [];
    if (experience !== undefined)
      user.experience = Array.isArray(experience) ? experience : [];

    await user.save();

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        bio: user.bio,
        profilePicture: user.profilePicture,
        coverPhoto: user.coverPhoto,
        skills: user.skills,
        professionalTitle: user.professionalTitle,
        location: user.location,
        website: user.website,
        githubUrl: user.githubUrl,
        linkedinUrl: user.linkedinUrl,
        education: user.education,
        experience: user.experience,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Helper — purani uploaded file ko disk se delete karta hai (jab naya replace ho)
const deleteOldFile = (filePath) => {
  if (filePath) {
    const fullPath = path.join(__dirname, "..", filePath);
    fs.unlink(fullPath, (err) => {
      if (err) console.error("Could not delete old file:", err.message);
    });
  }
};

// @desc    Upload/update profile picture
// @route   PUT /api/users/profile-picture
// @access  Private
const uploadProfilePicture = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error("Please upload an image");
    }

    const user = await User.findById(req.user._id);
    const oldPicture = user.profilePicture;

    user.profilePicture = `/uploads/${req.file.filename}`;
    await user.save();

    // Purani picture delete kar do (agar thi) — storage clean rakhne ke liye
    if (oldPicture) deleteOldFile(oldPicture);

    res.status(200).json({
      success: true,
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload/update cover photo
// @route   PUT /api/users/cover-photo
// @access  Private
const uploadCoverPhoto = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error("Please upload an image");
    }

    const user = await User.findById(req.user._id);
    const oldCover = user.coverPhoto;

    user.coverPhoto = `/uploads/${req.file.filename}`;
    await user.save();

    if (oldCover) deleteOldFile(oldCover);

    res.status(200).json({
      success: true,
      coverPhoto: user.coverPhoto,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update privacy settings
// @route   PUT /api/users/privacy
// @access  Private
const updatePrivacySettings = async (req, res, next) => {
  try {
    const { profileVisibility, postsVisibility } = req.body;
    const validOptions = ["public", "friends", "private"];

    const user = await User.findById(req.user._id);

    if (profileVisibility) {
      if (!validOptions.includes(profileVisibility)) {
        res.status(400);
        throw new Error("Invalid profile visibility option");
      }
      user.privacy.profileVisibility = profileVisibility;
    }

    if (postsVisibility) {
      if (!validOptions.includes(postsVisibility)) {
        res.status(400);
        throw new Error("Invalid posts visibility option");
      }
      user.privacy.postsVisibility = postsVisibility;
    }

    await user.save();

    res.status(200).json({
      success: true,
      privacy: user.privacy,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Block a user
// @route   PUT /api/users/block/:id
// @access  Private
const blockUser = async (req, res, next) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      res.status(400);
      throw new Error("You cannot block yourself");
    }

    const userToBlock = await User.findById(req.params.id);
    if (!userToBlock) {
      res.status(404);
      throw new Error("User not found");
    }

    const user = await User.findById(req.user._id);

    if (user.blockedUsers.includes(req.params.id)) {
      res.status(400);
      throw new Error("User is already blocked");
    }

    user.blockedUsers.push(req.params.id);

    // Block karte hi friends list se bhi hata do (dono taraf se)
    user.friends = user.friends.filter((f) => !f.equals(req.params.id));
    userToBlock.friends = userToBlock.friends.filter(
      (f) => !f.equals(req.user._id),
    );

    await user.save();
    await userToBlock.save();

    res
      .status(200)
      .json({ success: true, message: "User blocked successfully" });
  } catch (error) {
    next(error);
  }
};

// @desc    Unblock a user
// @route   PUT /api/users/unblock/:id
// @access  Private
const unblockUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    user.blockedUsers = user.blockedUsers.filter(
      (b) => !b.equals(req.params.id),
    );
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "User unblocked successfully" });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my blocked users list
// @route   GET /api/users/blocked/all
// @access  Private
const getBlockedUsers = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "blockedUsers",
      "name profilePicture bio",
    );
    res.status(200).json({ success: true, blockedUsers: user.blockedUsers });
  } catch (error) {
    next(error);
  }
};

// @desc    Change password (while logged in)
// @route   PUT /api/users/change-password
// @access  Private
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400);
      throw new Error("Please provide your current and new password");
    }

    if (newPassword.length < 6) {
      res.status(400);
      throw new Error("New password must be at least 6 characters");
    }

    const user = await User.findById(req.user._id).select("+password");

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      res.status(401);
      throw new Error("Current password is incorrect");
    }

    user.password = newPassword; // pre-save hook hashes it automatically
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    next(error);
  }
};

// @desc    Export all my data as JSON
// @route   GET /api/users/export-data
// @access  Private
const exportUserData = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select(
      "-password -resetPasswordToken -resetPasswordExpire -emailVerificationToken -emailVerificationExpire",
    );
    const posts = await Post.find({ user: req.user._id });
    const comments = await Comment.find({ user: req.user._id });
    const friends = await User.findById(req.user._id).populate(
      "friends",
      "name email",
    );

    const exportPayload = {
      profile: user,
      posts,
      comments,
      friends: friends.friends,
      exportedAt: new Date(),
    };

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=connectify-data-export.json",
    );
    res.setHeader("Content-Type", "application/json");
    res.status(200).send(JSON.stringify(exportPayload, null, 2));
  } catch (error) {
    next(error);
  }
};

// @desc    Permanently delete my account and all associated data
// @route   DELETE /api/users/account
// @access  Private
const deleteAccount = async (req, res, next) => {
  try {
    const { password } = req.body;

    if (!password) {
      res.status(400);
      throw new Error("Please enter your password to confirm account deletion");
    }

    const user = await User.findById(req.user._id).select("+password");

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      res.status(401);
      throw new Error("Incorrect password");
    }

    const userId = user._id;

    // Capture post IDs before deleting them, so we can clean up other users' savedPosts references
    const myPostIds = await Post.find({ user: userId }).distinct("_id");

    await Post.deleteMany({ user: userId });
    await Comment.deleteMany({ user: userId });
    await FriendRequest.deleteMany({
      $or: [{ sender: userId }, { receiver: userId }],
    });
    await Notification.deleteMany({
      $or: [{ sender: userId }, { recipient: userId }],
    });

    // Remove this user from everyone else's friends/blocked lists, and their posts from savedPosts
    await User.updateMany(
      {},
      {
        $pull: {
          friends: userId,
          blockedUsers: userId,
          savedPosts: { $in: myPostIds },
        },
      },
    );

    await user.deleteOne();

    res
      .status(200)
      .json({
        success: true,
        message: "Your account has been permanently deleted",
      });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserProfile,
  updateProfile,
  uploadProfilePicture,
  uploadCoverPhoto,
  updatePrivacySettings,
  blockUser,
  unblockUser,
  getBlockedUsers,
  changePassword,
  exportUserData,
  deleteAccount,
};
