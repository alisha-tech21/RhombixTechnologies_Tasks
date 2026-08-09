import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  UserPlus,
  Bookmark,
  Settings,
  Compass,
  User,
  MapPin,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getAvatarUrl } from "../../utils/avatar";
import "../../styles/layout.css";

export default function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: User, label: "Profile", path: `/profile/${user?._id}` },
    { icon: Compass, label: "Explore", path: "/explore" },
    { icon: Users, label: "Friends", path: "/friends" },
    { icon: UserPlus, label: "Friend Requests", path: "/friends/requests" },
    { icon: Bookmark, label: "Saved Posts", path: "/saved" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <aside className="app-sidebar">
      <div className="sidebar-profile-card">
        {/* Cover */}
        <div className="sidebar-cover">
          {user?.coverPhoto ? (
            <img
              src={`${import.meta.env.VITE_SOCKET_URL}${user.coverPhoto}`}
              alt="Cover"
            />
          ) : (
            <div className="sidebar-cover-placeholder"></div>
          )}
        </div>

        {/* Profile Picture */}
        <Link to={`/profile/${user?._id}`} className="sidebar-avatar-wrap">
          <img
            className="sidebar-avatar"
            src={getAvatarUrl(user?.profilePicture, user?.name)}
            alt={user?.name}
          />
        </Link>

        {/* User Info */}
        <div className="sidebar-user-info">
          <Link to={`/profile/${user?._id}`} className="sidebar-name">
            {user?.name}
          </Link>

          <p className="sidebar-title">
            {user?.professionalTitle ||
              user?.bio ||
              "Aspiring Full Stack Developer"}
          </p>

          {user?.location && (
            <div className="sidebar-location">
              <MapPin size={13} />
              <span>{user.location}</span>
            </div>
          )}

          <Link to={`/profile/${user?._id}`} className="sidebar-view-profile">
            View Profile
          </Link>
        </div>
      </div>

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
