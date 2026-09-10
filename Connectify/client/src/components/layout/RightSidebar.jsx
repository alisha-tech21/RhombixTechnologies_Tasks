import { useEffect, useState } from "react";
import api from "../../services/api";
import { getAvatarUrl } from "../../utils/avatar";
import "../../styles/layout.css";

export default function RightSidebar() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    api
      .get("/friends/requests/received")
      .then((res) => setRequests(res.data.requests))
      .catch(() => {});
  }, []);

  const respond = async (id, action) => {
    await api.put(`/friends/${action}/${id}`);
    setRequests((prev) => prev.filter((r) => r._id !== id));
  };

  return (
    <aside className="app-right-sidebar">
      <div className="widget-card">
        <div className="widget-header">
          <h3>Friend Requests</h3>
          {requests.length > 0 && (
            <span className="widget-count">{requests.length}</span>
          )}
        </div>

        {requests.length === 0 ? (
          <p className="widget-empty">No pending requests</p>
        ) : (
          requests.map((req) => (
            <div className="widget-person" key={req._id}>
              <img
                src={getAvatarUrl(req.sender.profilePicture, req.sender.name)}
                alt={req.sender.name}
              />
              <div className="widget-person-info">
                <p>{req.sender.name}</p>
                <div className="widget-person-actions">
                  <button
                    className="btn-accept"
                    onClick={() => respond(req._id, "accept")}
                  >
                    Accept
                  </button>
                  <button
                    className="btn-decline"
                    onClick={() => respond(req._id, "reject")}
                  >
                    Decline
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="widget-card">
        <h3>Trending Technologies</h3>
        <div className="widget-tags">
          {["#React", "#Node.js", "#MongoDB", "#WebSockets", "#OpenSource"].map(
            (tag) => (
              <span key={tag} className="widget-tag">
                {tag}
              </span>
            ),
          )}
        </div>
      </div>

      <p className="widget-footer">© {new Date().getFullYear()} Connectify</p>
    </aside>
  );
}
