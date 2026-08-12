import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, MessageCircle, Play, Bookmark } from "lucide-react";
import toast from "react-hot-toast";
import MainLayout from "../../components/layout/MainLayout";
import api from "../../services/api";
import { getAvatarUrl } from "../../utils/avatar";
import "../../styles/explore.css";

export default function SavedPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/posts/saved/all")
      .then((res) => setPosts(res.data.posts))
      .finally(() => setLoading(false));
  }, []);

  const handleUnsave = async (e, postId) => {
    e.stopPropagation();
    try {
      await api.put(`/posts/${postId}/save`);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
      toast.success("Removed from saved");
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <MainLayout hideRightSidebar>
      <div className="explore-header">
        <h2>Saved Posts</h2>
        <p>Posts you've bookmarked to revisit later</p>
      </div>

      {loading ? (
        <p style={{ textAlign: "center", color: "#94a3b8", marginTop: 40 }}>
          Loading...
        </p>
      ) : posts.length === 0 ? (
        <p style={{ textAlign: "center", color: "#94a3b8", marginTop: 40 }}>
          You haven't saved any posts yet.
        </p>
      ) : (
        <div className="saved-grid">
          {posts.map((post) => (
            <div
              className="saved-card"
              key={post._id}
              onClick={() => navigate(`/post/${post._id}`)}
            >
              {post.media?.length > 0 ? (
                post.media[0].type === "video" ? (
                  <div className="saved-card-media">
                    <video
                      src={`${import.meta.env.VITE_SOCKET_URL}${post.media[0].url}`}
                      muted
                    />
                    <span className="explore-video-badge">
                      <Play size={14} fill="#fff" />
                    </span>
                  </div>
                ) : (
                  <div className="saved-card-media">
                    <img
                      src={`${import.meta.env.VITE_SOCKET_URL}${post.media[0].url}`}
                      alt=""
                    />
                  </div>
                )
              ) : (
                <div className="saved-card-text-preview">{post.text}</div>
              )}

              <div className="saved-card-body">
                <div className="saved-card-author">
                  <img
                    src={getAvatarUrl(post.user.profilePicture, post.user.name)}
                    alt={post.user.name}
                  />
                  <span>{post.user.name}</span>
                </div>
                {post.text && post.media?.length > 0 && (
                  <p className="saved-card-text">{post.text}</p>
                )}

                <div className="saved-card-footer">
                  <span>
                    <Heart size={13} /> {post.likes.length}
                  </span>
                  <span>
                    <MessageCircle size={13} /> {post.commentsCount || 0}
                  </span>
                  <button
                    className="saved-card-unsave"
                    onClick={(e) => handleUnsave(e, post._id)}
                    title="Remove from saved"
                  >
                    <Bookmark size={15} fill="#4338ca" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </MainLayout>
  );
}
