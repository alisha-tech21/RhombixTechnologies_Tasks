import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  UserPlus,
  Bookmark,
  Settings,
  Compass,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getAvatarUrl } from "../../utils/avatar";
import "../../styles/layout.css";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Compass, label: "Explore", path: "/explore" },
  { icon: Users, label: "Friends", path: "/friends" },
  { icon: UserPlus, label: "Friend Requests", path: "/friends/requests" },
  { icon: Bookmark, label: "Saved Posts", path: "/saved" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export default function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <aside className="app-sidebar">
      <Link to={`/profile/${user?._id}`} className="sidebar-profile">
        <img
          className="sidebar-avatar"
          src={getAvatarUrl(user?.profilePicture, user?.name)}
          alt={user?.name}
        />
        <div>
          <p className="sidebar-name">{user?.name}</p>
          <p className="sidebar-bio">{user?.bio || "No bio yet"}</p>
        </div>
      </Link>

      <nav className="sidebar-nav">
        {navItems.map(({ icon: Icon, label, path }) => (
          <Link
            key={path}
            to={path}
            className={`sidebar-link ${location.pathname === path ? "active" : ""}`}
          >
            <Icon size={18} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
