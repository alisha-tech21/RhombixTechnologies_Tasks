import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, MessageCircle, Share2 } from "lucide-react";
import MainLayout from "../../components/layout/MainLayout";
import CommentSection from "./CommentSection";
import PostMenu from "./PostMenu";
import EditPostModal from "./EditPostModal";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { getAvatarUrl } from "../../utils/avatar";
import "../../styles/posts.css";

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

export default function PostDetail() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    api
      .get(`/posts/${postId}`)
      .then((res) => {
        setPost(res.data.post);
        setLikes(res.data.post.likes || []);
      })
      .catch(() => setPost(null))
      .finally(() => setLoading(false));
  }, [postId]);

  const toggleLike = async () => {
    const res = await api.put(`/posts/${postId}/like`);
    setLikes(
      res.data.liked
        ? [...likes, user._id]
        : likes.filter((id) => id !== user._id),
    );
  };

  const liked = likes.includes(user?._id);
  const isOwner = post?.user._id === user?._id;

  if (loading) {
    return (
      <MainLayout>
        <p style={{ textAlign: "center", color: "#94a3b8", marginTop: 40 }}>
          Loading post...
        </p>
      </MainLayout>
    );
  }

  if (!post) {
    return (
      <MainLayout>
        <p style={{ textAlign: "center", color: "#94a3b8", marginTop: 40 }}>
          This post is unavailable or you don't have permission to view it.
        </p>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <button className="back-to-feed-btn" onClick={() => navigate(-1)}>
        <ArrowLeft size={16} /> Back to Feed
      </button>

      <div className="post-card">
        <div className="post-header">
          <img
            className="post-avatar"
            src={getAvatarUrl(post.user.profilePicture, post.user.name)}
            alt={post.user.name}
          />
          <div className="post-header-info">
            <p className="post-author">{post.user.name}</p>
            <p className="post-time">{timeAgo(post.createdAt)}</p>
          </div>
          <PostMenu
            post={post}
            isOwner={isOwner}
            onEdit={() => setIsEditing(true)}
            onDeleted={() => navigate("/")}
          />
        </div>

        {post.text && <p className="post-text">{post.text}</p>}

        {post.media?.length > 0 && (
          <div
            className={`post-media-grid count-${Math.min(post.media.length, 4)}`}
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
        </div>

        <div className="post-actions">
          <button className={liked ? "active" : ""} onClick={toggleLike}>
            <Heart size={17} fill={liked ? "#e11d48" : "none"} />
            Like
          </button>
          <button>
            <MessageCircle size={17} />
            Comment
          </button>
          <button>
            <Share2 size={17} />
            Share
          </button>
        </div>

        <CommentSection postId={post._id} onCommentAdded={() => {}} />
      </div>

      {isEditing && (
        <EditPostModal
          post={post}
          onClose={() => setIsEditing(false)}
          onSaved={(updated) => setPost(updated)}
        />
      )}
    </MainLayout>
  );
}
