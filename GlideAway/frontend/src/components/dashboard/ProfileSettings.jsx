import { useState } from "react";
import { User, Mail, Phone, MapPin, Save } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";

function ProfileSettings() {
  const { user, login } = useAuth();
  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const res = await api.patch("/users/me", {
        name: formData.fullName,
        phone: formData.phone,
      });
      // Refresh the session's cached user so the sidebar/greeting update too.
      const token = localStorage.getItem("ga_token");
      login(res.data.user, token);
      setMessage("Profile updated successfully!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="overview-wrapper">
      <div className="welcome-section">
        <h1>My Profile</h1>
        <p>Manage your personal information and preferences.</p>
      </div>

      <div className="dashboard-section-card" style={{ maxWidth: "800px" }}>
        <div
          className="profile-header-flex"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginBottom: "30px",
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80"
            alt="Profile"
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid #0e7c86",
            }}
          />
          <div>
            <h3
              style={{
                fontFamily: "Fraunces, serif",
                margin: "0 0 4px 0",
                color: "#0a2540",
              }}
            >
              {formData.fullName}
            </h3>
            <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>
              Traveler Account
            </p>
          </div>
        </div>

        {message && (
          <p
            style={{
              color: message.includes("success") ? "#0e7c86" : "#e04e30",
              fontSize: "13px",
              marginBottom: "16px",
            }}
          >
            {message}
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "20px" }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#475569",
                  marginBottom: "8px",
                }}
              >
                Full Name
              </label>
              <div style={{ position: "relative" }}>
                <User
                  size={16}
                  style={{
                    position: "absolute",
                    left: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#64748b",
                  }}
                />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "12px 16px 12px 40px",
                    borderRadius: "10px",
                    border: "1px solid #e2e8f0",
                    outline: "none",
                    fontSize: "14px",
                  }}
                />
              </div>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#475569",
                  marginBottom: "8px",
                }}
              >
                Email Address
              </label>
              <div style={{ position: "relative" }}>
                <Mail
                  size={16}
                  style={{
                    position: "absolute",
                    left: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#64748b",
                  }}
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  title="Email can't be changed here"
                  style={{
                    width: "100%",
                    padding: "12px 16px 12px 40px",
                    borderRadius: "10px",
                    border: "1px solid #e2e8f0",
                    outline: "none",
                    fontSize: "14px",
                    background: "#f8fafc",
                    color: "#94a3b8",
                  }}
                />
              </div>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#475569",
                  marginBottom: "8px",
                }}
              >
                Phone Number
              </label>
              <div style={{ position: "relative" }}>
                <Phone
                  size={16}
                  style={{
                    position: "absolute",
                    left: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#64748b",
                  }}
                />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "12px 16px 12px 40px",
                    borderRadius: "10px",
                    border: "1px solid #e2e8f0",
                    outline: "none",
                    fontSize: "14px",
                  }}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="view-booking-btn"
            disabled={saving}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              width: "fit-content",
              padding: "12px 24px",
            }}
          >
            <Save size={16} /> {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProfileSettings;
