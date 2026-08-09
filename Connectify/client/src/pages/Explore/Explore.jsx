import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, MessageCircle, Play } from "lucide-react";
import MainLayout from "../../components/layout/MainLayout";
import api from "../../services/api";
import "../../styles/explore.css";

export default function Explore() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/posts/explore")
      .then((res) => setPosts(res.data.posts))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <p style={{ textAlign: "center", color: "#94a3b8", marginTop: 40 }}>
          Loading explore feed...
        </p>
      </MainLayout>
    );
  }

  if (posts.length === 0) {
    return (
      <MainLayout>
        <p style={{ textAlign: "center", color: "#94a3b8", marginTop: 40 }}>
          No public posts to explore yet. Be the first!
        </p>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="explore-header">
        <h2>Explore</h2>
        <p>Discover public posts from the Connectify community</p>
      </div>

      <div className="explore-grid">
        {posts.map((post) => (
          <div
            key={post._id}
            className={`explore-tile ${!post.media?.length ? "text-tile" : ""}`}
            onClick={() => navigate(`/post/${post._id}`)}
          >
            {post.media?.length > 0 ? (
              <>
                {post.media[0].type === "video" ? (
                  <>
                    <video
                      src={`${import.meta.env.VITE_SOCKET_URL}${post.media[0].url}`}
                      muted
                    />
                    <span className="explore-video-badge">
                      <Play size={14} fill="#fff" />
                    </span>
                  </>
                ) : (
                  <img
                    src={`${import.meta.env.VITE_SOCKET_URL}${post.media[0].url}`}
                    alt=""
                  />
                )}
                {post.media.length > 1 && (
                  <span className="explore-multi-badge">
                    +{post.media.length - 1}
                  </span>
                )}
              </>
            ) : (
              <p className="explore-text-preview">{post.text}</p>
            )}

            <div className="explore-tile-overlay">
              <span>
                <Heart size={16} fill="#fff" /> {post.likes.length}
              </span>
              <span>
                <MessageCircle size={16} fill="#fff" />{" "}
                {post.commentsCount || 0}
              </span>
            </div>
          </div>
        ))}
      </div>
    </MainLayout>
  );
}
