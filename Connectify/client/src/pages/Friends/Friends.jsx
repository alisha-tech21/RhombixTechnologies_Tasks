import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  UserMinus,
  MessageCircle,
  UserPlus,
  Check,
  X,
  XCircle,
  Send,
} from "lucide-react";
import toast from "react-hot-toast";
import MainLayout from "../../components/layout/MainLayout";
import api from "../../services/api";
import socket from "../../services/socket";
import { getAvatarUrl } from "../../utils/avatar";
import "../../styles/friends.css";

const TABS = [
  { key: "friends", label: "My Friends" },
  { key: "suggestions", label: "Suggestions" },
  { key: "received", label: "Received" },
  { key: "sent", label: "Sent" },
];

export default function Friends() {
  const [tab, setTab] = useState("friends");
  const [friends, setFriends] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);
  const [sentTo, setSentTo] = useState(new Set());
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadAll();

    const handleNewRequest = (req) => {
      if (req.sender) setReceived((prev) => [req, ...prev]);
      window.dispatchEvent(new Event("friend-request-count-changed"));
    };
    socket.on("friend_request", handleNewRequest);
    return () => socket.off("friend_request", handleNewRequest);
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [friendsRes, receivedRes, sentRes] = await Promise.all([
        api.get("/friends"),
        api.get("/friends/requests/received"),
        api.get("/friends/requests/sent"),
      ]);
      setFriends(friendsRes.data.friends);
      setReceived(receivedRes.data.requests);
      setSent(sentRes.data.requests);
    } finally {
      setLoading(false);
    }
  };

  const loadSuggestions = async () => {
    setLoading(true);
    try {
      const res = await api.get("/friends/suggestions");
      setSuggestions(res.data.suggestions);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tab === "suggestions" && suggestions.length === 0) {
      loadSuggestions();
    }
  }, [tab]);

  const removeFriend = async (id, name) => {
    if (!confirm(`Remove ${name} from your friends?`)) return;
    try {
      await api.delete(`/friends/${id}`);
      setFriends((prev) => prev.filter((f) => f._id !== id));
      toast.success("Friend removed");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  const sendRequest = async (id) => {
    try {
      await api.post(`/friends/request/${id}`);
      setSentTo((prev) => new Set(prev).add(id));
      toast.success("Friend request sent");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not send request");
    }
  };

  const acceptRequest = async (id) => {
    try {
      await api.put(`/friends/accept/${id}`);
      setReceived((prev) => prev.filter((r) => r._id !== id));
      window.dispatchEvent(new Event("friend-request-count-changed"));
      toast.success("Friend request accepted");
      loadAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  const rejectRequest = async (id) => {
    try {
      await api.put(`/friends/reject/${id}`);
      setReceived((prev) => prev.filter((r) => r._id !== id));
      window.dispatchEvent(new Event("friend-request-count-changed"));
      toast.success("Request declined");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  const cancelRequest = async (id) => {
    try {
      await api.delete(`/friends/cancel/${id}`);
      setSent((prev) => prev.filter((r) => r._id !== id));
      toast.success("Request cancelled");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  const peopleList =
    tab === "friends" ? friends : tab === "suggestions" ? suggestions : [];
  const filteredPeople = peopleList.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <MainLayout hideRightSidebar>
      <div className="friends-header">
        <h2>Friends</h2>
      </div>

      <div className="requests-tabs">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={tab === t.key ? "active" : ""}
            onClick={() => setTab(t.key)}
          >
            {t.label}
            {t.key === "friends" && friends.length > 0 && (
              <span className="tab-badge">{friends.length}</span>
            )}
            {t.key === "received" && received.length > 0 && (
              <span className="tab-badge">{received.length}</span>
            )}
            {t.key === "sent" && sent.length > 0 && (
              <span className="tab-badge">{sent.length}</span>
            )}
          </button>
        ))}
      </div>

      {(tab === "friends" || tab === "suggestions") && (
        <div className="friends-search">
          <Search size={16} />
          <input
            type="text"
            placeholder={
              tab === "friends" ? "Search friends..." : "Search suggestions..."
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      )}

      {loading ? (
        <p className="friends-empty-state">Loading...</p>
      ) : (
        <>
          {(tab === "friends" || tab === "suggestions") &&
            (filteredPeople.length === 0 ? (
              <p className="friends-empty-state">
                {tab === "friends"
                  ? search
                    ? "No friends match your search."
                    : "You haven't added any friends yet."
                  : "No suggestions right now — check back later!"}
              </p>
            ) : (
              <div className="friends-grid">
                {filteredPeople.map((person) => (
                  <div className="friend-card" key={person._id}>
                    <img
                      className="friend-card-avatar"
                      src={getAvatarUrl(person.profilePicture, person.name)}
                      alt={person.name}
                      onClick={() => navigate(`/profile/${person._id}`)}
                    />
                    <p
                      className="friend-card-name"
                      onClick={() => navigate(`/profile/${person._id}`)}
                    >
                      {person.name}
                    </p>
                    {tab === "suggestions" && person.professionalTitle && (
                      <p className="friend-card-title">
                        {person.professionalTitle}
                      </p>
                    )}
                    {tab === "suggestions" && person.mutualFriendsCount > 0 && (
                      <p className="friend-card-mutual">
                        {person.mutualFriendsCount} mutual friends
                      </p>
                    )}
                    {tab === "friends" && person.bio && (
                      <p className="friend-card-bio">{person.bio}</p>
                    )}

                    <div className="friend-card-actions">
                      {tab === "friends" ? (
                        <>
                          <button
                            className="btn-secondary"
                            onClick={() => navigate(`/profile/${person._id}`)}
                          >
                            <MessageCircle size={14} /> View
                          </button>
                          <button
                            className="btn-secondary"
                            onClick={() =>
                              navigate(`/messages?user=${person._id}`)
                            }
                          >
                            <Send size={14} /> Message
                          </button>
                          <button
                            className="btn-icon-danger"
                            onClick={() =>
                              removeFriend(person._id, person.name)
                            }
                            title="Remove friend"
                          >
                            <UserMinus size={15} />
                          </button>
                        </>
                      ) : (
                        <button
                          className="btn-add-friend-full"
                          onClick={() => sendRequest(person._id)}
                          disabled={sentTo.has(person._id)}
                        >
                          <UserPlus size={14} />{" "}
                          {sentTo.has(person._id)
                            ? "Request Sent"
                            : "Add Friend"}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}

          {tab === "received" &&
            (received.length === 0 ? (
              <p className="friends-empty-state">No pending friend requests.</p>
            ) : (
              <div className="request-list">
                {received
                  .filter((r) => r.sender)
                  .map((req) => (
                    <div className="request-row" key={req._id}>
                      <img
                        className="friend-card-avatar sm"
                        src={getAvatarUrl(
                          req.sender.profilePicture,
                          req.sender.name,
                        )}
                        alt={req.sender.name}
                        onClick={() => navigate(`/profile/${req.sender._id}`)}
                      />
                      <div
                        className="request-row-info"
                        onClick={() => navigate(`/profile/${req.sender._id}`)}
                      >
                        <p>{req.sender.name}</p>
                        <span>Wants to connect with you</span>
                      </div>
                      <div className="request-row-actions">
                        <button
                          className="btn-accept-full"
                          onClick={() => acceptRequest(req._id)}
                        >
                          <Check size={15} /> Accept
                        </button>
                        <button
                          className="btn-decline-full"
                          onClick={() => rejectRequest(req._id)}
                        >
                          <X size={15} /> Decline
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            ))}

          {tab === "sent" &&
            (sent.length === 0 ? (
              <p className="friends-empty-state">
                You haven't sent any friend requests.
              </p>
            ) : (
              <div className="request-list">
                {sent
                  .filter((r) => r.receiver)
                  .map((req) => (
                    <div className="request-row" key={req._id}>
                      <img
                        className="friend-card-avatar sm"
                        src={getAvatarUrl(
                          req.receiver.profilePicture,
                          req.receiver.name,
                        )}
                        alt={req.receiver.name}
                        onClick={() => navigate(`/profile/${req.receiver._id}`)}
                      />
                      <div
                        className="request-row-info"
                        onClick={() => navigate(`/profile/${req.receiver._id}`)}
                      >
                        <p>{req.receiver.name}</p>
                        <span>Request pending</span>
                      </div>
                      <div className="request-row-actions">
                        <button
                          className="btn-decline-full"
                          onClick={() => cancelRequest(req._id)}
                        >
                          <XCircle size={15} /> Cancel
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            ))}
        </>
      )}
    </MainLayout>
  );
}
