import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Bookmark,
  Compass,
  Settings,
  LogOut,
  Search,
  Bell,
  Plus,
  X,
  Calendar,
  CheckCircle2,
  MapPin,
  Users,
  CreditCard,
  Home,
  Clock,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import DashboardOverview from "./DashboardOverview";
import api from "../api/axios";

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("overview");
  const [selectedBookingModal, setSelectedBookingModal] = useState(null);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get("/bookings/me");
        setBookings(res.data.bookings || []);
      } catch (err) {
        console.error("Failed to load bookings:", err);
      }
    };

    fetchBookings();
  }, []);

  // =========================
  // VIEW BOOKING
  // =========================
  const handleViewBooking = (booking) => {
    console.log("Opening booking:", booking);
    setSelectedBookingModal(booking);
  };

  // =========================
  // RECOMMENDATION
  // =========================
  const handleSelectRecommendation = (property) => {
    if (!property?._id && !property?.id) {
      console.error("Property ID missing:", property);
      return;
    }

    const propertyId = property._id || property.id;

    navigate(`/properties/${propertyId}`);
  };

  // =========================
  // FORMAT DATE
  // =========================
  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // =========================
  // PROPERTY IMAGE
  // =========================
  const getBookingImage = (booking) => {
    return (
      booking?.propertyId?.images?.[0] ||
      booking?.propertyId?.image ||
      booking?.dealId?.image ||
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&q=80"
    );
  };

  // =========================
  // PROPERTY NAME
  // =========================
  const getBookingName = (booking) => {
    return (
      booking?.propertyId?.name ||
      booking?.dealId?.title ||
      booking?.destinationId?.name ||
      "Trip Details"
    );
  };

  return (
    <div className="dashboard-container">
      {/* ================= SIDEBAR ================= */}
      <aside className="dashboard-sidebar">
        <div>
          <div className="sidebar-brand">
            <h2>GlideAway</h2>
            <span>TRAVEL PORTAL</span>
          </div>

          <nav className="sidebar-nav">
            <a
              href="#overview"
              className={`sidebar-link ${
                activeTab === "overview" ? "active" : ""
              }`}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("overview");
              }}
            >
              <LayoutDashboard size={18} />
              Overview
            </a>

            <a
              href="#bookings"
              className={`sidebar-link ${
                activeTab === "bookings" ? "active" : ""
              }`}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("bookings");
              }}
            >
              <Compass size={18} />
              My Bookings
            </a>

            <a
              href="#saved"
              className={`sidebar-link ${
                activeTab === "saved" ? "active" : ""
              }`}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("saved");
              }}
            >
              <Bookmark size={18} />
              Saved Trips
            </a>

            <a
              href="#settings"
              className={`sidebar-link ${
                activeTab === "settings" ? "active" : ""
              }`}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("settings");
              }}
            >
              <Settings size={18} />
              Settings
            </a>
          </nav>
        </div>

        <div className="sidebar-footer">
          <button className="book-new-trip-btn" onClick={() => navigate("/")}>
            <Plus size={16} />
            Book New Trip
          </button>

          <button className="logout-btn-sidebar" onClick={logout}>
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="dashboard-main">
        {/* TOPBAR */}
        <header className="dashboard-topbar">
          <div className="topbar-search">
            <Search className="search-icon" size={16} />

            <input type="text" placeholder="Search destinations, bookings..." />
          </div>

          <div className="topbar-actions">
            <button className="icon-btn">
              <Bell size={18} />
            </button>

            <img
              src={
                user?.avatar ||
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80"
              }
              alt="Profile"
              className="topbar-avatar"
            />
          </div>
        </header>

        {/* CONTENT */}
        <div className="dashboard-content-body">
          {activeTab === "overview" && (
            <DashboardOverview
              onViewBooking={handleViewBooking}
              onSelectRecommendation={handleSelectRecommendation}
            />
          )}

          {/* ================= BOOKINGS ================= */}
          {activeTab === "bookings" && (
            <div>
              <h2
                style={{
                  fontFamily: "Fraunces, serif",
                  color: "#064e3b",
                }}
              >
                All Bookings
              </h2>

              <p style={{ color: "#64748b" }}>
                Manage your complete list of past and upcoming trips here.
              </p>

              {bookings.length === 0 ? (
                <div
                  style={{
                    marginTop: "25px",
                    background: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "16px",
                    padding: "40px",
                    textAlign: "center",
                    color: "#64748b",
                  }}
                >
                  No bookings found.
                </div>
              ) : (
                <div
                  style={{
                    marginTop: "25px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "15px",
                  }}
                >
                  {bookings.map((booking) => (
                    <div
                      key={booking._id}
                      style={{
                        background: "#fff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "14px",
                        padding: "18px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "20px",
                      }}
                    >
                      <div>
                        <h4
                          style={{
                            margin: "0 0 5px",
                            color: "#064e3b",
                          }}
                        >
                          {getBookingName(booking)}
                        </h4>

                        <p
                          style={{
                            margin: 0,
                            fontSize: "13px",
                            color: "#64748b",
                          }}
                        >
                          {formatDate(booking.checkIn)} —{" "}
                          {formatDate(booking.checkOut)}
                        </p>
                      </div>

                      <button
                        className="view-booking-btn"
                        onClick={() => handleViewBooking(booking)}
                      >
                        View Details
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ================= SAVED ================= */}
          {activeTab === "saved" && (
            <div>
              <h2
                style={{
                  fontFamily: "Fraunces, serif",
                  color: "#064e3b",
                }}
              >
                Saved Places
              </h2>

              <p style={{ color: "#64748b" }}>
                Your favorite properties and dream destinations.
              </p>
            </div>
          )}

          {/* ================= SETTINGS ================= */}
          {activeTab === "settings" && (
            <div>
              <h2
                style={{
                  fontFamily: "Fraunces, serif",
                  color: "#064e3b",
                }}
              >
                Account Settings
              </h2>

              <p style={{ color: "#64748b" }}>
                Update your profile details and preferences.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* =====================================================
          BOOKING DETAILS MODAL
      ===================================================== */}
      {selectedBookingModal && (
        <div
          className="booking-modal-overlay"
          onClick={() => setSelectedBookingModal(null)}
        >
          <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
            {/* HEADER */}
            <div className="booking-modal-header">
              <div>
                <h3>Booking Details</h3>
                <p>
                  Booking reference:{" "}
                  <strong>{selectedBookingModal.bookingRef || "N/A"}</strong>
                </p>
              </div>

              <button
                className="booking-modal-close"
                onClick={() => setSelectedBookingModal(null)}
              >
                <X size={20} />
              </button>
            </div>

            {/* BODY */}
            <div className="booking-modal-body">
              {/* PROPERTY */}
              <div className="booking-modal-property">
                <img
                  src={getBookingImage(selectedBookingModal)}
                  alt={getBookingName(selectedBookingModal)}
                />

                <div>
                  <h4>{getBookingName(selectedBookingModal)}</h4>

                  {(selectedBookingModal.propertyId?.location ||
                    selectedBookingModal.propertyId?.city) && (
                    <p>
                      <MapPin size={14} />

                      {selectedBookingModal.propertyId?.location ||
                        selectedBookingModal.propertyId?.city}
                    </p>
                  )}

                  <span
                    className={`booking-status ${selectedBookingModal.status}`}
                  >
                    <CheckCircle2 size={13} />

                    {selectedBookingModal.status || "Pending"}
                  </span>
                </div>
              </div>

              {/* DATES */}
              <div className="booking-info-grid">
                <div className="booking-info-item">
                  <Calendar size={17} />

                  <div>
                    <span>Check-In</span>
                    <strong>{formatDate(selectedBookingModal.checkIn)}</strong>
                  </div>
                </div>

                <div className="booking-info-item">
                  <Calendar size={17} />

                  <div>
                    <span>Check-Out</span>
                    <strong>{formatDate(selectedBookingModal.checkOut)}</strong>
                  </div>
                </div>

                <div className="booking-info-item">
                  <Clock size={17} />

                  <div>
                    <span>Booking Date</span>
                    <strong>
                      {formatDate(selectedBookingModal.createdAt)}
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

              {/* ROOM / PROPERTY DETAILS */}
              <div className="booking-detail-box">
                <h4>
                  <Home size={17} />
                  Stay Details
                </h4>

                <div className="booking-detail-row">
                  <span>Property</span>
                  <strong>{getBookingName(selectedBookingModal)}</strong>
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

              {/* PRICE */}
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
                    {selectedBookingModal.priceSummary?.total ||
                      selectedBookingModal.totalPrice ||
                      selectedBookingModal.price ||
                      0}
                  </strong>
                </div>
              </div>

              {/* CONTACT / PAYMENT */}
              {(selectedBookingModal.paymentMethod ||
                selectedBookingModal.paymentStatus ||
                selectedBookingModal.email) && (
                <div className="booking-detail-box">
                  <h4>
                    <CreditCard size={17} />
                    Additional Information
                  </h4>

                  {selectedBookingModal.paymentMethod && (
                    <div className="booking-detail-row">
                      <span>Payment Method</span>
                      <strong>{selectedBookingModal.paymentMethod}</strong>
                    </div>
                  )}

                  {selectedBookingModal.paymentStatus && (
                    <div className="booking-detail-row">
                      <span>Payment Status</span>
                      <strong>{selectedBookingModal.paymentStatus}</strong>
                    </div>
                  )}

                  {selectedBookingModal.email && (
                    <div className="booking-detail-row">
                      <span>Email</span>
                      <strong>{selectedBookingModal.email}</strong>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* FOOTER */}
            <div className="booking-modal-footer">
              <button
                className="booking-close-btn"
                onClick={() => setSelectedBookingModal(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
