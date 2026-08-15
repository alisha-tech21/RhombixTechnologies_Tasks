import { useState, useRef, useEffect } from "react";
import { Image as ImageIcon, Video, X } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { getAvatarUrl } from "../../utils/avatar";
import "../../styles/posts.css";

export default function CreatePostModal({ onClose, onPostCreated }) {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [visibility, setVisibility] = useState("public");
  const [posting, setPosting] = useState(false);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-focus the textarea as soon as the modal opens
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

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

      const res = await api.post("/posts", formData);

      onPostCreated(res.data.post);
      toast.success("Post shared!");
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create post");
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Create Post</h3>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="create-post-top">
            <img
              className="create-post-avatar"
              src={getAvatarUrl(user?.profilePicture, user?.name)}
              alt={user?.name}
            />
            <div>
              <p style={{ fontWeight: 700, fontSize: 14, margin: 0 }}>
                {user?.name}
              </p>
              <select
                className="modal-visibility-select"
                value={visibility}
                onChange={(e) => setVisibility(e.target.value)}
              >
                <option value="public">🌐 Public</option>
                <option value="friends">👥 Friends</option>
                <option value="private">🔒 Only me</option>
              </select>
            </div>
          </div>

          <textarea
            ref={textareaRef}
            className="modal-textarea"
            placeholder={`What's on your mind, ${user?.name?.split(" ")[0]}?`}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

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

          <div className="modal-add-media">
            <span>Add to your post</span>
            <div className="modal-media-icons">
              <button
                onClick={() => fileInputRef.current?.click()}
                title="Add photo"
              >
                <ImageIcon size={20} />
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                title="Add video"
              >
                <Video size={20} />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*,video/*"
                multiple
                hidden
                onChange={handleFileSelect}
              />
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button
            className="post-submit-btn full-width"
            onClick={handlePost}
            disabled={posting}
          >
            {posting ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
}
