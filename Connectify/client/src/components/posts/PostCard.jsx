import { useState, useEffect } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import socket from "../../services/socket";
import CommentSection from "./CommentSection";
import "../../styles/posts.css";

const mediaUrl = (path) => `${import.meta.env.VITE_SOCKET_URL}${path}`;

function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  const units = [
    ["y", 31536000],
    ["mo", 2592000],
    ["d", 86400],
    ["h", 3600],
    ["m", 60],
  ];
  for (const [label, secs] of units) {
    const val = Math.floor(seconds / secs);
    if (val >= 1) return `${val}${label} ago`;
  }
  return "Just now";
}

export default function PostCard({ post, onDeleted }) {
  const { user } = useAuth();
  const [likes, setLikes] = useState(post.likes || []);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount || 0);
  const [showComments, setShowComments] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const liked = likes.includes(user?._id);
  const isOwner = post.user._id === user?._id;

  useEffect(() => {
    const handleLikeUpdate = (data) => {
      if (data.postId === post._id) {
        setLikes((prev) => {
          if (data.liked && !prev.includes(data.likedBy))
            return [...prev, data.likedBy];
          if (!data.liked) return prev.filter((id) => id !== data.likedBy);
          return prev;
        });
      }
    };
    const handleNewComment = (data) => {
      if (data.postId === post._id) setCommentsCount(data.commentsCount);
    };

    socket.on("post_liked", handleLikeUpdate);
    socket.on("new_comment", handleNewComment);
    return () => {
      socket.off("post_liked", handleLikeUpdate);
      socket.off("new_comment", handleNewComment);
    };
  }, [post._id]);

  const toggleLike = async () => {
    try {
      const res = await api.put(`/posts/${post._id}/like`);
      setLikes(
        res.data.liked
          ? [...likes, user._id]
          : likes.filter((id) => id !== user._id),
      );
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this post?")) return;
    try {
      await api.delete(`/posts/${post._id}`);
      onDeleted(post._id);
      toast.success("Post deleted");
    } catch {
      toast.error("Failed to delete post");
    }
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <img
          className="post-avatar"
          src={
            post.user.profilePicture
              ? mediaUrl(post.user.profilePicture)
              : "/default-avatar.png"
          }
          alt={post.user.name}
        />
        <div className="post-header-info">
          <p className="post-author">{post.user.name}</p>
          <p className="post-time">{timeAgo(post.createdAt)}</p>
        </div>

        {isOwner && (
          <div className="post-menu-wrap">
            <button
              className="post-menu-btn"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <MoreHorizontal size={18} />
            </button>
            {menuOpen && (
              <div className="post-menu-dropdown">
                <button onClick={handleDelete}>
                  <Trash2 size={14} /> Delete post
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {post.text && <p className="post-text">{post.text}</p>}

      {post.media?.length > 0 && (
        <div
          className={`post-media-grid count-${Math.min(post.media.length, 4)}`}
        >
          {post.media.map((m, i) =>
            m.type === "video" ? (
              <video key={i} src={mediaUrl(m.url)} controls />
            ) : (
              <img key={i} src={mediaUrl(m.url)} alt="" />
            ),
          )}
        </div>
      )}

      <div className="post-stats">
        <span>{likes.length > 0 && `❤️ ${likes.length}`}</span>
        <span>{commentsCount > 0 && `${commentsCount} comments`}</span>
      </div>

      <div className="post-actions">
        <button className={liked ? "active" : ""} onClick={toggleLike}>
          <Heart size={17} fill={liked ? "#e11d48" : "none"} />
          Like
        </button>
        <button onClick={() => setShowComments((v) => !v)}>
          <MessageCircle size={17} />
          Comment
        </button>
        <button>
          <Share2 size={17} />
          Share
        </button>
        <button>
          <Bookmark size={17} />
          Save
        </button>
      </div>

      {showComments && (
        <CommentSection
          postId={post._id}
          onCommentAdded={() => setCommentsCount((c) => c + 1)}
        />
      )}
    </div>
  );
}
