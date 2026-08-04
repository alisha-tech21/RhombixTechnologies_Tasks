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
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.use(protect);

router.get("/:id", getUserProfile);
router.put("/profile", updateProfile);
router.put("/profile-picture", upload.single("image"), uploadProfilePicture);
router.put("/cover-photo", upload.single("image"), uploadCoverPhoto);
router.put("/privacy", updatePrivacySettings);
router.put("/block/:id", blockUser);
router.put("/unblock/:id", unblockUser);

module.exports = router;
