import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";
import "../../styles/auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const { login } = useAuth();
  const navigate = useNavigate();

  // Validates one field, returns an error string or "" if valid
  const validateField = (name, value) => {
    switch (name) {
      case "email":
        if (!value.trim()) return "Email is required";
        if (!/^\S+@\S+\.\S+$/.test(value)) return "Enter a valid email address";
        return "";
      case "password":
        if (!value) return "Password is required";
        if (value.length < 6) return "Password must be at least 6 characters";
        if (value.length > 15) return "Password cannot exceed 15 characters";
        return "";
      default:
        return "";
    }
  };

  // Runs validation on every field, returns the full errors object
  const validateAll = () => {
    const newErrors = {
      email: validateField("email", email),
      password: validateField("password", password),
    };
    setFieldErrors(newErrors);
    return newErrors;
  };

  // Clears a single field's error as soon as the user edits it
  const handleFieldChange = (name, value, setter) => {
    setter(value);
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Re-validates a field when the user leaves it
  const handleBlur = (name, value) => {
    setFieldErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const errors = validateAll();
    const hasErrors = Object.values(errors).some((msg) => msg);
    if (hasErrors) return;

    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back!");
      navigate("/");
    } catch (err) {
      const message =
        err.response?.data?.message || "Invalid email or password";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-brand">
          <div className="brand-icon">C</div>
          <span>Connectify</span>
        </div>

        <div className="auth-heading">
          <h1>Welcome Back</h1>
          <p>Enter your credentials to access your account</p>
        </div>

        {error && (
          <div className="auth-error" role="alert">
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-box">
              <Mail size={16} />
              <input
                id="email"
                type="email"
                placeholder="alex@developer.com"
                value={email}
                onChange={(e) =>
                  handleFieldChange("email", e.target.value, setEmail)
                }
                onBlur={(e) => handleBlur("email", e.target.value)}
                className={fieldErrors.email ? "field-invalid" : ""}
                autoComplete="email"
              />
            </div>
            {fieldErrors.email && (
              <span className="field-error-msg">{fieldErrors.email}</span>
            )}
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-box">
              <Lock size={16} />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  const value = e.target.value;
                  setPassword(value);
                  setFieldErrors((prev) => ({
                    ...prev,
                    password: validateField("password", value),
                  }));
                }}
                className={fieldErrors.password ? "field-invalid" : ""}
                autoComplete="current-password"
                maxLength={15}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {fieldErrors.password && (
              <span className="field-error-msg">{fieldErrors.password}</span>
            )}
          </div>

          <div className="auth-options">
            <label className="remember-me">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember me</span>
            </label>
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? "Logging in..." : "Login to Account"}
          </button>
        </form>

        <div className="auth-divider">
          <span></span>
          <p>OR</p>
          <span></span>
        </div>

        <button
          type="button"
          className="google-button"
          disabled
          title="Google authentication will be added later"
        >
          <span className="google-letter">G</span>
          Continue with Google
        </button>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Create Account</Link>
        </p>

        <p className="auth-security">
          🔒 Your information is securely protected
        </p>
      </section>
    </main>
  );
}
