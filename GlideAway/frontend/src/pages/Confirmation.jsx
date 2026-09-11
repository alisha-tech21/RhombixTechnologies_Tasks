import { useLocation, Link } from "react-router-dom";
import "../styles/Booking.css";

function Confirmation() {
  const location = useLocation();
  const { booking, trip } = location.state || {};

  if (!booking) {
    return (
      <div className="booking-page">
        <div className="booking-container">
          <p>
            No confirmation to show. <Link to="/">Go home</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page">
      <div className="booking-container">
        {/* Progress Indicator */}
        <div
          className="checkout-steps-indicator"
          style={{ marginBottom: "20px" }}
        >
          <div className="step-item completed">
            <span className="step-circle">✓</span>
            <span className="step-text">Selection</span>
          </div>
          <div className="step-line completed"></div>
          <div className="step-item completed">
            <span className="step-circle">✓</span>
            <span className="step-text">Details</span>
          </div>
          <div className="step-line completed"></div>
          <div className="step-item completed">
            <span className="step-circle">✓</span>
            <span className="step-text">Payment</span>
          </div>
          <div className="step-line completed"></div>
          <div className="step-item completed active">
            <span className="step-circle">✓</span>
            <span className="step-text">Confirm</span>
          </div>
        </div>

        <div className="confirm-wrap">
          <div className="confirm-check">✓</div>
          <h1>Booking confirmed!</h1>
          <p className="sub">
            Your trip is all set. A confirmation email is on its way.
          </p>

          <div className="confirm-card">
            <div className="confirm-row">
              <span>Booking ID</span>
              <strong>{booking.bookingRef}</strong>
            </div>
            <div className="confirm-row">
              <span>Property</span>
              <strong>{trip?.propertyName}</strong>
            </div>
            <div className="confirm-row">
              <span>Check-in</span>
              <strong>{new Date(booking.checkIn).toLocaleDateString()}</strong>
            </div>
            <div className="confirm-row">
              <span>Check-out</span>
              <strong>{new Date(booking.checkOut).toLocaleDateString()}</strong>
            </div>
            <div className="confirm-row">
              <span>Guests</span>
              <strong>{booking.guests}</strong>
            </div>
            <div className="confirm-row">
              <span>Total paid</span>
              <strong>${booking.priceSummary.total}</strong>
            </div>
          </div>

          <div className="confirm-actions">
            <Link to="/dashboard/bookings" className="primary">
              View My Booking
            </Link>
            <Link to="/" className="secondary">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Confirmation;
