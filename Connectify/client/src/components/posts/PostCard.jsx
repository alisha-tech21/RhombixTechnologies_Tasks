import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import socket from "../../services/socket";
import { getAvatarUrl } from "../../utils/avatar";
import CommentSection from "./CommentSection";
import PostMenu from "./PostMenu";
import EditPostModal from "./EditPostModal";
import "../../styles/posts.css";

const PREVIEW_LENGTH = 250;

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

export default function PostCard({ post: initialPost, onDeleted, onUnsaved }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(initialPost);
  const [likes, setLikes] = useState(initialPost.likes || []);
  const [commentsCount, setCommentsCount] = useState(
    initialPost.commentsCount || 0,
  );
  const [showComments, setShowComments] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [textExpanded, setTextExpanded] = useState(false);

  if (!post.user) return null;

  const liked = likes.includes(user?._id);
  const isOwner = post.user._id === user?._id;
  const needsTruncate = post.text && post.text.length > PREVIEW_LENGTH + 40;
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

  return (
    <div className="post-card">
      <div className="post-header">
        <img
          className="post-avatar"
          src={getAvatarUrl(post.user.profilePicture, post.user.name)}
          alt={post.user.name}
          onClick={() => navigate(`/profile/${post.user._id}`)}
          style={{ cursor: "pointer" }}
        />
        <div className="post-header-info">
          <p
            className="post-author"
            onClick={() => navigate(`/profile/${post.user._id}`)}
            style={{ cursor: "pointer" }}
          >
            {post.user.name}
          </p>
          <p className="post-time">{timeAgo(post.createdAt)}</p>
        </div>
        <PostMenu
          post={post}
          isOwner={isOwner}
          onEdit={() => setIsEditing(true)}
          onDeleted={onDeleted}
          onUnsaved={onUnsaved}
        />
      </div>

      {post.text && (
        <p className="post-text">
          {needsTruncate && !textExpanded ? (
            <>
              {post.text.slice(0, PREVIEW_LENGTH)}...{" "}
              <button
                className="read-more-btn"
                onClick={() => setTextExpanded(true)}
              >
                ...see more
              </button>
            </>
          ) : (
            <>
              {post.text}
              {needsTruncate && (
                <>
                  {" "}
                  <button
                    className="read-more-btn"
                    onClick={() => setTextExpanded(false)}
                  >
                    Show less
                  </button>
                </>
              )}
            </>
          )}
        </p>
      )}

      {post.media?.length > 0 && (
        <div
          className={`post-media-grid count-${Math.min(post.media.length, 4)}`}
          onClick={() => navigate(`/post/${post._id}`)}
          style={{ cursor: "pointer" }}
        >
          {post.media.map((m, i) =>
            m.type === "video" ? (
              <video
                key={i}
                src={`${import.meta.env.VITE_SOCKET_URL}${m.url}`}
                controls
              />
            ) : (
              <img
                key={i}
                src={`${import.meta.env.VITE_SOCKET_URL}${m.url}`}
                alt=""
              />
            ),
          )}
        </div>
      )}

      <div className="post-stats">
        <span>{likes.length > 0 && `❤️ ${likes.length}`}</span>
        {commentsCount > 0 && (
          <span
            className="stats-link"
            onClick={() => setShowComments((v) => !v)}
          >
            {commentsCount} comments
          </span>
        )}
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
      </div>

      {showComments && (
        <CommentSection
          postId={post._id}
          postOwnerId={post.user._id}
          onCommentAdded={() => setCommentsCount((c) => c + 1)}
        />
      )}

      {isEditing && (
        <EditPostModal
          post={post}
          onClose={() => setIsEditing(false)}
          onSaved={(updated) => setPost(updated)}
        />
      )}
    </div>
  );
}
