import { useEffect, useState } from "react";
import {
  Plane,
  Briefcase,
  Bookmark,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";

function DashboardOverview() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [savedCount, setSavedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/bookings/me"), api.get("/users/me/saved-places")])
      .then(([bookingsRes, savedRes]) => {
        setBookings(bookingsRes.data.bookings);
        setSavedCount(savedRes.data.savedPlaces?.length || 0);
      })
      .catch((err) => console.error("Failed to load dashboard data:", err))
      .finally(() => setLoading(false));
  }, []);

  const upcoming = bookings.filter(
    (b) => b.status === "confirmed" && new Date(b.checkIn) > new Date(),
  );
  const latestBooking = bookings[0];

  return (
    <div className="overview-wrapper">
      {/* Welcome Banner */}
      <div className="welcome-section">
        <h1>Welcome back, {user?.name?.split(" ")[0] || "Traveler"}!</h1>
        <p>
          Your serene exploration awaits. Here is an overview of your journey.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div
            className="stat-icon-wrap"
            style={{ background: "#e6f4f5", color: "#0e7c86" }}
          >
            <Plane size={20} />
          </div>
          <div>
            <span className="stat-label">UPCOMING TRIPS</span>
            <h2 className="stat-number">{loading ? "…" : upcoming.length}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div
            className="stat-icon-wrap"
            style={{ background: "#fff1f2", color: "#f43f5e" }}
          >
            <Briefcase size={20} />
          </div>
          <div>
            <span className="stat-label">TOTAL BOOKINGS</span>
            <h2 className="stat-number">{loading ? "…" : bookings.length}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div
            className="stat-icon-wrap"
            style={{ background: "#f0fdf4", color: "#22c55e" }}
          >
            <Bookmark size={20} />
          </div>
          <div>
            <span className="stat-label">SAVED PLACES</span>
            <h2 className="stat-number">{loading ? "…" : savedCount}</h2>
          </div>
        </div>
      </div>

      {/* My Bookings Section */}
      <div className="bookings-section">
        <div className="section-header-row">
          <h3>Recent Booking</h3>
        </div>

        {loading && <p style={{ color: "#64748b" }}>Loading...</p>}

        {!loading && !latestBooking && (
          <div
            className="dashboard-section-card"
            style={{ textAlign: "center", padding: "40px", color: "#64748b" }}
          >
            <p>
              No bookings yet — start exploring destinations to plan your first
              trip.
            </p>
          </div>
        )}

        {latestBooking && (
          <div className="booking-card-item">
            <div className="booking-image-box">
              <img
                src={
                  latestBooking.propertyId?.images?.[0] ||
                  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80"
                }
                alt={latestBooking.propertyId?.name || "Booking"}
              />
              <span className="resort-tag">
                {latestBooking.propertyId ? "STAY" : "PACKAGE"}
              </span>
            </div>
            <div className="booking-details-box">
              <div className="booking-header-flex">
                <div>
                  <h4>
                    {latestBooking.propertyId?.name ||
                      latestBooking.dealId?.title}
                  </h4>
                  <p className="booking-date-sub">
                    <Calendar size={14} />{" "}
                    {new Date(latestBooking.checkIn).toLocaleDateString()} –{" "}
                    {new Date(latestBooking.checkOut).toLocaleDateString()}
                  </p>
                </div>
                {latestBooking.status === "confirmed" && (
                  <span className="confirmed-badge">
                    <CheckCircle2 size={14} /> Confirmed
                  </span>
                )}
              </div>

              <div className="booking-footer-flex">
                <div>
                  <span className="price-label">Total Price</span>
                  <h3 className="price-val">
                    ${latestBooking.priceSummary?.total}
                  </h3>
                </div>
                <button className="view-booking-btn">View Booking</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardOverview;
