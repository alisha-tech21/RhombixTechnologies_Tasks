import { useState } from "react";
import { Lock, Shield, Bell, KeyRound } from "lucide-react";

function AccountSettings() {
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    specialOffers: true,
  });

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSavePassword = (e) => {
    e.preventDefault();
    alert("Password updated successfully!");
  };

  return (
    <div className="overview-wrapper">
      <div className="welcome-section">
        <h1>Account Settings</h1>
        <p>Manage your password, security preferences, and notifications.</p>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "30px",
          maxWidth: "800px",
        }}
      >
        {/* Change Password Card */}
        <div className="dashboard-section-card">
          <div className="section-header-flex" style={{ marginBottom: "20px" }}>
            <h3 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <KeyRound size={20} color="#0e7c86" /> Change Password
            </h3>
          </div>

          <form
            onSubmit={handleSavePassword}
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#475569",
                  marginBottom: "6px",
                }}
              >
                Current Password
              </label>
              <input
                type="password"
                name="currentPassword"
                value={passwords.currentPassword}
                onChange={handlePasswordChange}
                placeholder="••••••••"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "10px",
                  border: "1px solid #e2e8f0",
                  outline: "none",
                  fontSize: "14px",
                }}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#475569",
                    marginBottom: "6px",
                  }}
                >
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwords.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "10px",
                    border: "1px solid #e2e8f0",
                    outline: "none",
                    fontSize: "14px",
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#475569",
                    marginBottom: "6px",
                  }}
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwords.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "10px",
                    border: "1px solid #e2e8f0",
                    outline: "none",
                    fontSize: "14px",
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              className="view-booking-btn"
              style={{ width: "fit-content", marginTop: "10px" }}
            >
              Update Password
            </button>
          </form>
        </div>

        {/* Notifications Preference Card */}
        <div className="dashboard-section-card">
          <div className="section-header-flex" style={{ marginBottom: "20px" }}>
            <h3 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Bell size={20} color="#0e7c86" /> Notification Preferences
            </h3>
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <label
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#334155",
                }}
              >
                Email Booking Confirmations & Reminders
              </span>
              <input
                type="checkbox"
                checked={notifications.emailAlerts}
                onChange={() =>
                  setNotifications({
                    ...notifications,
                    emailAlerts: !notifications.emailAlerts,
                  })
                }
                style={{
                  width: "18px",
                  height: "18px",
                  accentColor: "#0e7c86",
                }}
              />
            </label>

            <label
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#334155",
                }}
              >
                SMS Alerts for Trips
              </span>
              <input
                type="checkbox"
                checked={notifications.smsAlerts}
                onChange={() =>
                  setNotifications({
                    ...notifications,
                    smsAlerts: !notifications.smsAlerts,
                  })
                }
                style={{
                  width: "18px",
                  height: "18px",
                  accentColor: "#0e7c86",
                }}
              />
            </label>

            <label
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#334155",
                }}
              >
                Special Offers & Travel Discounts
              </span>
              <input
                type="checkbox"
                checked={notifications.specialOffers}
                onChange={() =>
                  setNotifications({
                    ...notifications,
                    specialOffers: !notifications.specialOffers,
                  })
                }
                style={{
                  width: "18px",
                  height: "18px",
                  accentColor: "#0e7c86",
                }}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountSettings;
