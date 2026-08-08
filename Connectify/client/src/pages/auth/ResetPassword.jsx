import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";
import "../../styles/auth.css";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      await api.put(`/auth/reset-password/${token}`, {
        password,
        confirmPassword,
      });

      toast.success("Password reset successfully!");

      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Password reset failed. The link may be invalid or expired.",
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
          <h1>Reset Password</h1>

          <p>
            Choose a strong, unique password to secure your Connectify account.
          </p>
        </div>

        {/* Error */}
        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          {/* New Password */}
          <div className="form-group">
            <label htmlFor="password">New Password</label>

            <div className="input-box">
              <input
                id="password"
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>

            <div className="input-box">
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>
          </div>

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password →"}
          </button>
        </form>

        <div className="auth-switch">
          <Link to="/login">← Back to Login</Link>
        </div>

        <div className="auth-security">
          🔒 Secure Encryption &nbsp;&nbsp; • &nbsp;&nbsp; Protected Account
        </div>
      </div>
    </div>
  );
}
