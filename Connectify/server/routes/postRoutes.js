const express = require("express");
const router = express.Router();
const {
  createPost,
  getFeed,
  getExplorePosts,
  getPostById,
  toggleLike,
  updatePost,
  deletePost,
  toggleSavePost,
  getSavedPosts,
} = require("../controllers/postController");

const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.use(protect);

// ---- Specific routes FIRST ----
router.post("/", upload.array("media", 5), createPost);
router.get("/feed", getFeed);
router.get("/explore", getExplorePosts);
router.get("/saved/all", getSavedPosts);

// ---- Generic /:id routes LAST ----
router.get("/:id", getPostById);
router.put("/:id/like", toggleLike);
router.put("/:id/save", toggleSavePost);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);

module.exports = router;
