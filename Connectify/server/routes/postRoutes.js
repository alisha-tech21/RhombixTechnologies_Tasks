const express = require("express");
const router = express.Router();

const {
  createPost,
  getFeed,
  getPostById,
  toggleLike,
  deletePost,
} = require("../controllers/postController");

const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.use(protect);

router.post("/", upload.array("media", 5), createPost);
router.get("/feed", getFeed);
router.get("/:id", getPostById);
router.put("/:id/like", toggleLike);
router.delete("/:id", deletePost);

module.exports = router;
