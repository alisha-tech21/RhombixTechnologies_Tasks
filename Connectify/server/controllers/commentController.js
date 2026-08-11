const Comment = require("../models/Comment");
const Post = require("../models/Post");
const Notification = require("../models/Notification");
const { emitToUser, emitToAll } = require("../socket/socketServer");

const truncateText = (text, length = 50) => {
  if (!text) return "";
  return text.length > length ? text.slice(0, length) + "..." : text;
};

// @desc    Add a comment or a reply to a post
// @route   POST /api/comments/:postId
// @access  Private
const addComment = async (req, res, next) => {
  try {
    const { text, parentComment } = req.body;

    if (!text || !text.trim()) {
      res.status(400);
      throw new Error("Comment text is required");
    }

    const post = await Post.findById(req.params.postId);
    if (!post) {
      res.status(404);
      throw new Error("Post not found");
    }

    // If this is a reply, make sure the parent comment actually exists on this post
    let parentDoc = null;
    if (parentComment) {
      parentDoc = await Comment.findById(parentComment);
      if (!parentDoc || !parentDoc.post.equals(post._id)) {
        res.status(400);
        throw new Error("Invalid comment to reply to");
      }
    }

    const comment = await Comment.create({
      post: post._id,
      user: req.user._id,
      text: text.trim(),
      parentComment: parentComment || null,
      replyToUser: parentDoc ? parentDoc.user : null,
    });

    post.commentsCount += 1;
    await post.save();

    const populatedComment = await comment.populate(
      "user",
      "name profilePicture",
    );

    // Notify the post owner (for a top-level comment) or the parent comment's author (for a reply)
    const notifyTargetId = parentDoc ? parentDoc.user : post.user;
    if (!notifyTargetId.equals(req.user._id)) {
      const notification = await Notification.create({
        recipient: notifyTargetId,
        sender: req.user._id,
        type: "comment",
        post: post._id,
        message: parentDoc
          ? `${req.user.name} replied: "${truncateText(text)}"`
          : `${req.user.name} commented: "${truncateText(text)}"`,
      });
      const populatedNotification = await notification.populate(
        "sender",
        "name profilePicture",
      );
      emitToUser(notifyTargetId, "notification", populatedNotification);
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

// @desc    Get all comments for a post (flat list, frontend groups replies under parents)
// @route   GET /api/comments/:postId
// @access  Private
const getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate("user", "name profilePicture")
      .populate("replyToUser", "name")
      .sort({ createdAt: 1 });

    const validComments = comments.filter((c) => c.user);

    res.status(200).json({ success: true, comments: validComments });
  } catch (error) {
    next(error);
  }
};

// @desc    Like or unlike a comment
// @route   PUT /api/comments/:id/like
// @access  Private
const toggleCommentLike = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      res.status(404);
      throw new Error("Comment not found");
    }

    const alreadyLiked = comment.likes.some((id) => id.equals(req.user._id));

    if (alreadyLiked) {
      comment.likes = comment.likes.filter((id) => !id.equals(req.user._id));
    } else {
      comment.likes.push(req.user._id);

      if (!comment.user.equals(req.user._id)) {
        const notification = await Notification.create({
          recipient: comment.user,
          sender: req.user._id,
          type: "like",
          post: comment.post,
          message: `${req.user.name} liked your comment`,
        });
        const populatedNotification = await notification.populate(
          "sender",
          "name profilePicture",
        );
        emitToUser(comment.user, "notification", populatedNotification);
      }
    }

    await comment.save();

    emitToAll("comment_liked", {
      commentId: comment._id,
      likesCount: comment.likes.length,
      likedBy: req.user._id,
      liked: !alreadyLiked,
    });

    res.status(200).json({
      success: true,
      liked: !alreadyLiked,
      likesCount: comment.likes.length,
    });
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

    // Also delete any replies to this comment, so nothing is left dangling
    const replies = await Comment.find({ parentComment: comment._id });
    const totalRemoved = 1 + replies.length;

    await Comment.deleteMany({
      _id: { $in: [comment._id, ...replies.map((r) => r._id)] },
    });
    await Post.findByIdAndUpdate(postId, {
      $inc: { commentsCount: -totalRemoved },
    });

    emitToAll("comment_deleted", { postId, commentId: comment._id });

    res
      .status(200)
      .json({ success: true, message: "Comment deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = { addComment, getComments, toggleCommentLike, deleteComment };
