import { useState, useRef, useEffect } from "react";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Bookmark,
  BookmarkCheck,
  Link2,
  Download,
  Flag,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function PostMenu({
  post,
  isOwner,
  onEdit,
  onDeleted,
  onUnsaved,
}) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(
    user?.savedPosts?.includes(post._id) || false,
  );
  const menuRef = useRef(null);

  // Close the dropdown when clicking anywhere outside it
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDelete = async () => {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    try {
      await api.delete(`/posts/${post._id}`);
      onDeleted(post._id);
      toast.success("Post deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete post");
    }
    setOpen(false);
  };

  const handleSaveToggle = async () => {
    try {
      const res = await api.put(`/posts/${post._id}/save`);
      setSaved(res.data.saved);
      toast.success(res.data.saved ? "Post saved" : "Removed from saved");
      if (!res.data.saved && onUnsaved) {
        onUnsaved(post._id);
      }
    } catch {
      toast.error("Something went wrong");
    }
    setOpen(false);
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/post/${post._id}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard");
    setOpen(false);
  };

  const handleDownload = () => {
    if (!post.media?.length) {
      toast.error("This post has no media to download");
      return;
    }
    post.media.forEach((m, i) => {
      const link = document.createElement("a");
      link.href = `${import.meta.env.VITE_SOCKET_URL}${m.url}`;
      link.download = `connectify-post-${post._id}-${i}`;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
    setOpen(false);
  };

  const handleReport = () => {
    toast.success("Post reported. Our team will review it.");
    setOpen(false);
  };

  return (
    <div className="post-menu-wrap" ref={menuRef}>
      <button className="post-menu-btn" onClick={() => setOpen((v) => !v)}>
        <MoreHorizontal size={18} />
      </button>

      {open && (
        <div className="post-menu-dropdown">
          {isOwner ? (
            <>
              <button
                onClick={() => {
                  onEdit();
                  setOpen(false);
                }}
              >
                <Pencil size={14} /> Edit post
              </button>
              <button className="danger" onClick={handleDelete}>
                <Trash2 size={14} /> Delete post
              </button>
              <div className="menu-divider" />
              <button onClick={handleCopyLink}>
                <Link2 size={14} /> Copy link
              </button>
              {post.media?.length > 0 && (
                <button onClick={handleDownload}>
                  <Download size={14} /> Download media
                </button>
              )}
            </>
          ) : (
            <>
              <button onClick={handleSaveToggle}>
                {saved ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
                {saved ? "Remove from saved" : "Save post"}
              </button>
              <button onClick={handleCopyLink}>
                <Link2 size={14} /> Copy link
              </button>
              {post.media?.length > 0 && (
                <button onClick={handleDownload}>
                  <Download size={14} /> Download media
                </button>
              )}
              <div className="menu-divider" />
              <button className="danger" onClick={handleReport}>
                <Flag size={14} /> Report post
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
