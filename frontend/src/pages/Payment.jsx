import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import "../styles/Booking.css";

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { booking, trip } = location.state || {};

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!booking) {
    return (
      <div className="booking-page">
        <div className="booking-container">
          <p>
            No booking to pay for. <Link to="/explore">Browse stays</Link>
          </p>
        </div>
      </div>
    );
  }

  async function handlePay(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/payments/pay", {
        bookingId: booking._id,
        cardNumber,
        expiry,
        cvv,
        cardholderName,
      });

      navigate("/confirmation", { state: { booking: res.data.booking, trip } });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Payment failed. Please check your card details.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="booking-page">
      <div className="booking-container">
        <h2 style={{ fontFamily: "Fraunces, serif", marginBottom: "24px" }}>
          Secure Checkout
        </h2>

        {error && <div className="error-banner">{error}</div>}

        <div className="checkout-grid">
          <div className="checkout-form-card">
            <h3>Payment method</h3>
            <form onSubmit={handlePay}>
              <div className="form-row">
                <label>Cardholder name</label>
                <input
                  value={cardholderName}
                  onChange={(e) => setCardholderName(e.target.value)}
                  required
                />
              </div>
              <div className="form-row">
                <label>Card number</label>
                <input
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="4242 4242 4242 4242"
                  maxLength={19}
                  required
                />
              </div>
              <div className="form-row-2">
                <div className="form-row">
                  <label>Expiry</label>
                  <input
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    placeholder="MM/YY"
                    required
                  />
                </div>
                <div className="form-row">
                  <label>CVV</label>
                  <input
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    placeholder="123"
                    maxLength={4}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary-full"
                disabled={loading}
              >
                {loading
                  ? "Processing payment..."
                  : `Pay $${booking.priceSummary.total}`}
              </button>
            </form>
          </div>

          <div className="price-summary-card">
            <h3>Order summary</h3>
            <div className="price-line">
              <span>Room total</span>
              <span>${booking.priceSummary.roomTotal}</span>
            </div>
            <div className="price-line">
              <span>Taxes</span>
              <span>${booking.priceSummary.taxes}</span>
            </div>
            <div className="price-line">
              <span>Service fee</span>
              <span>${booking.priceSummary.serviceFee}</span>
            </div>
            <div className="price-line total">
              <span>Total</span>
              <span>${booking.priceSummary.total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
