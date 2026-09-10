import { useEffect, useState } from "react";
import { MapPin, Trash2 } from "lucide-react";
import api from "../../api/axios";

function SavedStays() {
  const [savedStays, setSavedStays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    api
      .get("/users/me/saved-places")
      .then((res) => setSavedStays(res.data.savedPlaces || []))
      .catch((err) => console.error("Failed to load saved places:", err))
      .finally(() => setLoading(false));
  }, []);

  async function handleRemove(id) {
    setRemovingId(id);
    try {
      await api.delete(`/users/me/saved-places/${id}`);
      setSavedStays((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Could not remove this place.");
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <div className="dashboard-section-card">
      <div className="section-header-flex">
        <h3>Saved Stays ({savedStays.length})</h3>
      </div>

      {loading && (
        <p style={{ color: "#64748b", padding: "20px 0" }}>Loading...</p>
      )}

      {!loading && savedStays.length === 0 ? (
        <p style={{ color: "#64748b", padding: "20px 0" }}>
          You have no saved stays in your wishlist yet.
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          {savedStays.map((stay) => (
            <div
              key={stay._id}
              className="stay-card"
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: "16px",
                overflow: "hidden",
                background: "#fff",
              }}
            >
              <div style={{ position: "relative", height: "180px" }}>
                <img
                  src={stay.images?.[0]}
                  alt={stay.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <button
                  onClick={() => handleRemove(stay._id)}
                  disabled={removingId === stay._id}
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    background: "#fff",
                    border: "none",
                    borderRadius: "50%",
                    width: "32px",
                    height: "32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "#ef4444",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                  title="Remove from saved"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div style={{ padding: "16px" }}>
                <h4
                  style={{
                    margin: "0 0 6px 0",
                    fontFamily: "Fraunces, serif",
                    fontSize: "17px",
                    color: "#0a2540",
                  }}
                >
                  {stay.name}
                </h4>
                <p
                  style={{
                    margin: "0 0 10px 0",
                    fontSize: "13px",
                    color: "#64748b",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <MapPin size={14} /> {stay.address}
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderTop: "1px solid #f1f5f9",
                    paddingTop: "12px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "700",
                      color: "#0a2540",
                    }}
                  >
                    ${stay.priceFrom}{" "}
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: "normal",
                        color: "#64748b",
                      }}
                    >
                      / night
                    </span>
                  </span>
                  <button
                    style={{
                      background: "#0e7c86",
                      color: "#fff",
                      border: "none",
                      padding: "6px 14px",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SavedStays;
