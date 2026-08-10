import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, X, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import MainLayout from "../../components/layout/MainLayout";
import api from "../../services/api";
import socket from "../../services/socket";
import { getAvatarUrl } from "../../utils/avatar";
import "../../styles/friends.css";

export default function FriendRequests() {
  const [tab, setTab] = useState("received");
  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadRequests();

    const handleNewRequest = (req) => {
      setReceived((prev) => [req, ...prev]);
      toast.success(`${req.sender.name} sent you a friend request`);
    };
    socket.on("friend_request", handleNewRequest);
    return () => socket.off("friend_request", handleNewRequest);
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const [receivedRes, sentRes] = await Promise.all([
        api.get("/friends/requests/received"),
        api.get("/friends/requests/sent"),
      ]);
      setReceived(receivedRes.data.requests);
      setSent(sentRes.data.requests);
    } finally {
      setLoading(false);
    }
  };

  const acceptRequest = async (id) => {
    try {
      await api.put(`/friends/accept/${id}`);
      setReceived((prev) => prev.filter((r) => r._id !== id));
      window.dispatchEvent(new Event("friend-request-count-changed"));
      toast.success("Friend request accepted");
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

  return (
    <MainLayout>
      <div className="friends-header">
        <h2>Friend Requests</h2>
      </div>

      <div className="requests-tabs">
        <button
          className={tab === "received" ? "active" : ""}
          onClick={() => setTab("received")}
        >
          Received{" "}
          {received.length > 0 && (
            <span className="tab-badge">{received.length}</span>
          )}
        </button>
        <button
          className={tab === "sent" ? "active" : ""}
          onClick={() => setTab("sent")}
        >
          Sent{" "}
          {sent.length > 0 && <span className="tab-badge">{sent.length}</span>}
        </button>
      </div>

      {loading ? (
        <p className="friends-empty-state">Loading requests...</p>
      ) : tab === "received" ? (
        received.length === 0 ? (
          <p className="friends-empty-state">No pending friend requests.</p>
        ) : (
          <div className="request-list">
            {received.map((req) => (
              <div className="request-row" key={req._id}>
                <img
                  className="friend-card-avatar sm"
                  src={getAvatarUrl(req.sender.profilePicture, req.sender.name)}
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
        )
      ) : sent.length === 0 ? (
        <p className="friends-empty-state">
          You haven't sent any friend requests.
        </p>
      ) : (
        <div className="request-list">
          {sent.map((req) => (
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
      )}
    </MainLayout>
  );
}
