import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Camera,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Plus,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

import api from "../../services/api";
import "../../styles/auth.css";

export default function Register() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");

  const [profileImage, setProfileImage] = useState(null);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const navigate = useNavigate();

  // Validates one field, returns an error string or "" if valid
  const validateField = (name, value, allValues = {}) => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Full name is required";
        if (value.trim().length < 2)
          return "Name must be at least 2 characters";
        return "";
      case "username":
        if (!value.trim()) return "Username is required";
        if (value.trim().length < 3)
          return "Username must be at least 3 characters";
        if (!/^[a-zA-Z0-9_]+$/.test(value))
          return "Only letters, numbers, and underscores allowed";
        return "";
      case "email":
        if (!value.trim()) return "Email is required";
        if (!/^\S+@\S+\.\S+$/.test(value)) return "Enter a valid email address";
        return "";
      case "password":
        if (!value) return "Password is required";
        if (value.length < 6) return "Password must be at least 6 characters";
        if (value.length > 15) return "Password cannot exceed 15 characters";
        return "";
      case "confirmPassword":
        if (!value) return "Please confirm your password";
        if (value !== (allValues.password ?? password))
          return "Passwords do not match";
        return "";
      default:
        return "";
    }
  };

  const validateAll = () => {
    const newErrors = {
      name: validateField("name", name),
      username: validateField("username", username),
      email: validateField("email", email),
      password: validateField("password", password),
      confirmPassword: validateField("confirmPassword", confirmPassword, {
        password,
      }),
    };
    setFieldErrors(newErrors);
    return newErrors;
  };

  const handleFieldChange = (name, value, setter) => {
    setter(value);
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
    // Live re-check confirmPassword when password changes, and vice versa
    if (name === "password" && confirmPassword) {
      setFieldErrors((prev) => ({
        ...prev,
        confirmPassword: validateField("confirmPassword", confirmPassword, {
          password: value,
        }),
      }));
    }
  };

  const handleBlur = (name, value) => {
    const errorMsg =
      name === "confirmPassword"
        ? validateField(name, value, { password })
        : validateField(name, value);
    setFieldErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const handleAddSkill = (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const skill = skillInput.trim();
    if (!skill) return;
    if (skills.includes(skill)) {
      setSkillInput("");
      return;
    }
    if (skills.length >= 6) {
      setError("You can add up to 6 skills.");
      return;
    }
    setSkills([...skills, skill]);
    setSkillInput("");
    setError("");
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("Profile image must be less than 2MB.");
      return;
    }
    setProfileImage(URL.createObjectURL(file));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const errors = validateAll();
    const hasErrors = Object.values(errors).some((msg) => msg);
    if (hasErrors) {
      setError("Please fix the highlighted fields below.");
      return;
    }

    if (!agreeTerms) {
      setError("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/register", {
        name,
        username,
        email,
        password,
        bio,
        skills,
      });

      toast.success("Account created successfully!");
      navigate("/login");
    } catch (err) {
      const message =
        err.response?.data?.message || "Registration failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="register-page">
      <div className="decor decor-top"></div>
      <div className="decor decor-bottom"></div>

      <section className="register-wrapper">
        <div className="register-brand">
          <h1>Connectify</h1>
          <p>Connect. Share. Grow together.</p>
        </div>

        <div className="register-card">
          <form onSubmit={handleSubmit} noValidate>
            <div className="profile-form-top">
              <label className="profile-upload">
                {profileImage ? (
                  <img src={profileImage} alt="Profile preview" />
                ) : (
                  <>
                    <Camera size={20} />
                    <span>Photo</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>

              <div className="top-fields">
                <div className="field-group">
                  <label htmlFor="name">Full Name</label>
                  <div className="input-wrapper">
                    <User size={13} />
                    <input
                      id="name"
                      type="text"
                      placeholder="e.g. Alex Rivera"
                      value={name}
                      onChange={(e) =>
                        handleFieldChange("name", e.target.value, setName)
                      }
                      onBlur={(e) => handleBlur("name", e.target.value)}
                      className={fieldErrors.name ? "field-invalid" : ""}
                      autoComplete="name"
                    />
                  </div>
                  {fieldErrors.name && (
                    <span className="field-error-msg">{fieldErrors.name}</span>
                  )}
                </div>

                <div className="field-group">
                  <label htmlFor="username">Username</label>
                  <div className="input-wrapper">
                    <span className="username-icon">@</span>
                    <input
                      id="username"
                      type="text"
                      placeholder="alex_rivera"
                      value={username}
                      onChange={(e) =>
                        handleFieldChange(
                          "username",
                          e.target.value,
                          setUsername,
                        )
                      }
                      onBlur={(e) => handleBlur("username", e.target.value)}
                      className={fieldErrors.username ? "field-invalid" : ""}
                    />
                  </div>
                  {fieldErrors.username && (
                    <span className="field-error-msg">
                      {fieldErrors.username}
                    </span>
                  )}
                </div>

                <div className="field-group full-width">
                  <label htmlFor="email">Email Address</label>
                  <div className="input-wrapper">
                    <Mail size={13} />
                    <input
                      id="email"
                      type="email"
                      placeholder="alex@company.com"
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
              </div>
            </div>

            <div className="form-separator"></div>

            <div className="password-row">
              <div className="field-group">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <Lock size={13} />
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
                      // Confirm password ko bhi turant re-check karo
                      if (confirmPassword) {
                        setFieldErrors((prev) => ({
                          ...prev,
                          confirmPassword: validateField(
                            "confirmPassword",
                            confirmPassword,
                            { password: value },
                          ),
                        }));
                      }
                    }}
                    className={fieldErrors.password ? "field-invalid" : ""}
                    autoComplete="new-password"
                    maxLength={15}
                  />
                  <button
                    type="button"
                    className="eye-button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <span className="field-error-msg">
                    {fieldErrors.password}
                  </span>
                )}
              </div>

              <div className="field-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="input-wrapper">
                  <Lock size={13} />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) =>
                      handleFieldChange(
                        "confirmPassword",
                        e.target.value,
                        setConfirmPassword,
                      )
                    }
                    onBlur={(e) =>
                      handleBlur("confirmPassword", e.target.value)
                    }
                    className={
                      fieldErrors.confirmPassword ? "field-invalid" : ""
                    }
                    autoComplete="new-password"
                    maxLength={15}
                  />
                  <button
                    type="button"
                    className="eye-button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={13} />
                    ) : (
                      <Eye size={13} />
                    )}
                  </button>
                </div>
                {fieldErrors.confirmPassword && (
                  <span className="field-error-msg">
                    {fieldErrors.confirmPassword}
                  </span>
                )}
              </div>
            </div>

            <div className="field-group skills-group">
              <label>Skills & Technologies</label>
              <div className="skills-input">
                {skills.map((skill) => (
                  <span className="skill-tag" key={skill}>
                    {skill}
                    <button type="button" onClick={() => removeSkill(skill)}>
                      <X size={10} />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  placeholder={
                    skills.length === 0
                      ? "React, Node.js, MongoDB..."
                      : "Add skill..."
                  }
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleAddSkill}
                />
                <Plus size={13} />
              </div>
              <small>Press Enter to add a skill</small>
            </div>

            <div className="field-group">
              <label htmlFor="bio">Professional Bio</label>
              <textarea
                id="bio"
                placeholder="Tell us about your stack, projects, or what you're building..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={300}
              />
            </div>

            <label className="terms">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
              />
              <span>
                I agree to the <a href="#terms">Terms of Service</a> and{" "}
                <a href="#privacy">Privacy Policy</a>. I understand that my
                profile will be visible to the Connectify community.
              </span>
            </label>

            {error && (
              <div className="auth-error" role="alert">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="create-account-button"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
              {!loading && <ArrowRight size={15} />}
            </button>
          </form>

          <p className="already-member">
            Already a member? <Link to="/login">Sign In</Link>
          </p>
        </div>

        <div className="register-footer">
          <span>🔒 Secure Encryption</span>
          <span>● GDPR Compliant</span>
        </div>
      </section>
    </main>
  );
}
