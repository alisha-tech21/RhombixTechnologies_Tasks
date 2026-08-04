const Post = require("../models/Post");
const Comment = require("../models/Comment");
const User = require("../models/User");
const { emitToUser, emitToAll } = require("../socket/socketServer");

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res, next) => {
  try {
    const { text, visibility } = req.body;

    const media = (req.files || []).map((file) => ({
      url: `/uploads/${file.filename}`,
      type: file.mimetype.startsWith("video") ? "video" : "image",
    }));

    const post = await Post.create({
      user: req.user._id,
      text,
      media,
      visibility: visibility || "public",
    });

    const populatedPost = await post.populate("user", "name profilePicture");

    if (post.visibility === "public") {
      emitToAll("new_post", populatedPost);
    }

    res.status(201).json({ success: true, post: populatedPost });
  } catch (error) {
    next(error);
  }
};

// @desc    Get news feed (self + friends posts, respecting visibility)
// @route   GET /api/posts/feed
// @access  Private
const getFeed = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.user._id);
    const friendIds = currentUser.friends;

    const posts = await Post.find({
      $or: [
        { user: req.user._id }, //
        {
          user: { $in: friendIds },
          visibility: { $in: ["public", "friends"] },
        },
      ],
    })
      .populate("user", "name profilePicture")
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({ success: true, posts });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single post by ID (with visibility check)
// @route   GET /api/posts/:id
// @access  Private
const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "user",
      "name profilePicture",
    );

    if (!post) {
      res.status(404);
      throw new Error("Post not found");
    }

    const isOwner = post.user._id.equals(req.user._id);

    if (!isOwner) {
      const postOwner = await User.findById(post.user._id);
      const isFriend = postOwner.friends.some((f) => f.equals(req.user._id));

      if (post.visibility === "private") {
        res.status(403);
        throw new Error("This post is private");
      }
      if (post.visibility === "friends" && !isFriend) {
        res.status(403);
        throw new Error("This post is only visible to friends");
      }
    }

    res.status(200).json({ success: true, post });
  } catch (error) {
    next(error);
  }
};

// @desc    Like or unlike a post (toggle)
// @route   PUT /api/posts/:id/like
// @access  Private
const toggleLike = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(404);
      throw new Error("Post not found");
    }

    const alreadyLiked = post.likes.some((id) => id.equals(req.user._id));

    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => !id.equals(req.user._id));
    } else {
      post.likes.push(req.user._id);

      if (!post.user.equals(req.user._id)) {
        emitToUser(post.user, "notification", {
          type: "like",
          message: `${req.user.name} liked your post`,
          postId: post._id,
          from: { _id: req.user._id, name: req.user.name },
        });
      }
    }

    await post.save();

    emitToAll("post_liked", {
      postId: post._id,
      likesCount: post.likes.length,
      likedBy: req.user._id,
      liked: !alreadyLiked,
    });

    res.status(200).json({
      success: true,
      liked: !alreadyLiked,
      likesCount: post.likes.length,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete own post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(404);
      throw new Error("Post not found");
    }

    if (!post.user.equals(req.user._id)) {
      res.status(403);
      throw new Error("You can only delete your own posts");
    }

    await Comment.deleteMany({ post: post._id });
    await post.deleteOne();

    emitToAll("post_deleted", { postId: post._id });

    res
      .status(200)
      .json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = { createPost, getFeed, getPostById, toggleLike, deletePost };
