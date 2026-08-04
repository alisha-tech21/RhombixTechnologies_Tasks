const User = require("../models/User");
const fs = require("fs");
const path = require("path");

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
        bio: user.bio,
        profilePicture: user.profilePicture,
        coverPhoto: user.coverPhoto,
        friendsCount: user.friends.length,
        isSelf,
        isFriend,
        // Privacy settings sirf khud ko dikhengi, doosron ko nahi
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
    const { name, bio } = req.body;
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

    await user.save();

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        bio: user.bio,
        profilePicture: user.profilePicture,
        coverPhoto: user.coverPhoto,
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

module.exports = {
  getUserProfile,
  updateProfile,
  uploadProfilePicture,
  uploadCoverPhoto,
  updatePrivacySettings,
  blockUser,
  unblockUser,
};
