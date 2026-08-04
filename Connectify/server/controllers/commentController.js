const Comment = require("../models/Comment");
const Post = require("../models/Post");
const { emitToUser, emitToAll } = require("../socket/socketServer");

// @desc    Add a comment to a post
// @route   POST /api/comments/:postId
// @access  Private
const addComment = async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      res.status(400);
      throw new Error("Comment text is required");
    }

    const post = await Post.findById(req.params.postId);
    if (!post) {
      res.status(404);
      throw new Error("Post not found");
    }

    const comment = await Comment.create({
      post: post._id,
      user: req.user._id,
      text: text.trim(),
    });

    post.commentsCount += 1;
    await post.save();

    const populatedComment = await comment.populate(
      "user",
      "name profilePicture",
    );

    if (!post.user.equals(req.user._id)) {
      emitToUser(post.user, "notification", {
        type: "comment",
        message: `${req.user.name} commented on your post`,
        postId: post._id,
        from: { _id: req.user._id, name: req.user.name },
      });
    }

    emitToAll("new_comment", {
      postId: post._id,
      comment: populatedComment,
      commentsCount: post.commentsCount,
    });

    res.status(201).json({ success: true, comment: populatedComment });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all comments for a post
// @route   GET /api/comments/:postId
// @access  Private
const getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate("user", "name profilePicture")
      .sort({ createdAt: 1 });

    res.status(200).json({ success: true, comments });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete own comment
// @route   DELETE /api/comments/:id
// @access  Private
const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      res.status(404);
      throw new Error("Comment not found");
    }

    if (!comment.user.equals(req.user._id)) {
      res.status(403);
      throw new Error("You can only delete your own comments");
    }

    const postId = comment.post;
    await comment.deleteOne();

    await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: -1 } });

    emitToAll("comment_deleted", { postId, commentId: comment._id });

    res
      .status(200)
      .json({ success: true, message: "Comment deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = { addComment, getComments, deleteComment };
