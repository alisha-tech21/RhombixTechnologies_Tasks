import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { KeyRound, ShieldCheck, ArrowLeft, Compass } from "lucide-react";
import api from "../api/axios";
import "../styles/ResetPassword.css"; // Agar CSS file hai, warna inline bhi use kar sakte hain

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState(location.state?.email || "");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      // Backend route check karein jo password reset ya verify karta ho
      await api.post("/auth/reset-password", {
        email,
        otp,
        newPassword,
      });
      setMessage("Password successfully reset! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to reset password. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="otp-container">
      <div className="otp-card">
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
          <h1>Reset Password</h1>
          <p>Enter the code from your email and your new password.</p>
        </div>

        {error && <div className="otp-error-box">{error}</div>}
        {message && <div className="otp-success-box">{message}</div>}

        <form onSubmit={handleSubmit} className="otp-form">
          <div className="otp-field">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="otp-field-input"
            />
          </div>

          <div className="otp-field">
            <label>6-Digit Code</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              placeholder="344257"
              required
              className="otp-code-input"
            />
          </div>

          <div className="otp-field">
            <label>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="otp-field-input"
            />
          </div>

          <button type="submit" disabled={loading} className="otp-verify-btn">
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <div
          className="otp-footer-actions"
          style={{ marginTop: "20px", textAlign: "center" }}
        >
          <Link to="/login" className="otp-back-link">
            <ArrowLeft size={16} /> Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
