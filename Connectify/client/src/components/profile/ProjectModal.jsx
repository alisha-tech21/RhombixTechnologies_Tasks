import { useState } from "react";
import { X, Plus } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";

export default function ProjectModal({ project, onClose, onSaved }) {
  const isEditing = !!project;

  const [title, setTitle] = useState(project?.title || "");
  const [description, setDescription] = useState(project?.description || "");
  const [liveUrl, setLiveUrl] = useState(project?.liveUrl || "");
  const [githubUrl, setGithubUrl] = useState(project?.githubUrl || "");
  const [status, setStatus] = useState(project?.status || "live");
  const [techStack, setTechStack] = useState(project?.techStack || []);
  const [techInput, setTechInput] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    project?.image
      ? `${import.meta.env.VITE_SOCKET_URL}${project.image}`
      : null,
  );
  const [saving, setSaving] = useState(false);

  const addTech = (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const val = techInput.trim();
    if (!val || techStack.includes(val)) {
      setTechInput("");
      return;
    }
    setTechStack([...techStack, val]);
    setTechInput("");
  };

  const removeTech = (tech) =>
    setTechStack(techStack.filter((t) => t !== tech));

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Project title is required");
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("liveUrl", liveUrl);
      formData.append("githubUrl", githubUrl);
      formData.append("status", status);
      formData.append("techStack", JSON.stringify(techStack));
      if (imageFile) formData.append("image", imageFile);

      let res;
      if (isEditing) {
        res = await api.put(`/projects/${project._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        res = await api.post("/projects", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      onSaved(res.data.project);
      toast.success(isEditing ? "Project updated" : "Project added");
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save project");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{isEditing ? "Edit Project" : "Add Project"}</h3>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <label className="project-image-upload">
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" />
            ) : (
              <div className="project-image-placeholder">
                <Plus size={20} /> Add project image
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
          </label>

          <div className="edit-field">
            <label>Project Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. TaskFlow Pro"
            />
          </div>

          <div className="edit-field">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
              rows={3}
              placeholder="What does this project do?"
            />
          </div>

          <div className="edit-row">
            <div className="edit-field">
              <label>Live Demo URL</label>
              <input
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div className="edit-field">
              <label>GitHub URL</label>
              <input
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/..."
              />
            </div>
          </div>

          <div className="edit-field">
            <label>Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="modal-visibility-select"
              style={{ width: "100%" }}
            >
              <option value="live">Live</option>
              <option value="in_progress">In Progress</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="edit-field">
            <label>Tech Stack</label>
            <div className="edit-skills-box">
              {techStack.map((tech) => (
                <span className="profile-skill-chip removable" key={tech}>
                  {tech}
                  <button type="button" onClick={() => removeTech(tech)}>
                    <X size={11} />
                  </button>
                </span>
              ))}
              <input
                placeholder="Type and press Enter..."
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={addTech}
              />
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <div style={{ display: "flex", gap: 10 }}>
            <button
              className="btn-cancel"
              style={{ flex: 1 }}
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              className="post-submit-btn"
              style={{ flex: 1 }}
              onClick={handleSave}
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : isEditing
                  ? "Save Changes"
                  : "Add Project"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
