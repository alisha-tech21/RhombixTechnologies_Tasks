import { useState, useEffect } from "react";
import { Send } from "lucide-react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import socket from "../../services/socket";
import { getAvatarUrl } from "../../utils/avatar";
import "../../styles/posts.css";

const INITIAL_VISIBLE = 3;

export default function CommentSection({ postId, onCommentAdded }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  useEffect(() => {
    api
      .get(`/comments/${postId}`)
      .then((res) => setComments(res.data.comments))
      .finally(() => setLoading(false));

    const handleNewComment = (data) => {
      if (data.postId === postId) {
        setComments((prev) => [...prev, data.comment]);
      }
    };
    socket.on("new_comment", handleNewComment);
    return () => socket.off("new_comment", handleNewComment);
  }, [postId]);

  const submitComment = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const currentText = text;
    setText("");
    try {
      await api.post(`/comments/${postId}`, { text: currentText });
      onCommentAdded();
    } catch {
      setText(currentText);
    }
  };

  // Show the most recent comments first, but reveal older ones on "see more"
  const reversedComments = [...comments].reverse();
  const visibleComments = reversedComments.slice(0, visibleCount);
  const remaining = comments.length - visibleCount;

  return (
    <div className="comment-section">
      {loading ? (
        <p className="comment-loading">Loading comments...</p>
      ) : (
        <>
          {visibleComments
            .filter((c) => c.user)
            .map((c) => (
              <div className="comment-item" key={c._id}>
                <img
                  src={getAvatarUrl(c.user.profilePicture, c.user.name)}
                  alt={c.user.name}
                />
                <div className="comment-bubble">
                  <p className="comment-author">{c.user.name}</p>
                  <p className="comment-text">{c.text}</p>
                </div>
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

      <form className="comment-form" onSubmit={submitComment}>
        <img
          src={getAvatarUrl(user?.profilePicture, user?.name)}
          alt={user?.name}
        />
        <input
          type="text"
          placeholder="Write a comment..."
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
