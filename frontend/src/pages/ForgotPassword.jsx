import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ArrowLeft, KeyRound, CheckCircle2, Compass } from "lucide-react";
import api from "../api/axios";
import "../styles/ForgotPassword.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await api.post("/auth/forgot-password", { email });
      // Successfully code send hone ke baad user ko email state ke sath reset-password page par bhej dein
      navigate("/reset-password", { state: { email } });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to send reset link. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fp-container">
      <div className="fp-card">
        {/* Brand Header */}
        <div className="fp-brand-header">
          <Link to="/" className="fp-brand-logo">
            <div className="fp-logo-icon">
              <Compass size={22} />
            </div>
            <span>GlideAway</span>
          </Link>
        </div>

        <div className="fp-header">
          <div className="fp-icon-box">
            <KeyRound size={24} />
          </div>
          <h1>Forgot Password?</h1>
          <p>No worries, enter your email and we'll send reset instructions.</p>
        </div>

        {error && <div className="fp-error">{error}</div>}

        {isSubmitted ? (
          <div className="fp-success-container">
            <div className="fp-success">
              <CheckCircle2 size={20} />
              <span>{message}</span>
            </div>
            <p className="fp-spam-hint">
              Didn't receive the email? Check your spam folder or try again.
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="fp-secondary-btn"
            >
              Try another email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="fp-form">
            <div className="fp-field">
              <label>Email Address</label>
              <div className="fp-input-wrapper">
                <Mail size={18} className="fp-input-icon" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="fp-input"
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="fp-submit-btn">
              {loading ? "Sending instructions..." : "Send Reset Link"}
            </button>
          </form>
        )}

        <div className="fp-footer">
          <Link to="/login" className="fp-back-link">
            <ArrowLeft size={16} /> Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
