import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  UserPlus,
  Bookmark,
  Settings,
  Compass,
  User,
  MessageCircle,
  MapPin,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import toast from "react-hot-toast";
import socket from "../../services/socket";
import "../../styles/layout.css";
import { getAvatarUrl } from "../../utils/avatar";

export default function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();
  const [requestCount, setRequestCount] = useState(0);

  useEffect(() => {
    const fetchCount = () => {
      api
        .get("/friends/requests/received")
        .then((res) => setRequestCount(res.data.requests.length))
        .catch(() => {});
    };

    fetchCount();

    const handleNewRequest = () => setRequestCount((prev) => prev + 1);
    socket.on("friend_request", handleNewRequest);
    window.addEventListener("friend-request-count-changed", fetchCount);

    return () => {
      socket.off("friend_request", handleNewRequest);
      window.removeEventListener("friend-request-count-changed", fetchCount);
    };
  }, []);
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    const fetchUnreadMessages = () => {
      api.get("/messages/conversations").then((res) => {
        const total = res.data.conversations.reduce(
          (sum, c) => sum + c.unreadCount,
          0,
        );
        setUnreadMessages(total);
      });
    };

    fetchUnreadMessages();

    const handleNewMessage = (data) => {
      setUnreadMessages((prev) => prev + 1);
      if (data.message.sender._id !== user?._id) {
        toast(`💬 ${data.message.sender.name}: ${data.message.text}`, {
          duration: 4000,
        });
      }
    };

    socket.on("new_message", handleNewMessage);
    window.addEventListener("messages-count-refresh", fetchUnreadMessages);

    return () => {
      socket.off("new_message", handleNewMessage);
      window.removeEventListener("messages-count-refresh", fetchUnreadMessages);
    };
  }, [user?._id]);

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: User, label: "Profile", path: `/profile/${user?._id}` },
    { icon: Compass, label: "Explore", path: "/explore" },
    { icon: Users, label: "Friends", path: "/friends", badge: requestCount },
    {
      icon: MessageCircle,
      label: "Messages",
      path: "/messages",
      badge: unreadMessages,
    },
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
        {navItems.map(({ icon: Icon, label, path, badge }) => (
          <Link
            key={path}
            to={path}
            className={`sidebar-link ${location.pathname === path ? "active" : ""}`}
          >
            <Icon size={18} />
            <span>{label}</span>
            {badge > 0 && <span className="sidebar-badge">{badge}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
