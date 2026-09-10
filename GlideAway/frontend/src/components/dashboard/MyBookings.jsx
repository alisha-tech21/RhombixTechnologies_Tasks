import { useEffect, useState } from "react";
import { Calendar, CheckCircle2, XCircle, Clock } from "lucide-react";
import api from "../../api/axios";

// Maps our backend's booking.status to the tab labels this UI already uses.
function toTabCategory(booking) {
  if (booking.status === "cancelled") return "Cancelled";
  if (booking.status === "completed") return "Completed";
  return "Upcoming"; // pending or confirmed, not yet completed
}

function MyBookings() {
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  function loadBookings() {
    setLoading(true);
    api
      .get("/bookings/me")
      .then((res) => setBookings(res.data.bookings))
      .catch((err) => console.error("Failed to load bookings:", err))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadBookings();
  }, []);

  async function handleCancel(id) {
    if (!window.confirm("Cancel this booking? This can't be undone.")) return;
    setCancellingId(id);
    try {
      await api.patch(`/bookings/${id}/cancel`);
      loadBookings();
    } catch (err) {
      alert(err.response?.data?.message || "Could not cancel this booking.");
    } finally {
      setCancellingId(null);
    }
  }

  const filteredBookings = bookings.filter(
    (b) => toTabCategory(b) === activeTab,
  );

  return (
    <div className="overview-wrapper">
      <div className="welcome-section">
        <h1>My Bookings</h1>
        <p>Track and manage all your past and upcoming trips.</p>
      </div>

      <div className="bookings-section">
        <div className="section-header-row">
          <h3>Booking History</h3>
          <div className="tabs-container">
            {["Upcoming", "Completed", "Cancelled"].map((tab) => (
              <button
                key={tab}
                className={`tab-btn ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {loading && <p style={{ color: "#64748b" }}>Loading...</p>}

        {!loading && filteredBookings.length === 0 ? (
          <div
            className="dashboard-section-card"
            style={{ textAlign: "center", padding: "40px", color: "#64748b" }}
          >
            <p>No {activeTab.toLowerCase()} bookings found.</p>
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            {filteredBookings.map((b) => (
              <div className="booking-card-item" key={b._id}>
                <div className="booking-image-box">
                  <img
                    src={
                      b.propertyId?.images?.[0] ||
                      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80"
                    }
                    alt={b.propertyId?.name || b.dealId?.title}
                  />
                  <span className="resort-tag">
                    {b.propertyId ? "STAY" : "PACKAGE"}
                  </span>
                </div>
                <div className="booking-details-box">
                  <div className="booking-header-flex">
                    <div>
                      <h4>{b.propertyId?.name || b.dealId?.title}</h4>
                      <p className="booking-date-sub">
                        <Calendar size={14} />{" "}
                        {new Date(b.checkIn).toLocaleDateString()} –{" "}
                        {new Date(b.checkOut).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`confirmed-badge ${b.status}`}>
                      {b.status === "confirmed" && <CheckCircle2 size={14} />}
                      {b.status === "completed" && <Clock size={14} />}
                      {b.status === "cancelled" && <XCircle size={14} />}
                      {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                    </span>
                  </div>

                  <div className="booking-footer-flex">
                    <div>
                      <span className="price-label">Total Price</span>
                      <h3 className="price-val">${b.priceSummary?.total}</h3>
                    </div>
                    {activeTab === "Upcoming" ? (
                      <button
                        className="view-booking-btn"
                        onClick={() => handleCancel(b._id)}
                        disabled={cancellingId === b._id}
                      >
                        {cancellingId === b._id
                          ? "Cancelling..."
                          : "Cancel Booking"}
                      </button>
                    ) : (
                      <button className="view-booking-btn">View Details</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyBookings;
