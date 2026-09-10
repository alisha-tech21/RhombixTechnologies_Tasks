import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import "../styles/Booking.css";

function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const trip = location.state;

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!trip) {
    return (
      <div className="booking-page">
        <div className="booking-container">
          <p>
            No stay selected. <Link to="/explore">Browse stays</Link>
          </p>
        </div>
      </div>
    );
  }

  const nights = Math.max(
    1,
    Math.round(
      (new Date(trip.checkOut) - new Date(trip.checkIn)) /
        (1000 * 60 * 60 * 24),
    ),
  );
  const roomTotal = trip.pricePerNight * nights * (trip.rooms || 1);
  const taxes = Math.round(roomTotal * 0.1);
  const serviceFee = 20;
  const total = roomTotal + taxes + serviceFee;

  async function handleContinue(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/bookings", {
        propertyId: trip.propertyId,
        roomId: trip.roomId,
        checkIn: trip.checkIn,
        checkOut: trip.checkOut,
        guests: trip.guests,
        rooms: trip.rooms || 1,
        guestDetails: { name, email, phone },
      });

      navigate("/payment", { state: { booking: res.data.booking, trip } });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not create booking. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="booking-page">
      <div className="booking-container">
        <Link to={`/property/${trip.propertyId}`} className="booking-back">
          ← Back to property
        </Link>

        <h2 style={{ fontFamily: "Fraunces, serif", marginBottom: "24px" }}>
          Checkout
        </h2>

        {error && <div className="error-banner">{error}</div>}

        <div className="checkout-grid">
          <div className="checkout-form-card">
            <h3>Guest details</h3>
            <form onSubmit={handleContinue}>
              <div className="form-row">
                <label>Full name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="form-row-2">
                <div className="form-row">
                  <label>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="form-row">
                  <label>Phone</label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary-full"
                disabled={loading}
              >
                {loading ? "Processing..." : "Continue to payment"}
              </button>
            </form>
          </div>

          <div className="price-summary-card">
            <h3>{trip.propertyName}</h3>
            <p
              style={{
                fontSize: "13px",
                color: "#6b7d8f",
                marginBottom: "14px",
              }}
            >
              {trip.roomName} · {nights} night{nights > 1 ? "s" : ""}
            </p>
            <img
              src={trip.propertyImage}
              alt={trip.propertyName}
              style={{
                width: "100%",
                height: "140px",
                objectFit: "cover",
                borderRadius: "8px",
                marginBottom: "16px",
              }}
            />

            <div className="price-line">
              <span>Room total</span>
              <span>${roomTotal}</span>
            </div>
            <div className="price-line">
              <span>Taxes</span>
              <span>${taxes}</span>
            </div>
            <div className="price-line">
              <span>Service fee</span>
              <span>${serviceFee}</span>
            </div>
            <div className="price-line total">
              <span>Total</span>
              <span>${total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
