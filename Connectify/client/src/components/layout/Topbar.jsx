import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Bell, LogOut, Link2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getAvatarUrl } from "../../utils/avatar";
import api from "../../services/api";
import socket from "../../services/socket";
import "../../styles/layout.css";

export default function Topbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [searching, setSearching] = useState(false);
  const searchRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    api.get("/notifications").then((res) => {
      setUnreadCount(res.data.notifications.filter((n) => !n.read).length);
    });

    const handleNew = () => setUnreadCount((prev) => prev + 1);
    socket.on("notification", handleNew);
    return () => socket.off("notification", handleNew);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setShowResults(true);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!value.trim()) {
      setResults([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await api.get(
          `/users/search?q=${encodeURIComponent(value.trim())}`,
        );
        setResults(res.data.users);
      } finally {
        setSearching(false);
      }
    }, 350);
  };

  const goToProfile = (id) => {
    setShowResults(false);
    setQuery("");
    navigate(`/profile/${id}`);
  };

  return (
    <header className="app-topbar">
      <div className="app-topbar-inner">
        <Link to="/" className="topbar-logo">
          <span className="topbar-logo-mark">
            <Link2 size={16} />
          </span>
          Connectify
        </Link>

        <div className="topbar-search" ref={searchRef}>
          <Search size={16} />
          <input
            type="text"
            placeholder="Search Connectify..."
            value={query}
            onChange={handleSearchChange}
            onFocus={() => query && setShowResults(true)}
          />

          {showResults && query.trim() && (
            <div className="search-results-dropdown">
              {searching ? (
                <p className="search-empty">Searching...</p>
              ) : results.length === 0 ? (
                <p className="search-empty">No users found for "{query}"</p>
              ) : (
                results.map((u) => (
                  <div
                    key={u._id}
                    className="search-result-item"
                    onClick={() => goToProfile(u._id)}
                  >
                    <img
                      src={getAvatarUrl(u.profilePicture, u.name)}
                      alt={u.name}
                    />
                    <div>
                      <p>{u.name}</p>
                      <span>{u.professionalTitle || `@${u.username}`}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
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
