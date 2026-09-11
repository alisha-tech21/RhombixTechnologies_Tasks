import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plane,
  Briefcase,
  Bookmark,
  Calendar,
  CheckCircle2,
  MapPin,
  Users,
  CreditCard,
  Home,
  Clock,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";

function DashboardOverview() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [selectedBookingModal, setSelectedBookingModal] = useState(null);

  const [bookings, setBookings] = useState([]);
  const [savedCount, setSavedCount] = useState(0);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [propertiesLoading, setPropertiesLoading] = useState(true);

  // ==========================================
  // LOAD DASHBOARD DATA
  // ==========================================
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [bookingsRes, savedRes, propertiesRes] = await Promise.all([
          api.get("/bookings/me"),
          api.get("/users/me/saved-places"),
          api.get("/properties"),
        ]);

        setBookings(bookingsRes.data.bookings || []);

        setSavedCount(savedRes.data.savedPlaces?.length || 0);

        setProperties(
          propertiesRes.data.properties || propertiesRes.data || [],
        );
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
        setPropertiesLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // ==========================================
  // UPCOMING BOOKINGS
  // ==========================================
  const upcoming = bookings.filter(
    (booking) =>
      booking.status === "confirmed" && new Date(booking.checkIn) > new Date(),
  );

  const latestBooking = bookings[0];

  // ==========================================
  // FIND RECOMMENDED PROPERTIES
  // ==========================================
  const findProperty = (keyword) => {
    return properties.find((property) => {
      const locationText =
        typeof property.location === "string" ? property.location : "";

      const destinationText =
        typeof property.destination === "string"
          ? property.destination
          : property.destination?.name || "";

      const text = `
        ${property.name || ""}
        ${property.title || ""}
        ${property.city || ""}
        ${locationText}
        ${destinationText}
        ${property.country || ""}
        ${property.region || ""}
      `.toLowerCase();

      return text.includes(keyword.toLowerCase());
    });
  };

  const maldivesProperty = findProperty("maldives");
  const tokyoProperty = findProperty("tokyo");

  const recommendedProperties = [
    maldivesProperty || properties[0],
    tokyoProperty || properties[1],
  ].filter(Boolean);

  // ==========================================
  // PROPERTY IMAGE
  // ==========================================
  const getPropertyImage = (property) => {
    return (
      property?.images?.[0] ||
      property?.image ||
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&q=80"
    );
  };

  // ==========================================
  // PROPERTY NAME
  // ==========================================
  const getPropertyName = (property) => {
    return property?.name || property?.title || "Explore Destination";
  };

  // ==========================================
  // PROPERTY LOCATION
  // ==========================================
  const getPropertyLocation = (property) => {
    if (!property) return "Beautiful destination";

    if (typeof property.location === "string") {
      return property.location;
    }

    if (property.city && property.country) {
      return `${property.city}, ${property.country}`;
    }

    if (property.city) {
      return property.city;
    }

    if (property.country) {
      return property.country;
    }

    if (property.destination) {
      return typeof property.destination === "string"
        ? property.destination
        : property.destination?.name || "Beautiful destination";
    }

    return "Beautiful destination";
  };

  // ==========================================
  // BOOKING LOCATION
  // ==========================================
  const getBookingLocation = (booking) => {
    const property = booking?.propertyId;

    if (!property) return "Beautiful destination";

    if (typeof property.location === "string") {
      return property.location;
    }

    if (property.city && property.country) {
      return `${property.city}, ${property.country}`;
    }

    if (property.city) {
      return property.city;
    }

    if (property.country) {
      return property.country;
    }

    if (typeof property.destination === "string") {
      return property.destination;
    }

    if (property.destination?.name) {
      return property.destination.name;
    }

    return "Beautiful destination";
  };

  // ==========================================
  // VIEW BOOKING
  // ==========================================
  const handleViewBooking = (booking) => {
    setSelectedBookingModal(booking);
  };

  // ==========================================
  // CLOSE BOOKING MODAL
  // ==========================================
  const closeBookingModal = () => {
    setSelectedBookingModal(null);
  };

  // ==========================================
  // OPEN PROPERTY DETAILS
  // ==========================================
  const handleSelectRecommendation = (property) => {
    const propertyId = property?._id || property?.id;

    if (!propertyId) {
      console.error("Property ID missing:", property);
      return;
    }

    navigate(`/property/${propertyId}`);
  };

  return (
    <>
      <div className="overview-wrapper">
        {/* ==========================================
            WELCOME
        ========================================== */}
        <div className="welcome-section">
          <h1>Welcome back, {user?.name?.split(" ")[0] || "Traveler"}!</h1>

          <p>
            Your serene exploration awaits. Here is an overview of your upcoming
            travels and rewards.
          </p>
        </div>

        {/* ==========================================
            STATS
        ========================================== */}
        <div className="stats-grid">
          <div className="stat-card">
            <div
              className="stat-icon-wrap"
              style={{
                background: "#f0fdf4",
                color: "#0d9488",
              }}
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
              style={{
                background: "#fff1f2",
                color: "#f43f5e",
              }}
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
              style={{
                background: "#f0fdf4",
                color: "#22c55e",
              }}
            >
              <Bookmark size={20} />
            </div>

            <div>
              <span className="stat-label">SAVED PLACES</span>
              <h2 className="stat-number">{loading ? "…" : savedCount}</h2>
            </div>
          </div>
        </div>

        {/* ==========================================
            CURRENT TRIP
        ========================================== */}
        <div className="bookings-section" style={{ marginBottom: "40px" }}>
          <div className="section-header-row">
            <h3>Current Trips</h3>

            <span
              style={{
                fontSize: "13px",
                color: "#0d9488",
                fontWeight: "600",
                cursor: "pointer",
              }}
              onClick={() => navigate("/dashboard/bookings")}
            >
              View All
            </span>
          </div>

          {loading && <p style={{ color: "#64748b" }}>Loading bookings...</p>}

          {!loading && !latestBooking && (
            <div
              className="dashboard-section-card"
              style={{
                textAlign: "center",
                padding: "40px",
                color: "#64748b",
                background: "#fff",
                borderRadius: "16px",
                border: "1px solid #e2e8f0",
              }}
            >
              <p>
                No bookings yet — start exploring destinations to plan your
                first trip.
              </p>
            </div>
          )}

          {latestBooking && (
            <div className="booking-card-item">
              <div className="booking-image-box">
                <img
                  src={
                    latestBooking.propertyId?.images?.[0] ||
                    latestBooking.propertyId?.image ||
                    latestBooking.dealId?.image ||
                    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&q=80"
                  }
                  alt={
                    latestBooking.propertyId?.name ||
                    latestBooking.dealId?.title ||
                    "Booking"
                  }
                />

                <span className="resort-tag">
                  {latestBooking.status
                    ? latestBooking.status.toUpperCase()
                    : "UPCOMING"}
                </span>
              </div>

              <div className="booking-details-box">
                <div className="booking-header-flex">
                  <div>
                    <h4>
                      {latestBooking.propertyId?.name ||
                        latestBooking.dealId?.title ||
                        "Explore Destination"}
                    </h4>

                    <p className="booking-date-sub">
                      <Calendar size={14} />
                      {latestBooking.checkIn
                        ? new Date(latestBooking.checkIn).toLocaleDateString()
                        : "N/A"}{" "}
                      –{" "}
                      {latestBooking.checkOut
                        ? new Date(latestBooking.checkOut).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>

                  {latestBooking.status === "confirmed" && (
                    <span className="confirmed-badge">
                      <CheckCircle2 size={14} />
                      Confirmed
                    </span>
                  )}
                </div>

                <div className="booking-footer-flex">
                  <div>
                    <span className="price-label">Total Price</span>

                    <h3 className="price-val">
                      $
                      {latestBooking.priceSummary?.total ??
                        latestBooking.totalPrice ??
                        latestBooking.price ??
                        0}
                    </h3>
                  </div>

                  <button
                    type="button"
                    className="view-booking-btn"
                    onClick={() => handleViewBooking(latestBooking)}
                  >
                    View Booking
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ==========================================
            RECOMMENDATIONS
        ========================================== */}
        <div className="recommendations-section">
          <div className="section-header-row">
            <h3>Recommended for You</h3>
          </div>

          {propertiesLoading ? (
            <p style={{ color: "#64748b" }}>Loading recommendations...</p>
          ) : recommendedProperties.length === 0 ? (
            <div
              style={{
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: "16px",
                padding: "30px",
                color: "#64748b",
                textAlign: "center",
              }}
            >
              No recommendations available right now.
            </div>
          ) : (
            <div className="recommendations-grid">
              {recommendedProperties.map((property, index) => (
                <div
                  key={property._id || property.id}
                  className="recommendation-card"
                  onClick={() => handleSelectRecommendation(property)}
                >
                  <img
                    src={getPropertyImage(property)}
                    alt={getPropertyName(property)}
                  />

                  <div className="recommendation-overlay" />

                  <div className="recommendation-content">
                    <div>
                      <h4>{getPropertyName(property)}</h4>

                      <p>
                        <MapPin size={12} />
                        {getPropertyLocation(property)}
                      </p>
                    </div>

                    <span className="recommendation-price">
                      {property.priceFrom != null
                        ? `From $${property.priceFrom}`
                        : index === 0
                          ? "Explore Now"
                          : "View Property"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ==========================================
          BOOKING DETAILS MODAL
      ========================================== */}
      {selectedBookingModal && (
        <div className="booking-modal-overlay" onClick={closeBookingModal}>
          <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
            <div className="booking-modal-header">
              <div>
                <h3>Booking Details</h3>

                <p>
                  Booking reference:{" "}
                  <strong>{selectedBookingModal.bookingRef || "N/A"}</strong>
                </p>
              </div>

              <button
                type="button"
                className="booking-modal-close"
                onClick={closeBookingModal}
              >
                <X size={20} />
              </button>
            </div>

            <div className="booking-modal-body">
              <div className="booking-modal-property">
                <img
                  src={
                    selectedBookingModal.propertyId?.images?.[0] ||
                    selectedBookingModal.propertyId?.image ||
                    selectedBookingModal.dealId?.image ||
                    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&q=80"
                  }
                  alt="Booking"
                />

                <div>
                  <h4>
                    {selectedBookingModal.propertyId?.name ||
                      selectedBookingModal.propertyId?.title ||
                      selectedBookingModal.dealId?.title ||
                      "Trip Details"}
                  </h4>

                  <p>
                    <MapPin size={14} />
                    {getBookingLocation(selectedBookingModal)}
                  </p>

                  <span
                    className={`booking-status ${
                      selectedBookingModal.status || "pending"
                    }`}
                  >
                    <CheckCircle2 size={13} />
                    {selectedBookingModal.status || "Pending"}
                  </span>
                </div>
              </div>

              <div className="booking-info-grid">
                <div className="booking-info-item">
                  <Calendar size={17} />

                  <div>
                    <span>Check-In</span>

                    <strong>
                      {selectedBookingModal.checkIn
                        ? new Date(
                            selectedBookingModal.checkIn,
                          ).toLocaleDateString()
                        : "N/A"}
                    </strong>
                  </div>
                </div>

                <div className="booking-info-item">
                  <Calendar size={17} />

                  <div>
                    <span>Check-Out</span>

                    <strong>
                      {selectedBookingModal.checkOut
                        ? new Date(
                            selectedBookingModal.checkOut,
                          ).toLocaleDateString()
                        : "N/A"}
                    </strong>
                  </div>
                </div>

                <div className="booking-info-item">
                  <Clock size={17} />

                  <div>
                    <span>Booking Date</span>

                    <strong>
                      {selectedBookingModal.createdAt
                        ? new Date(
                            selectedBookingModal.createdAt,
                          ).toLocaleDateString()
                        : "N/A"}
                    </strong>
                  </div>
                </div>

                <div className="booking-info-item">
                  <Users size={17} />

                  <div>
                    <span>Guests</span>

                    <strong>
                      {selectedBookingModal.guests ||
                        selectedBookingModal.guestCount ||
                        selectedBookingModal.numberOfGuests ||
                        1}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="booking-detail-box">
                <h4>
                  <Home size={17} />
                  Stay Details
                </h4>

                <div className="booking-detail-row">
                  <span>Property</span>

                  <strong>
                    {selectedBookingModal.propertyId?.name ||
                      selectedBookingModal.propertyId?.title ||
                      selectedBookingModal.dealId?.title ||
                      "Trip Details"}
                  </strong>
                </div>

                {selectedBookingModal.roomId && (
                  <div className="booking-detail-row">
                    <span>Room</span>

                    <strong>
                      {selectedBookingModal.roomId?.name ||
                        selectedBookingModal.roomId?.title ||
                        "Selected Room"}
                    </strong>
                  </div>
                )}

                {selectedBookingModal.roomType && (
                  <div className="booking-detail-row">
                    <span>Room Type</span>

                    <strong>{selectedBookingModal.roomType}</strong>
                  </div>
                )}

                {selectedBookingModal.nights && (
                  <div className="booking-detail-row">
                    <span>Nights</span>

                    <strong>{selectedBookingModal.nights}</strong>
                  </div>
                )}
              </div>

              <div className="booking-price-box">
                <div className="booking-price-header">
                  <h4>
                    <CreditCard size={17} />
                    Payment Summary
                  </h4>
                </div>

                {selectedBookingModal.priceSummary?.roomTotal != null && (
                  <div className="booking-detail-row">
                    <span>Room Price</span>

                    <strong>
                      ${selectedBookingModal.priceSummary.roomTotal}
                    </strong>
                  </div>
                )}

                {selectedBookingModal.priceSummary?.subtotal != null && (
                  <div className="booking-detail-row">
                    <span>Subtotal</span>

                    <strong>
                      ${selectedBookingModal.priceSummary.subtotal}
                    </strong>
                  </div>
                )}

                {selectedBookingModal.priceSummary?.tax != null && (
                  <div className="booking-detail-row">
                    <span>Taxes</span>

                    <strong>${selectedBookingModal.priceSummary.tax}</strong>
                  </div>
                )}

                <div className="booking-total-row">
                  <span>Total Price</span>

                  <strong>
                    $
                    {selectedBookingModal.priceSummary?.total ??
                      selectedBookingModal.totalPrice ??
                      selectedBookingModal.price ??
                      0}
                  </strong>
                </div>
              </div>
            </div>

            <div className="booking-modal-footer">
              <button
                type="button"
                className="booking-close-btn"
                onClick={closeBookingModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DashboardOverview;
