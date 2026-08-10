import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, MessageCircle, UserPlus, UserCheck } from "lucide-react";
import toast from "react-hot-toast";
import MainLayout from "../../components/layout/MainLayout";
import api from "../../services/api";
import socket from "../../services/socket";
import { getAvatarUrl } from "../../utils/avatar";
import "../../styles/notifications.css";

const TABS = [
  { key: "all", label: "All" },
  { key: "like", label: "Likes" },
  { key: "comment", label: "Comments" },
  { key: "friend", label: "Friend Requests" },
];

function groupByDay(notifications) {
  const groups = { Today: [], Yesterday: [], Older: [] };
  const now = new Date();
  const todayStr = now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const yesterdayStr = yesterday.toDateString();

  notifications.forEach((n) => {
    const d = new Date(n.createdAt).toDateString();
    if (d === todayStr) groups.Today.push(n);
    else if (d === yesterdayStr) groups.Yesterday.push(n);
    else groups.Older.push(n);
  });

  return groups;
}

function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  const units = [
    ["h", 3600],
    ["m", 60],
  ];
  for (const [label, secs] of units) {
    const val = Math.floor(seconds / secs);
    if (val >= 1) return `${val}${label} ago`;
  }
  return "Just now";
}

const iconFor = (type) => {
  switch (type) {
    case "like":
      return <Heart size={14} fill="#e11d48" color="#e11d48" />;
    case "comment":
      return <MessageCircle size={14} color="#4338ca" />;
    case "friend_request":
      return <UserPlus size={14} color="#7c3aed" />;
    case "friend_accept":
      return <UserCheck size={14} color="#10b981" />;
    default:
      return null;
  }
};

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");
  const [visibleCount, setVisibleCount] = useState(15);
  const navigate = useNavigate();

  useEffect(() => {
    loadNotifications();

    const handleNewNotification = (notif) => {
      setNotifications((prev) => [notif, ...prev]);
    };
    socket.on("notification", handleNewNotification);
    return () => socket.off("notification", handleNewNotification);
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data.notifications);
    } finally {
      setLoading(false);
    }
  };

  const markAllRead = async () => {
    await api.put("/notifications/read-all");
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClick = async (notif) => {
    if (!notif.read) {
      api.put(`/notifications/${notif._id}/read`).catch(() => {});
      setNotifications((prev) =>
        prev.map((n) => (n._id === notif._id ? { ...n, read: true } : n)),
      );
    }

    if (notif.type === "friend_request" || notif.type === "friend_accept") {
      navigate(`/profile/${notif.sender._id}`);
    } else if (notif.post) {
      navigate(`/post/${notif.post}`);
    }
  };

  const acceptRequest = async (e, notif) => {
    e.stopPropagation();
    try {
      await api.put(`/friends/accept/${notif.friendRequest}`);
      setNotifications((prev) => prev.filter((n) => n._id !== notif._id));
      window.dispatchEvent(new Event("friend-request-count-changed"));
      toast.success("Friend request accepted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not accept request");
    }
  };

  const declineRequest = async (e, notif) => {
    e.stopPropagation();
    try {
      await api.put(`/friends/reject/${notif.friendRequest}`);
      setNotifications((prev) => prev.filter((n) => n._id !== notif._id));
      window.dispatchEvent(new Event("friend-request-count-changed"));
      toast.success("Request declined");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  const filtered = notifications.filter((n) => {
    if (tab === "all") return true;
    if (tab === "friend")
      return n.type === "friend_request" || n.type === "friend_accept";
    return n.type === tab;
  });

  const visible = filtered.slice(0, visibleCount);
  const groups = groupByDay(visible);
  const hasMore = filtered.length > visibleCount;

  return (
    <MainLayout>
      <div className="notif-page">
        <div className="notif-page-header">
          <h2>Notifications</h2>
          <button className="notif-mark-all" onClick={markAllRead}>
            Mark all as read
          </button>
        </div>

        <div className="notif-tabs">
          {TABS.map((t) => (
            <button
              key={t.key}
              className={tab === t.key ? "active" : ""}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="notif-card">
          {loading ? (
            <p className="friends-empty-state">Loading notifications...</p>
          ) : filtered.length === 0 ? (
            <p className="friends-empty-state">No notifications here yet.</p>
          ) : (
            Object.entries(groups).map(
              ([label, items]) =>
                items.length > 0 && (
                  <div key={label}>
                    <div className="notif-day-label">{label}</div>
                    {items.map((notif) => (
                      <div
                        key={notif._id}
                        className={`notif-row ${!notif.read ? "unread" : ""}`}
                        onClick={() => handleClick(notif)}
                      >
                        <div className="notif-avatar-wrap">
                          <img
                            src={getAvatarUrl(
                              notif.sender?.profilePicture,
                              notif.sender?.name,
                            )}
                            alt=""
                          />
                          <span className="notif-type-badge">
                            {iconFor(notif.type)}
                          </span>
                        </div>

                        <div className="notif-row-body">
                          <p>
                            <strong>{notif.sender?.name}</strong>{" "}
                            {notif.message.startsWith(notif.sender?.name)
                              ? notif.message
                                  .slice(notif.sender?.name.length)
                                  .trim()
                              : notif.message}
                          </p>

                          {notif.type === "friend_request" &&
                            notif.friendRequest && (
                              <div className="notif-inline-actions">
                                <button
                                  className="btn-accept-full"
                                  onClick={(e) => acceptRequest(e, notif)}
                                >
                                  Accept
                                </button>
                                <button
                                  className="btn-decline-full"
                                  onClick={(e) => declineRequest(e, notif)}
                                >
                                  Decline
                                </button>
                              </div>
                            )}
                        </div>

                        <div className="notif-row-time">
                          {timeAgo(notif.createdAt)}
                          {!notif.read && <span className="notif-unread-dot" />}
                        </div>
                      </div>
                    ))}
                  </div>
                ),
            )
          )}

          {hasMore && (
            <button
              className="notif-load-more"
              onClick={() => setVisibleCount((v) => v + 15)}
            >
              View older notifications
            </button>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
