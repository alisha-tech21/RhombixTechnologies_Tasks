import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import "../styles/Booking.css";

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { booking, trip } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState("card");
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
        paymentMethod,
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
          <div className="step-line active"></div>
          <div className="step-item active">
            <span className="step-circle">3</span>
            <span className="step-text">Payment</span>
          </div>
          <div className="step-line"></div>
          <div className="step-item">
            <span className="step-circle">4</span>
            <span className="step-text">Confirm</span>
          </div>
        </div>

        <h2 style={{ fontFamily: "Fraunces, serif", marginBottom: "6px" }}>
          Secure Checkout
        </h2>
        <p style={{ color: "#6b7d8f", fontSize: "14px", marginBottom: "24px" }}>
          Complete your booking for an unforgettable experience.
        </p>

        {error && <div className="error-banner">{error}</div>}

        <div className="checkout-grid">
          <div className="checkout-form-card">
            <h3>Payment Method</h3>

            {/* Payment Tabs Selection */}
            <div className="payment-tabs">
              <button
                type="button"
                className={`payment-tab-btn ${paymentMethod === "card" ? "active" : ""}`}
                onClick={() => setPaymentMethod("card")}
              >
                💳 Credit Card
              </button>
              <button
                type="button"
                className={`payment-tab-btn ${paymentMethod === "paypal" ? "active" : ""}`}
                onClick={() => setPaymentMethod("paypal")}
              >
                🅿️ PayPal
              </button>
            </div>

            <form onSubmit={handlePay}>
              {paymentMethod === "card" ? (
                <>
                  <div className="form-row">
                    <label>Cardholder name</label>
                    <input
                      value={cardholderName}
                      onChange={(e) => setCardholderName(e.target.value)}
                      placeholder="JOHN DOE"
                      required
                    />
                  </div>
                  <div className="form-row">
                    <label>Card number</label>
                    <input
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="0000 0000 0000 0000"
                      maxLength={19}
                      required
                    />
                  </div>
                  <div className="form-row-2">
                    <div className="form-row">
                      <label>Expiry Date</label>
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
                </>
              ) : (
                <div
                  style={{
                    padding: "20px 0",
                    textAlign: "center",
                    color: "#4a6079",
                  }}
                >
                  <p>
                    You will be redirected to PayPal securely to complete your
                    payment.
                  </p>
                </div>
              )}

              <p className="encryption-note">
                🔒 Your payment information is encrypted and secure.
              </p>

              <button
                type="submit"
                className="btn-primary-full"
                disabled={loading}
              >
                {loading ? "Processing payment..." : `Confirm Booking →`}
              </button>
            </form>
          </div>

          <div className="price-summary-card">
            <h3>Booking Summary</h3>
            <div
              className="summary-trip-info"
              style={{
                borderBottom: "1px solid #f1f5f9",
                paddingBottom: "12px",
                marginBottom: "12px",
              }}
            >
              <h4>{trip?.propertyName}</h4>
              <p className="summary-subtext">
                📅 {new Date(booking.checkIn).toLocaleDateString()} -{" "}
                {new Date(booking.checkOut).toLocaleDateString()}
              </p>
              <p className="summary-subtext">👥 {booking.guests} Guests</p>
            </div>

            <div className="price-line">
              <span>Room total</span>
              <span>${booking.priceSummary.roomTotal}</span>
            </div>
            <div className="price-line">
              <span>Taxes & Fees</span>
              <span>${booking.priceSummary.taxes}</span>
            </div>
            <div className="price-line">
              <span>Service fee</span>
              <span>${booking.priceSummary.serviceFee}</span>
            </div>
            <div className="price-line total">
              <span>Total Due</span>
              <span>${booking.priceSummary.total} USD</span>
            </div>
            <p className="terms-note">
              By confirming, you agree to our Terms of Service and Cancellation
              Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
