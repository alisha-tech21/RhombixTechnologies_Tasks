import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";
import "../../styles/auth.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      await api.post("/auth/forgot-password", { email });

      setMessage(
        "If an account exists with this email, a password reset link has been sent.",
      );

      toast.success("Check your email");
      setEmail("");
    } catch (err) {
      setMessage(
        err.response?.data?.message ||
          "Unable to process your request. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card password-card">
        {/* Brand */}
        <div className="auth-brand">
          <div className="brand-icon">C</div>
          <span>Connectify</span>
        </div>

        {/* Heading */}
        <div className="auth-heading">
          <h1>Forgot Password?</h1>

          <p>
            Enter your email address and we'll send you a link to reset your
            password.
          </p>
        </div>

        {/* Success / Error message */}
        {message && <div className="auth-message">{message}</div>}

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>

            <div className="input-box">
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link →"}
          </button>
        </form>

        {/* Back to Login */}
        <div className="auth-switch">
          <Link to="/login">← Back to Login</Link>
        </div>

        {/* Security */}
        <div className="auth-security">
          🔒 Secure &nbsp;&nbsp; • &nbsp;&nbsp; Your information is protected
        </div>
      </div>
    </div>
  );
}
