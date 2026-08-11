import { useState, useEffect } from "react";
import MainLayout from "../../components/layout/MainLayout";
import PostCard from "../../components/posts/PostCard";
import api from "../../services/api";

export default function SavedPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/posts/saved/all")
      .then((res) => setPosts(res.data.posts))
      .finally(() => setLoading(false));
  }, []);

  const handlePostRemoved = (postId) => {
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
          Saved Posts
        </h2>
        <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
          Posts you've bookmarked to revisit later
        </p>
      </div>

      {loading ? (
        <p style={{ textAlign: "center", color: "#94a3b8", marginTop: 40 }}>
          Loading saved posts...
        </p>
      ) : posts.length === 0 ? (
        <p style={{ textAlign: "center", color: "#94a3b8", marginTop: 40 }}>
          You haven't saved any posts yet. Use the "Save post" option on any
          post to bookmark it here.
        </p>
      ) : (
        posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            onDeleted={handlePostRemoved}
            onUnsaved={handlePostRemoved}
          />
        ))
      )}
    </MainLayout>
  );
}
