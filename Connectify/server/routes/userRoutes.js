const express = require("express");
const router = express.Router();

const {
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
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.use(protect);

// ---- Specific routes FIRST (before /:id) ----
router.get("/blocked/all", getBlockedUsers);
router.get("/export-data", exportUserData);
router.put("/change-password", changePassword);
router.delete("/account", deleteAccount);

router.put("/profile", updateProfile);
router.put("/profile-picture", upload.single("image"), uploadProfilePicture);
router.put("/cover-photo", upload.single("image"), uploadCoverPhoto);
router.put("/privacy", updatePrivacySettings);
router.put("/block/:id", blockUser);
router.put("/unblock/:id", unblockUser);

// ---- Generic /:id LAST ----
router.get("/:id", getUserProfile);

module.exports = router;
