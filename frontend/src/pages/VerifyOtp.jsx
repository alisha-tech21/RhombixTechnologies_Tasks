import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { ShieldCheck, ArrowLeft, Mail, Compass } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import "../styles/VerifyOtp.css";

function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState(location.state?.email || "");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleVerify(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/verify-otp", { email, otp });
      login(res.data.user, res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Verification failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setError("");
    setMessage("");
    try {
      await api.post("/auth/resend-otp", { email });
      setMessage("A new verification code has been sent to your email.");
    } catch (err) {
      setError(err.response?.data?.message || "Could not resend code.");
    }
  }

  return (
    <div className="otp-container">
      <div className="otp-card">
        {/* GlideAway Brand Header */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <Link
            to="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              textDecoration: "none",
              fontSize: "20px",
              fontWeight: "700",
              color: "#0a2540",
              fontFamily: "'Fraunces', serif",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                background: "#0e7c86",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
              }}
            >
              <Compass size={22} />
            </div>
            GlideAway
          </Link>
        </div>

        <div className="otp-header">
          <div className="otp-shield-icon">
            <ShieldCheck size={28} />
          </div>
          <h1>Verify Your Email</h1>
          <p>Please enter the 6-digit security code sent to your inbox.</p>
        </div>

        {error && <div className="otp-error-box">{error}</div>}
        {message && <div className="otp-success-box">{message}</div>}

        <form onSubmit={handleVerify} className="otp-form">
          <div className="otp-field">
            <label>Email Address</label>
            <div className="otp-input-box">
              <Mail size={18} className="otp-icon" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="otp-field-input"
              />
            </div>
          </div>

          <div className="otp-field">
            <label>Security Code</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              placeholder="••••••"
              required
              className="otp-code-input"
            />
          </div>

          <button type="submit" disabled={loading} className="otp-verify-btn">
            {loading ? "Verifying..." : "Verify Account"}
          </button>
        </form>

        <div className="otp-footer-actions">
          <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>
            Didn't receive code?{" "}
            <button onClick={handleResend} className="resend-action-btn">
              Resend Code
            </button>
          </p>
          <Link to="/login" className="otp-back-link">
            <ArrowLeft size={16} /> Return to login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default VerifyOtp;
