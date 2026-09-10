import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Send } from "lucide-react";
import CommentMenu from "./CommentMenu";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import socket from "../../services/socket";
import { getAvatarUrl } from "../../utils/avatar";
import "../../styles/posts.css";

const INITIAL_VISIBLE = 3;

function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  const units = [
    ["d", 86400],
    ["h", 3600],
    ["m", 60],
  ];
  for (const [label, secs] of units) {
    const val = Math.floor(seconds / secs);
    if (val >= 1) return `${val}${label}`;
  }
  return "now";
}

function CommentRow({
  comment,
  postOwnerId,
  currentUser,
  navigate,
  onReplyClick,
  onToggleLike,
  onDeleted,
}) {
  const liked = comment.likes?.includes(currentUser?._id);
  const isPostOwner = postOwnerId && comment.user._id === postOwnerId;
  const isMyComment = comment.user._id === currentUser?._id;
  const amIPostOwner = postOwnerId === currentUser?._id;

  return (
    <div className="li-comment-row">
      <img
        className="li-comment-avatar"
        src={getAvatarUrl(comment.user.profilePicture, comment.user.name)}
        alt={comment.user.name}
        onClick={() => navigate(`/profile/${comment.user._id}`)}
      />
      <div className="li-comment-content">
        <div className="li-comment-meta">
          <span
            className="li-comment-name"
            onClick={() => navigate(`/profile/${comment.user._id}`)}
          >
            {comment.user.name}
          </span>
          {isPostOwner && <span className="author-badge">Author</span>}
          <span className="li-comment-time">{timeAgo(comment.createdAt)}</span>
          <CommentMenu
            comment={comment}
            isOwner={isMyComment}
            isPostOwner={amIPostOwner}
            onDeleted={onDeleted}
          />
        </div>

        <p className="li-comment-text">
          {comment.replyToUser && (
            <span
              className="li-mention"
              onClick={() => navigate(`/profile/${comment.replyToUser._id}`)}
            >
              @{comment.replyToUser.name}{" "}
            </span>
          )}
          {comment.text}
        </p>

        <div className="li-comment-actions">
          <button
            className={comment.likes?.length > 0 ? "active" : ""}
            onClick={() => onToggleLike(comment._id)}
          >
            Like {comment.likes?.length > 0 && `(${comment.likes.length})`}
          </button>
          <button onClick={() => onReplyClick(comment)}>Reply</button>
        </div>
      </div>
    </div>
  );
}

export default function CommentSection({
  postId,
  postOwnerId,
  onCommentAdded,
}) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const [replyingTo, setReplyingTo] = useState(null);

  useEffect(() => {
    api
      .get(`/comments/${postId}`)
      .then((res) => setComments(res.data.comments))
      .finally(() => setLoading(false));

    const handleNewComment = (data) => {
      if (data.postId === postId)
        setComments((prev) => [...prev, data.comment]);
    };
    const handleCommentLiked = (data) => {
      setComments((prev) =>
        prev.map((c) => {
          if (c._id !== data.commentId) return c;
          const likes = data.liked
            ? [...(c.likes || []), data.likedBy]
            : (c.likes || []).filter((id) => id !== data.likedBy);
          return { ...c, likes };
        }),
      );
    };
    const handleCommentDeleted = (data) => {
      if (data.postId === postId) {
        setComments((prev) =>
          prev.filter(
            (c) =>
              c._id !== data.commentId && c.parentComment !== data.commentId,
          ),
        );
      }
    };

    socket.on("new_comment", handleNewComment);
    socket.on("comment_liked", handleCommentLiked);
    socket.on("comment_deleted", handleCommentDeleted);
    return () => {
      socket.off("new_comment", handleNewComment);
      socket.off("comment_liked", handleCommentLiked);
      socket.off("comment_deleted", handleCommentDeleted);
    };
  }, [postId]);

  const submitComment = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const currentText = text;
    const parentId = replyingTo?._id || null;
    setText("");
    setReplyingTo(null);
    try {
      await api.post(`/comments/${postId}`, {
        text: currentText,
        parentComment: parentId,
      });
      onCommentAdded();
    } catch {
      setText(currentText);
    }
  };

  const toggleLike = async (commentId) => {
    try {
      const res = await api.put(`/comments/${commentId}/like`);
      setComments((prev) =>
        prev.map((c) => {
          if (c._id !== commentId) return c;
          const likes = res.data.liked
            ? [...(c.likes || []), user._id]
            : (c.likes || []).filter((id) => id !== user._id);
          return { ...c, likes };
        }),
      );
    } catch {
      // no-op
    }
  };

  const topLevel = comments.filter((c) => !c.parentComment);
  const repliesByParent = comments.reduce((acc, c) => {
    if (c.parentComment) {
      acc[c.parentComment] = acc[c.parentComment] || [];
      acc[c.parentComment].push(c);
    }
    return acc;
  }, {});
  const handleCommentDeleted = (commentId) => {
    setComments((prev) =>
      prev.filter((c) => c._id !== commentId && c.parentComment !== commentId),
    );
  };

  const reversedTopLevel = [...topLevel].reverse();
  const visibleTopLevel = reversedTopLevel.slice(0, visibleCount);
  const remaining = topLevel.length - visibleCount;

  return (
    <div className="comment-section">
      {loading ? (
        <p className="comment-loading">Loading comments...</p>
      ) : (
        <>
          {visibleTopLevel.map((comment) => (
            <div className="li-thread" key={comment._id}>
              <CommentRow
                comment={comment}
                postOwnerId={postOwnerId}
                currentUser={user}
                navigate={navigate}
                onReplyClick={setReplyingTo}
                onToggleLike={toggleLike}
                onDeleted={handleCommentDeleted}
              />

              {repliesByParent[comment._id]?.length > 0 && (
                <div className="li-replies">
                  {repliesByParent[comment._id].map((reply) => (
                    <CommentRow
                      key={reply._id}
                      comment={reply}
                      postOwnerId={postOwnerId}
                      currentUser={user}
                      navigate={navigate}
                      onReplyClick={() => setReplyingTo(comment)}
                      onToggleLike={toggleLike}
                      onDeleted={handleCommentDeleted}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}

          {remaining > 0 && (
            <button
              className="see-more-comments-btn"
              onClick={() => setVisibleCount((v) => v + 10)}
            >
              See {remaining} more comment{remaining > 1 ? "s" : ""}
            </button>
          )}
        </>
      )}

      {replyingTo && (
        <div className="replying-to-banner">
          Replying to <strong>{replyingTo.user.name}</strong>
          <button onClick={() => setReplyingTo(null)}>Cancel</button>
        </div>
      )}

      <form className="comment-form" onSubmit={submitComment}>
        <img
          src={getAvatarUrl(user?.profilePicture, user?.name)}
          alt={user?.name}
        />
        <input
          type="text"
          placeholder={
            replyingTo
              ? `Reply to ${replyingTo.user.name}...`
              : "Write a comment..."
          }
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit">
          <Send size={15} />
        </button>
      </form>
    </div>
  );
}
