import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MapPin,
  Globe,
  Link2,
  UserPlus,
  MessageCircle,
  Pencil,
  GraduationCap,
  Briefcase,
  MoreHorizontal,
  UserX,
  ShieldOff,
} from "lucide-react";
import { useRef } from "react";
import toast from "react-hot-toast";
import MainLayout from "../../components/layout/MainLayout";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { getAvatarUrl } from "../../utils/avatar";
import "../../styles/profile.css";

export default function Profile() {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [requestSent, setRequestSent] = useState(false);

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleBlock = async () => {
    if (
      !confirm(
        `Block ${profile.name}? They won't be able to view your profile or contact you.`,
      )
    )
      return;
    try {
      await api.put(`/users/block/${id}`);
      toast.success(`${profile.name} has been blocked`);
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to block user");
    }
  };

  useEffect(() => {
    setLoading(true);
    setError("");
    api
      .get(`/users/${id}`)
      .then((res) => setProfile(res.data.user))
      .catch((err) =>
        setError(err.response?.data?.message || "Could not load profile"),
      )
      .finally(() => setLoading(false));
  }, [id]);

  const sendFriendRequest = async () => {
    try {
      await api.post(`/friends/request/${id}`);
      setRequestSent(true);
      toast.success("Friend request sent");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not send request");
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <p style={{ textAlign: "center", color: "#94a3b8", marginTop: 40 }}>
          Loading profile...
        </p>
      </MainLayout>
    );
  }

  if (error || !profile) {
    return (
      <MainLayout>
        <p style={{ textAlign: "center", color: "#94a3b8", marginTop: 40 }}>
          {error}
        </p>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="profile-page">
        <div className="profile-cover">
          {profile.coverPhoto && (
            <img
              src={`${import.meta.env.VITE_SOCKET_URL}${profile.coverPhoto}`}
              alt="Cover"
            />
          )}
        </div>

        <div className="profile-header">
          <img
            className="profile-avatar-lg"
            src={getAvatarUrl(profile.profilePicture, profile.name)}
            alt={profile.name}
          />

          <div className="profile-header-info">
            <h1>{profile.name}</h1>
            {profile.username && (
              <p className="profile-username">@{profile.username}</p>
            )}
            {profile.professionalTitle && (
              <p className="profile-title">{profile.professionalTitle}</p>
            )}

            <div className="profile-meta-row">
              {profile.location && (
                <span>
                  <MapPin size={14} /> {profile.location}
                </span>
              )}
              <span>{profile.friendsCount} connections</span>
            </div>
          </div>

          <div className="profile-header-actions">
            {profile.isSelf ? (
              <button
                className="btn-primary"
                onClick={() => navigate("/edit-profile")}
              >
                <Pencil size={15} /> Edit Profile
              </button>
            ) : (
              <>
                {profile.isFriend ? (
                  <button className="btn-secondary" disabled>
                    <MessageCircle size={15} /> Friends
                  </button>
                ) : (
                  <button
                    className="btn-primary"
                    onClick={sendFriendRequest}
                    disabled={requestSent}
                  >
                    <UserPlus size={15} />{" "}
                    {requestSent ? "Request Sent" : "Add Friend"}
                  </button>
                )}

                <div className="profile-menu-wrap" ref={menuRef}>
                  <button
                    className="profile-menu-btn"
                    onClick={() => setMenuOpen((v) => !v)}
                  >
                    <MoreHorizontal size={18} />
                  </button>
                  {menuOpen && (
                    <div className="profile-menu-dropdown">
                      <button className="danger" onClick={handleBlock}>
                        <UserX size={14} /> Block {profile.name}
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {(profile.website || profile.githubUrl || profile.linkedinUrl) && (
          <div className="profile-card">
            <div className="profile-links-row">
              {profile.website && (
                <a href={profile.website} target="_blank" rel="noreferrer">
                  <Globe size={15} /> Website
                </a>
              )}
              {profile.githubUrl && (
                <a href={profile.githubUrl} target="_blank" rel="noreferrer">
                  <Link2 size={15} /> GitHub
                </a>
              )}
              {profile.linkedinUrl && (
                <a href={profile.linkedinUrl} target="_blank" rel="noreferrer">
                  <Link2 size={15} /> LinkedIn
                </a>
              )}
            </div>
          </div>
        )}

        {profile.bio && (
          <div className="profile-card">
            <h3>About</h3>
            <p className="profile-bio-text">{profile.bio}</p>
          </div>
        )}

        {profile.skills?.length > 0 && (
          <div className="profile-card">
            <h3>Skills</h3>
            <div className="profile-skills-list">
              {profile.skills.map((skill) => (
                <span key={skill} className="profile-skill-chip">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {profile.experience?.length > 0 && (
          <div className="profile-card">
            <h3>
              <Briefcase size={16} /> Experience
            </h3>
            {profile.experience.map((exp, i) => (
              <div className="profile-timeline-item" key={i}>
                <p className="timeline-title">{exp.jobTitle}</p>
                <p className="timeline-sub">{exp.company}</p>
                <p className="timeline-duration">{exp.duration}</p>
              </div>
            ))}
          </div>
        )}

        {profile.education?.length > 0 && (
          <div className="profile-card">
            <h3>
              <GraduationCap size={16} /> Education
            </h3>
            {profile.education.map((edu, i) => (
              <div className="profile-timeline-item" key={i}>
                <p className="timeline-title">{edu.degree}</p>
                <p className="timeline-sub">{edu.school}</p>
                <p className="timeline-duration">{edu.year}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
