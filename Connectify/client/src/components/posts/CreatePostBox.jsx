import { useState, useRef } from "react";
import { Image as ImageIcon, Video, X } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import "../../styles/posts.css";

export default function CreatePostBox({ onPostCreated }) {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [visibility, setVisibility] = useState("public");
  const [posting, setPosting] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const selected = Array.from(e.target.files).slice(0, 5 - files.length);
    if (selected.length === 0) return;

    setFiles((prev) => [...prev, ...selected]);
    setPreviews((prev) => [
      ...prev,
      ...selected.map((f) => ({
        url: URL.createObjectURL(f),
        type: f.type.startsWith("video") ? "video" : "image",
      })),
    ]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePost = async () => {
    if (!text.trim() && files.length === 0) {
      toast.error("Write something or add media before posting");
      return;
    }

    setPosting(true);
    try {
      const formData = new FormData();
      formData.append("text", text);
      formData.append("visibility", visibility);
      files.forEach((f) => formData.append("media", f));

      const res = await api.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onPostCreated(res.data.post);
      setText("");
      setFiles([]);
      setPreviews([]);
      toast.success("Post shared!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create post");
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="create-post-box">
      <div className="create-post-top">
        <img
          className="create-post-avatar"
          src={
            user?.profilePicture
              ? `${import.meta.env.VITE_SOCKET_URL}${user.profilePicture}`
              : "/default-avatar.png"
          }
          alt={user?.name}
        />
        <textarea
          placeholder={`What's on your mind, ${user?.name?.split(" ")[0]}?`}
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={2}
        />
      </div>

      {previews.length > 0 && (
        <div className="create-post-previews">
          {previews.map((p, i) => (
            <div className="preview-item" key={i}>
              {p.type === "video" ? (
                <video src={p.url} muted />
              ) : (
                <img src={p.url} alt="preview" />
              )}
              <button onClick={() => removeFile(i)}>
                <X size={13} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="create-post-bottom">
        <div className="create-post-tools">
          <button onClick={() => fileInputRef.current?.click()}>
            <ImageIcon size={17} />
            Photo
          </button>
          <button onClick={() => fileInputRef.current?.click()}>
            <Video size={17} />
            Video
          </button>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*,video/*"
            multiple
            hidden
            onChange={handleFileSelect}
          />

          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
          >
            <option value="public">🌐 Public</option>
            <option value="friends">👥 Friends</option>
            <option value="private">🔒 Only me</option>
          </select>
        </div>

        <button
          className="post-submit-btn"
          onClick={handlePost}
          disabled={posting}
        >
          {posting ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
}
