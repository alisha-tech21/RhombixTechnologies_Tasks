import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  Shield,
  Lock,
  Trash2,
  Download,
  UserX,
  Check,
} from "lucide-react";
import toast from "react-hot-toast";
import MainLayout from "../../components/layout/MainLayout";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { getAvatarUrl } from "../../utils/avatar";
import "../../styles/settings.css";

const TABS = [
  { key: "privacy", label: "Privacy", icon: Eye },
  { key: "blocked", label: "Blocked Users", icon: UserX },
  { key: "account", label: "Account", icon: Shield },
];

export default function Settings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("privacy");

  // ---- Privacy state ----
  const [profileVisibility, setProfileVisibility] = useState("public");
  const [postsVisibility, setPostsVisibility] = useState("public");
  const [savingPrivacy, setSavingPrivacy] = useState(false);

  // ---- Blocked users state ----
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [loadingBlocked, setLoadingBlocked] = useState(true);

  // ---- Password state ----
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  // ---- Delete account state ----
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    api.get(`/users/${user._id}`).then((res) => {
      setProfileVisibility(
        res.data.user.privacy?.profileVisibility || "public",
      );
      setPostsVisibility(res.data.user.privacy?.postsVisibility || "public");
    });
  }, [user._id]);

  useEffect(() => {
    if (tab === "blocked") {
      setLoadingBlocked(true);
      api
        .get("/users/blocked/all")
        .then((res) => setBlockedUsers(res.data.blockedUsers))
        .finally(() => setLoadingBlocked(false));
    }
  }, [tab]);

  const savePrivacy = async () => {
    setSavingPrivacy(true);
    try {
      await api.put("/users/privacy", { profileVisibility, postsVisibility });
      toast.success("Privacy settings updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update settings");
    } finally {
      setSavingPrivacy(false);
    }
  };

  const unblockUser = async (id) => {
    try {
      await api.put(`/users/unblock/${id}`);
      setBlockedUsers((prev) => prev.filter((u) => u._id !== id));
      toast.success("User unblocked");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      toast.error("New passwords do not match");
      return;
    }
    setChangingPassword(true);
    try {
      await api.put("/users/change-password", { currentPassword, newPassword });
      toast.success("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  const handleExportData = async () => {
    try {
      const res = await api.get("/users/export-data", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = "connectify-data-export.json";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Your data export has started downloading");
    } catch {
      toast.error("Failed to export data");
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    if (deleteConfirmText !== "DELETE") {
      toast.error('Please type "DELETE" to confirm');
      return;
    }
    setDeleting(true);
    try {
      await api.delete("/users/account", {
        data: { password: deletePassword },
      });
      toast.success("Account deleted. Goodbye!");
      logout();
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete account");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <MainLayout hideRightSidebar>
      <div className="settings-header">
        <h2>Settings</h2>
        <p>
          Manage how your data is shared and who can see your activity on
          Connectify.
        </p>
      </div>

      <div className="settings-layout">
        <div className="settings-tabs">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              className={tab === key ? "active" : ""}
              onClick={() => setTab(key)}
            >
              <Icon size={16} /> {label}
            </button>
          ))}
        </div>

        <div className="settings-content">
          {/* ---------- PRIVACY TAB ---------- */}
          {tab === "privacy" && (
            <div className="settings-card">
              <div className="settings-card-header">
                <Eye size={18} />
                <div>
                  <h3>Profile Visibility</h3>
                  <p>Control who can discover and view your profile.</p>
                </div>
              </div>

              {["public", "friends", "private"].map((option) => (
                <label
                  key={option}
                  className={`settings-radio-option ${profileVisibility === option ? "selected" : ""}`}
                >
                  <input
                    type="radio"
                    name="profileVisibility"
                    checked={profileVisibility === option}
                    onChange={() => setProfileVisibility(option)}
                  />
                  <div>
                    <p className="option-title">
                      {option === "public"
                        ? "Public"
                        : option === "friends"
                          ? "Friends Only"
                          : "Private"}
                    </p>
                    <p className="option-desc">
                      {option === "public" &&
                        "Anyone on Connectify can view your profile."}
                      {option === "friends" &&
                        "Only your friends can see your full profile details."}
                      {option === "private" &&
                        "Hide your profile from non-friends entirely."}
                    </p>
                  </div>
                  {profileVisibility === option && (
                    <Check size={16} className="option-check" />
                  )}
                </label>
              ))}

              <div className="settings-card-header" style={{ marginTop: 24 }}>
                <Shield size={18} />
                <div>
                  <h3>Posts Visibility (Default)</h3>
                  <p>The default audience for new posts you create.</p>
                </div>
              </div>

              {["public", "friends", "private"].map((option) => (
                <label
                  key={option}
                  className={`settings-radio-option ${postsVisibility === option ? "selected" : ""}`}
                >
                  <input
                    type="radio"
                    name="postsVisibility"
                    checked={postsVisibility === option}
                    onChange={() => setPostsVisibility(option)}
                  />
                  <div>
                    <p className="option-title">
                      {option === "public"
                        ? "Public"
                        : option === "friends"
                          ? "Friends Only"
                          : "Only Me"}
                    </p>
                  </div>
                  {postsVisibility === option && (
                    <Check size={16} className="option-check" />
                  )}
                </label>
              ))}

              <button
                className="settings-save-btn"
                onClick={savePrivacy}
                disabled={savingPrivacy}
              >
                {savingPrivacy ? "Saving..." : "Save Privacy Settings"}
              </button>
            </div>
          )}

          {/* ---------- BLOCKED USERS TAB ---------- */}
          {tab === "blocked" && (
            <div className="settings-card">
              <div className="settings-card-header">
                <UserX size={18} />
                <div>
                  <h3>Blocked Users</h3>
                  <p>
                    Users you've blocked can't view your profile or contact you.
                  </p>
                </div>
              </div>

              {loadingBlocked ? (
                <p className="settings-empty">Loading...</p>
              ) : blockedUsers.length === 0 ? (
                <p className="settings-empty">You haven't blocked anyone.</p>
              ) : (
                blockedUsers.map((u) => (
                  <div className="blocked-user-row" key={u._id}>
                    <img
                      src={getAvatarUrl(u.profilePicture, u.name)}
                      alt={u.name}
                    />
                    <div style={{ flex: 1 }}>
                      <p className="option-title">{u.name}</p>
                      {u.bio && <p className="option-desc">{u.bio}</p>}
                    </div>
                    <button
                      className="btn-secondary"
                      onClick={() => unblockUser(u._id)}
                    >
                      Unblock
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ---------- ACCOUNT TAB ---------- */}
          {tab === "account" && (
            <>
              <div className="settings-card">
                <div className="settings-card-header">
                  <Lock size={18} />
                  <div>
                    <h3>Change Password</h3>
                    <p>
                      Choose a strong, unique password to keep your account
                      secure.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleChangePassword}>
                  <div className="settings-field">
                    <label>Current Password</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="settings-field">
                    <label>New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>
                  <div className="settings-field">
                    <label>Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="settings-save-btn"
                    disabled={changingPassword}
                  >
                    {changingPassword ? "Changing..." : "Change Password"}
                  </button>
                </form>
              </div>

              <div className="settings-card">
                <div className="settings-card-header">
                  <Download size={18} />
                  <div>
                    <h3>Download Your Data</h3>
                    <p>
                      Get a copy of your profile, posts, and connections in JSON
                      format.
                    </p>
                  </div>
                </div>
                <button className="btn-secondary" onClick={handleExportData}>
                  <Download size={14} /> Export Data
                </button>
              </div>

              <div className="settings-card danger-zone">
                <div className="settings-card-header">
                  <Trash2 size={18} color="#dc2626" />
                  <div>
                    <h3 style={{ color: "#dc2626" }}>Danger Zone</h3>
                    <p>
                      Permanently delete your Connectify account and all
                      associated data. This cannot be undone.
                    </p>
                  </div>
                </div>

                {!showDeleteConfirm ? (
                  <button
                    className="btn-danger"
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    Delete Account
                  </button>
                ) : (
                  <form
                    onSubmit={handleDeleteAccount}
                    className="delete-confirm-form"
                  >
                    <div className="settings-field">
                      <label>Enter your password to confirm</label>
                      <input
                        type="password"
                        value={deletePassword}
                        onChange={(e) => setDeletePassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="settings-field">
                      <label>
                        Type <strong>DELETE</strong> to confirm
                      </label>
                      <input
                        type="text"
                        value={deleteConfirmText}
                        onChange={(e) => setDeleteConfirmText(e.target.value)}
                        required
                      />
                    </div>
                    <div style={{ display: "flex", gap: 10 }}>
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => setShowDeleteConfirm(false)}
                        disabled={deleting}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn-danger"
                        disabled={deleting}
                      >
                        {deleting
                          ? "Deleting..."
                          : "Permanently Delete My Account"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
