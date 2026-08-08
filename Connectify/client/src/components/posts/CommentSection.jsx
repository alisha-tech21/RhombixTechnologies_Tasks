import { useState, useEffect } from "react";
import { Send } from "lucide-react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import socket from "../../services/socket";
import "../../styles/posts.css";

const mediaUrl = (path) => `${import.meta.env.VITE_SOCKET_URL}${path}`;

export default function CommentSection({ postId, onCommentAdded }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="comment-section">
      {loading ? (
        <p className="comment-loading">Loading comments...</p>
      ) : (
        comments.map((c) => (
          <div className="comment-item" key={c._id}>
            <img
              src={
                c.user.profilePicture
                  ? mediaUrl(c.user.profilePicture)
                  : "/default-avatar.png"
              }
              alt={c.user.name}
            />
            <div className="comment-bubble">
              <p className="comment-author">{c.user.name}</p>
              <p className="comment-text">{c.text}</p>
            </div>
          </div>
        ))
      )}

      <form className="comment-form" onSubmit={submitComment}>
        <img
          src={
            user?.profilePicture
              ? mediaUrl(user.profilePicture)
              : "/default-avatar.png"
          }
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
