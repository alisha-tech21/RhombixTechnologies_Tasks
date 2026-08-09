import { Link, useNavigate } from "react-router-dom";
import { Search, Bell, Plus, LogOut, Link2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getAvatarUrl } from "../../utils/avatar";
import "../../styles/layout.css";

export default function Topbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
          >
            <Bell size={18} />
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
