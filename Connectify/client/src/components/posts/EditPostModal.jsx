import { useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";
import { getAvatarUrl } from "../../utils/avatar";

export default function EditPostModal({ post, onClose, onSaved }) {
  const [text, setText] = useState(post.text || "");
  const [visibility, setVisibility] = useState(post.visibility);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.put(`/posts/${post._id}`, { text, visibility });
      onSaved(res.data.post);
      toast.success("Post updated");
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update post");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Edit Post</h3>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="create-post-top">
            <img
              className="create-post-avatar"
              src={getAvatarUrl(post.user.profilePicture, post.user.name)}
              alt={post.user.name}
            />
            <div>
              <p style={{ fontWeight: 700, fontSize: 14, margin: 0 }}>
                {post.user.name}
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
            className="modal-textarea"
            value={text}
            onChange={(e) => setText(e.target.value)}
            autoFocus
          />

          {post.media?.length > 0 && (
            <div className="edit-media-preview">
              {post.media.map((m, i) =>
                m.type === "video" ? (
                  <video
                    key={i}
                    src={`${import.meta.env.VITE_SOCKET_URL}${m.url}`}
                    muted
                  />
                ) : (
                  <img
                    key={i}
                    src={`${import.meta.env.VITE_SOCKET_URL}${m.url}`}
                    alt=""
                  />
                ),
              )}
              <p className="edit-media-note">
                Media cannot be changed after posting — delete and repost to
                change it
              </p>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <div style={{ display: "flex", gap: 10 }}>
            <button
              className="btn-cancel"
              style={{ flex: 1 }}
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              className="post-submit-btn"
              style={{ flex: 1 }}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
