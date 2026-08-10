import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, UserMinus, MessageCircle, UserPlus } from "lucide-react";
import toast from "react-hot-toast";
import MainLayout from "../../components/layout/MainLayout";
import api from "../../services/api";
import { getAvatarUrl } from "../../utils/avatar";
import "../../styles/friends.css";

export default function Friends() {
  const [tab, setTab] = useState("friends");
  const [friends, setFriends] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [sentTo, setSentTo] = useState(new Set());
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, [tab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (tab === "friends") {
        const res = await api.get("/friends");
        setFriends(res.data.friends);
      } else {
        const res = await api.get("/friends/suggestions");
        setSuggestions(res.data.suggestions);
      }
    } finally {
      setLoading(false);
    }
  };

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

  const list = tab === "friends" ? friends : suggestions;
  const filteredList = list.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <MainLayout>
      <div className="friends-header">
        <h2>{tab === "friends" ? "My Friends" : "People You May Know"}</h2>
        {tab === "friends" && (
          <span className="friends-count-badge">{friends.length}</span>
        )}
      </div>

      <div className="requests-tabs">
        <button
          className={tab === "friends" ? "active" : ""}
          onClick={() => setTab("friends")}
        >
          My Friends
        </button>
        <button
          className={tab === "suggestions" ? "active" : ""}
          onClick={() => setTab("suggestions")}
        >
          Suggestions
        </button>
      </div>

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

      {loading ? (
        <p className="friends-empty-state">Loading...</p>
      ) : filteredList.length === 0 ? (
        <p className="friends-empty-state">
          {tab === "friends"
            ? search
              ? "No friends match your search."
              : "You haven't added any friends yet."
            : "No suggestions right now — check back later!"}
        </p>
      ) : (
        <div className="friends-grid">
          {filteredList.map((person) => (
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
                <p className="friend-card-title">{person.professionalTitle}</p>
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
                      className="btn-icon-danger"
                      onClick={() => removeFriend(person._id, person.name)}
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
                    {sentTo.has(person._id) ? "Request Sent" : "Add Friend"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </MainLayout>
  );
}
