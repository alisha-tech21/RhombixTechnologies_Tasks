import { useState, useEffect } from "react";
import MainLayout from "../../components/layout/MainLayout";
import PostCard from "../../components/posts/PostCard";
import CreatePostBox from "../../components/posts/CreatePostBox";
import api from "../../services/api";
import socket from "../../services/socket";
import "../../styles/posts.css";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFeed = async () => {
    try {
      const res = await api.get("/posts/feed");
      setPosts(res.data.posts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeed();

    const handleNewPost = (post) => {
      setPosts((prev) => [post, ...prev]);
    };
    socket.on("new_post", handleNewPost);
    return () => socket.off("new_post", handleNewPost);
  }, []);

  const handlePostCreated = (post) => {
    setPosts((prev) => [post, ...prev]);
  };

  const handlePostDeleted = (postId) => {
    setPosts((prev) => prev.filter((p) => p._id !== postId));
  };

  return (
    <MainLayout>
      <CreatePostBox onPostCreated={handlePostCreated} />

      {loading ? (
        <p style={{ textAlign: "center", color: "#94a3b8", marginTop: 40 }}>
          Loading feed...
        </p>
      ) : posts.length === 0 ? (
        <p style={{ textAlign: "center", color: "#94a3b8", marginTop: 40 }}>
          No posts yet. Be the first to share something!
        </p>
      ) : (
        posts.map((post) => (
          <PostCard key={post._id} post={post} onDeleted={handlePostDeleted} />
        ))
      )}
    </MainLayout>
  );
}
