import { useState, useEffect, useRef } from "react";
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
  FolderGit2,
  Mail,
} from "lucide-react";
import toast from "react-hot-toast";
import MainLayout from "../../components/layout/MainLayout";
import ProjectCard from "../../components/profile/ProjectCard";
import ProjectModal from "../../components/profile/ProjectModal";
import api from "../../services/api";
import { getAvatarUrl } from "../../utils/avatar";
import "../../styles/profile.css";

export default function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [requestSent, setRequestSent] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [projectModal, setProjectModal] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    setError("");
    Promise.all([api.get(`/users/${id}`), api.get(`/projects/user/${id}`)])
      .then(([userRes, projectRes]) => {
        setProfile(userRes.data.user);
        setProjects(projectRes.data.projects);
      })
      .catch((err) =>
        setError(err.response?.data?.message || "Could not load profile"),
      )
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sendFriendRequest = async () => {
    try {
      await api.post(`/friends/request/${id}`);
      setRequestSent(true);
      toast.success("Friend request sent");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not send request");
    }
  };

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

  const handleProjectDelete = async (projectId) => {
    if (!confirm("Delete this project?")) return;
    try {
      await api.delete(`/projects/${projectId}`);
      setProjects((prev) => prev.filter((p) => p._id !== projectId));
      toast.success("Project deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete project");
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

  const hasContact =
    profile.email ||
    profile.website ||
    profile.githubUrl ||
    profile.linkedinUrl;

  return (
    <MainLayout hideRightSidebar>
      <div className="profile-page">
        {/* ---------- LinkedIn-style cover + overlapping avatar header ---------- */}
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
                  <button
                    className="btn-secondary"
                    onClick={() => navigate(`/messages?user=${profile._id}`)}
                  >
                    <MessageCircle size={15} /> Message
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

        {/* ---------- About + Contact ---------- */}
        <div className="profile-row-2col">
          {profile.bio && (
            <div className="profile-card">
              <h3>About</h3>
              <p className="profile-bio-text">{profile.bio}</p>
            </div>
          )}

          {hasContact && (
            <div className="profile-card">
              <h3>Contact</h3>
              <div className="profile-contact-list">
                {profile.email && (
                  <div className="profile-contact-item">
                    <Mail size={14} />
                    <span>{profile.email}</span>
                  </div>
                )}
                {profile.website && (
                  <a
                    className="profile-contact-item"
                    href={profile.website}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Globe size={14} />
                    <span>Website</span>
                  </a>
                )}
                {profile.githubUrl && (
                  <a
                    className="profile-contact-item"
                    href={profile.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Link2 size={14} />
                    <span>GitHub</span>
                  </a>
                )}
                {profile.linkedinUrl && (
                  <a
                    className="profile-contact-item"
                    href={profile.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Link2 size={14} />
                    <span>LinkedIn</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {profile.skills?.length > 0 && (
          <div className="profile-card">
            <h3>Skills & Technologies</h3>
            <div className="profile-skills-list">
              {profile.skills.map((skill) => (
                <span key={skill} className="profile-skill-chip">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {(profile.experience?.length > 0 || profile.education?.length > 0) && (
          <div className="profile-row-2col">
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
        )}
        {projects.length > 0 && (
          <div className="profile-card">
            <div className="profile-section-header">
              <h3>
                <FolderGit2 size={16} /> Projects
              </h3>
            </div>

            <div className="projects-grid">
              {projects.map((project) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  isOwner={profile.isSelf}
                  onEdit={(p) => setProjectModal(p)}
                  onDelete={handleProjectDelete}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {projectModal && (
        <ProjectModal
          project={projectModal === "new" ? null : projectModal}
          onClose={() => setProjectModal(null)}
          onSaved={(p) =>
            setProjects((prev) => prev.map((x) => (x._id === p._id ? p : x)))
          }
        />
      )}
    </MainLayout>
  );
}
