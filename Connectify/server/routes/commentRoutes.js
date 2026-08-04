const express = require("express");
const router = express.Router();

const {
  addComment,
  getComments,
  deleteComment,
} = require("../controllers/commentController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.post("/:postId", addComment);
router.get("/:postId", getComments);
router.delete("/:id", deleteComment);

module.exports = router;
