import { Link, useNavigate } from "react-router-dom";
import { Search, Bell, Plus, LogOut, Link2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import api from "../../services/api";
import socket from "../../services/socket";
import { getAvatarUrl } from "../../utils/avatar";
import "../../styles/layout.css";

export default function Topbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    api.get("/notifications").then((res) => {
      setUnreadCount(res.data.notifications.filter((n) => !n.read).length);
    });

    const handleNew = () => setUnreadCount((prev) => prev + 1);
    socket.on("notification", handleNew);
    return () => socket.off("notification", handleNew);
  }, []);

  return (
    <header className="app-topbar">
      <div className="app-topbar-inner">
        <Link to="/" className="topbar-logo">
          <span className="topbar-logo-mark">
            <Link2 size={16} />
          </span>
          Connectify
        </Link>

        <div className="topbar-search">
          <Search size={16} />
          <input type="text" placeholder="Search Connectify..." />
        </div>

        <div className="topbar-actions">
          <button
            className="topbar-icon-btn"
            title="Notifications"
            onClick={() => navigate("/notifications")}
            style={{ position: "relative" }}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span
                className="sidebar-badge"
                style={{ position: "absolute", top: -4, right: -4 }}
              >
                {unreadCount}
              </span>
            )}
          </button>
          <button
            className="topbar-icon-btn logout"
            title="Log out"
            onClick={logout}
          >
            <LogOut size={18} />
          </button>
          <img
            className="topbar-avatar"
            src={getAvatarUrl(user?.profilePicture, user?.name)}
            alt={user?.name}
            onClick={() => navigate(`/profile/${user?._id}`)}
          />
        </div>
      </div>
    </header>
  );
}
