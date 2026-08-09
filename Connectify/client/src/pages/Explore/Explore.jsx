import { useState, useEffect } from "react";
import MainLayout from "../../components/layout/MainLayout";
import PostCard from "../posts/PostCard";
import api from "../../services/api";

export default function Explore() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/posts/explore")
      .then((res) => setPosts(res.data.posts))
      .finally(() => setLoading(false));
  }, []);

  const handlePostDeleted = (postId) => {
    setPosts((prev) => prev.filter((p) => p._id !== postId));
  };

  return (
    <MainLayout>
      <div style={{ marginBottom: 16 }}>
        <h2
          style={{
            fontFamily: "Sora, sans-serif",
            fontSize: 20,
            color: "#0f172a",
            margin: "0 0 4px",
          }}
        >
          Explore
        </h2>
        <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
          Discover public posts from the Connectify community
        </p>
      </div>

      {loading ? (
        <p style={{ textAlign: "center", color: "#94a3b8", marginTop: 40 }}>
          Loading...
        </p>
      ) : posts.length === 0 ? (
        <p style={{ textAlign: "center", color: "#94a3b8", marginTop: 40 }}>
          No public posts to explore yet. Be the first!
        </p>
      ) : (
        posts.map((post) => (
          <PostCard key={post._id} post={post} onDeleted={handlePostDeleted} />
        ))
      )}
    </MainLayout>
  );
}
