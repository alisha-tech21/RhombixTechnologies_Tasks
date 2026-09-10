import React, { useState } from "react";
import { Compass, CheckCircle2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../styles/Auth.css";

export default function SignUp() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/register", {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
      });
      // Registration sends an OTP email instead of logging in directly —
      // send the user to verify with their email pre-filled.
      navigate("/verify-otp", { state: { email: res.data.email } });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-overlay-container">
      <div className="auth-left-content">
        <a href="/" className="auth-brand-logo">
          <Compass size={36} color="#ffffff" /> GlideAway
        </a>
        <div className="auth-hero-text">
          <h2>It's time to boost your next adventure</h2>
          <p>
            Create your account and unlock member fares, saved trips, and
            exclusive travel guides.
          </p>
        </div>

        <div className="auth-features-list">
          <div className="auth-feature-item">
            <CheckCircle2 size={18} color="#0e7c86" /> Save unlimited trips &
            custom itineraries
          </div>
          <div className="auth-feature-item">
            <CheckCircle2 size={18} color="#0e7c86" /> Get instant access to
            secret member deals
          </div>
          <div className="auth-feature-item">
            <CheckCircle2 size={18} color="#0e7c86" /> Fast & secure checkout
            for all your bookings
          </div>
        </div>
      </div>

      <div className="auth-right-form">
        <h3>Sign up</h3>
        <p className="auth-subtitle">
          Join GlideAway to save trips and check out fast.
        </p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="auth-group">
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              placeholder="Your Name Here"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>

          <div className="auth-group">
            <label>E-mail</label>
            <input
              type="email"
              name="email"
              placeholder="E-mail Address"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="auth-group" style={{ position: "relative" }}>
            <label>Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              style={{ paddingRight: "45px" }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "15px",
                top: "36px",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#334e68",
                display: "flex",
                alignItems: "center",
                padding: 0,
              }}
              aria-label="Toggle password visibility"
            >
              {showPassword ? (
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                </svg>
              ) : (
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>

          <div className="auth-extras">
            <label className="remember-me">
              <input type="checkbox" /> Remember me
            </label>
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <div
          style={{
            marginTop: "20px",
            textAlign: "center",
            fontSize: "13px",
            color: "#243b53",
          }}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            style={{
              color: "#0e7c86",
              fontWeight: "700",
              textDecoration: "none",
            }}
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
