import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, MapPin, Globe, Link2, Plus, X, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { getAvatarUrl } from "../../utils/avatar";
import "../../styles/profile.css";

export default function EditProfile() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    professionalTitle: "",
    bio: "",
    location: "",
    website: "",
    githubUrl: "",
    linkedinUrl: "",
  });
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);
  const [saving, setSaving] = useState(false);

  const [profileFile, setProfileFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const profileInputRef = useRef(null);
  const coverInputRef = useRef(null);

  useEffect(() => {
    api.get(`/users/${user._id}`).then((res) => {
      const p = res.data.user;
      setForm({
        name: p.name || "",
        professionalTitle: p.professionalTitle || "",
        bio: p.bio || "",
        location: p.location || "",
        website: p.website || "",
        githubUrl: p.githubUrl || "",
        linkedinUrl: p.linkedinUrl || "",
      });
      setSkills(p.skills || []);
      setEducation(p.education || []);
      setExperience(p.experience || []);
    });
  }, [user._id]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const addSkill = (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const skill = skillInput.trim();
    if (!skill || skills.includes(skill)) {
      setSkillInput("");
      return;
    }
    setSkills([...skills, skill]);
    setSkillInput("");
  };

  const removeSkill = (skill) => setSkills(skills.filter((s) => s !== skill));

  const addEducation = () => {
    setEducation([...education, { degree: "", school: "", year: "" }]);
  };

  const updateEducation = (index, field, value) => {
    const updated = [...education];
    updated[index][field] = value;
    setEducation(updated);
  };

  const removeEducation = (index) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const addExperience = () => {
    setExperience([...experience, { jobTitle: "", company: "", duration: "" }]);
  };

  const updateExperience = (index, field, value) => {
    const updated = [...experience];
    updated[index][field] = value;
    setExperience(updated);
  };

  const removeExperience = (index) => {
    setExperience(experience.filter((_, i) => i !== index));
  };

  const handleProfileFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfileFile(file);
    setProfilePreview(URL.createObjectURL(file));
  };

  const handleCoverFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Upload profile picture first, if a new one was chosen
      if (profileFile) {
        const fd = new FormData();
        fd.append("image", profileFile);
        await api.put("/users/profile-picture", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      // Upload cover photo, if changed
      if (coverFile) {
        const fd = new FormData();
        fd.append("image", coverFile);
        await api.put("/users/cover-photo", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      // Save the rest of the profile fields
      const res = await api.put("/users/profile", {
        ...form,
        skills,
        education: education.filter((e) => e.degree && e.school),
        experience: experience.filter((e) => e.jobTitle && e.company),
      });

      setUser((prev) => ({ ...prev, ...res.data.user }));
      toast.success("Profile updated!");
      navigate(`/profile/${user._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="edit-profile-page">
      <div className="edit-profile-header">
        <span>Profile</span> <span>›</span>{" "}
        <span className="current">Edit Profile</span>
      </div>
      <h1 className="edit-profile-title">Edit Profile</h1>

      <div className="edit-profile-card">
        {/* Cover photo */}
        <div
          className="edit-cover-wrap"
          onClick={() => coverInputRef.current?.click()}
        >
          <img
            src={
              coverPreview
                ? coverPreview
                : user?.coverPhoto
                  ? `${import.meta.env.VITE_SOCKET_URL}${user.coverPhoto}`
                  : undefined
            }
            alt="Cover"
            style={{
              display: coverPreview || user?.coverPhoto ? "block" : "none",
            }}
          />
          <div className="edit-cover-overlay">
            <Camera size={18} /> Change cover
          </div>
          <input
            type="file"
            ref={coverInputRef}
            accept="image/*"
            hidden
            onChange={handleCoverFileChange}
          />

          <div
            className="edit-avatar-wrap"
            onClick={(e) => {
              e.stopPropagation();
              profileInputRef.current?.click();
            }}
          >
            <img
              src={
                profilePreview || getAvatarUrl(user?.profilePicture, user?.name)
              }
              alt={user?.name}
            />
            <div className="edit-avatar-overlay">
              <Camera size={16} />
            </div>
            <input
              type="file"
              ref={profileInputRef}
              accept="image/*"
              hidden
              onChange={handleProfileFileChange}
            />
          </div>
        </div>

        <div className="edit-profile-body">
          <div className="edit-row">
            <div className="edit-field">
              <label>Full Name</label>
              <input
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>
            <div className="edit-field">
              <label>Username</label>
              <input value={`@${user?.username || ""}`} disabled />
            </div>
          </div>

          <div className="edit-field">
            <label>Professional Title</label>
            <input
              value={form.professionalTitle}
              onChange={(e) =>
                handleChange("professionalTitle", e.target.value)
              }
              placeholder="e.g. Senior Full Stack Engineer"
            />
          </div>

          <div className="edit-field">
            <label>Bio</label>
            <textarea
              value={form.bio}
              onChange={(e) => handleChange("bio", e.target.value)}
              maxLength={300}
              rows={3}
            />
          </div>

          <div className="edit-row">
            <div className="edit-field">
              <label>
                <MapPin size={13} /> Location
              </label>
              <input
                value={form.location}
                onChange={(e) => handleChange("location", e.target.value)}
                placeholder="San Francisco, CA"
              />
            </div>
            <div className="edit-field">
              <label>
                <Globe size={13} /> Website
              </label>
              <input
                value={form.website}
                onChange={(e) => handleChange("website", e.target.value)}
                placeholder="https://yoursite.com"
              />
            </div>
          </div>

          <div className="edit-row">
            <div className="edit-field">
              <label>
                <Link2 size={13} /> GitHub URL
              </label>
              <input
                value={form.githubUrl}
                onChange={(e) => handleChange("githubUrl", e.target.value)}
                placeholder="https://github.com/you"
              />
            </div>
            <div className="edit-field">
              <label>
                <Link2 size={13} /> LinkedIn URL
              </label>
              <input
                value={form.linkedinUrl}
                onChange={(e) => handleChange("linkedinUrl", e.target.value)}
                placeholder="https://linkedin.com/in/you"
              />
            </div>
          </div>

          <div className="edit-field">
            <label>Skills</label>
            <div className="edit-skills-box">
              {skills.map((skill) => (
                <span className="profile-skill-chip removable" key={skill}>
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)}>
                    <X size={11} />
                  </button>
                </span>
              ))}
              <input
                placeholder="Add skill..."
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={addSkill}
              />
            </div>
          </div>

          {/* Education */}
          <div className="edit-section-header">
            <h3>Education</h3>
            <button className="btn-add-link" onClick={addEducation}>
              <Plus size={14} /> Add Education
            </button>
          </div>
          {education.map((edu, i) => (
            <div className="edit-repeat-block" key={i}>
              <button
                className="remove-block-btn"
                onClick={() => removeEducation(i)}
              >
                <Trash2 size={14} />
              </button>
              <div className="edit-row">
                <div className="edit-field">
                  <label>Degree</label>
                  <input
                    value={edu.degree}
                    onChange={(e) =>
                      updateEducation(i, "degree", e.target.value)
                    }
                  />
                </div>
                <div className="edit-field">
                  <label>School</label>
                  <input
                    value={edu.school}
                    onChange={(e) =>
                      updateEducation(i, "school", e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="edit-field">
                <label>Year</label>
                <input
                  value={edu.year}
                  onChange={(e) => updateEducation(i, "year", e.target.value)}
                />
              </div>
            </div>
          ))}

          {/* Experience */}
          <div className="edit-section-header">
            <h3>Experience</h3>
            <button className="btn-add-link" onClick={addExperience}>
              <Plus size={14} /> Add Experience
            </button>
          </div>
          {experience.map((exp, i) => (
            <div className="edit-repeat-block" key={i}>
              <button
                className="remove-block-btn"
                onClick={() => removeExperience(i)}
              >
                <Trash2 size={14} />
              </button>
              <div className="edit-row">
                <div className="edit-field">
                  <label>Job Title</label>
                  <input
                    value={exp.jobTitle}
                    onChange={(e) =>
                      updateExperience(i, "jobTitle", e.target.value)
                    }
                  />
                </div>
                <div className="edit-field">
                  <label>Company</label>
                  <input
                    value={exp.company}
                    onChange={(e) =>
                      updateExperience(i, "company", e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="edit-field">
                <label>Duration</label>
                <input
                  value={exp.duration}
                  onChange={(e) =>
                    updateExperience(i, "duration", e.target.value)
                  }
                  placeholder="Jan 2021 - Present"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="edit-profile-footer">
          <button
            className="btn-cancel"
            onClick={() => navigate(-1)}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            className="btn-primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
