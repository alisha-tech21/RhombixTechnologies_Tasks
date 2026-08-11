import { useState, useRef, useEffect } from "react";
import { MoreHorizontal, Link2, Flag, EyeOff, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";

export default function CommentMenu({
  comment,
  isOwner,
  isPostOwner,
  onDeleted,
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

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
    if (
      !confirm("Delete this comment? Any replies to it will also be removed.")
    )
      return;
    try {
      await api.delete(`/comments/${comment._id}`);
      onDeleted(comment._id);
      toast.success("Comment deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete comment");
    }
    setOpen(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}${window.location.pathname}#comment-${comment._id}`,
    );
    toast.success("Comment link copied");
    setOpen(false);
  };

  const handleReport = () => {
    toast.success("Comment reported. Our team will review it.");
    setOpen(false);
  };

  const handleHide = () => {
    toast.success("You won't see comments like this as often");
    setOpen(false);
  };

  // Can delete if: it's my own comment, OR I own the post this comment is on
  const canDelete = isOwner || isPostOwner;

  return (
    <div className="comment-menu-wrap" ref={menuRef}>
      <button className="comment-menu-btn" onClick={() => setOpen((v) => !v)}>
        <MoreHorizontal size={15} />
      </button>

      {open && (
        <div className="comment-menu-dropdown">
          <button onClick={handleCopyLink}>
            <Link2 size={14} /> Copy link to comment
          </button>

          {!isOwner && (
            <button onClick={handleReport}>
              <Flag size={14} /> Report comment
            </button>
          )}

          <button onClick={handleHide}>
            <EyeOff size={14} /> I don't want to see this
          </button>

          {canDelete && (
            <button className="danger" onClick={handleDelete}>
              <Trash2 size={14} /> Delete comment
            </button>
          )}
        </div>
      )}
    </div>
  );
}
