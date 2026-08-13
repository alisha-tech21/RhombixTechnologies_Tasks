import {
  ExternalLink,
  Link2,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function ProjectCard({ project, isOwner, onEdit, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const statusLabel = {
    live: "Live",
    in_progress: "In Progress",
    archived: "Archived",
  };
  const statusColor = {
    live: "#10b981",
    in_progress: "#f59e0b",
    archived: "#94a3b8",
  };

  return (
    <div className="project-card">
      {project.image && (
        <div className="project-card-image">
          <img
            src={`${import.meta.env.VITE_SOCKET_URL}${project.image}`}
            alt={project.title}
          />
        </div>
      )}

      <div className="project-card-body">
        <div className="project-card-top">
          <h4>{project.title}</h4>
          <span
            className="project-status-badge"
            style={{
              background: `${statusColor[project.status]}20`,
              color: statusColor[project.status],
            }}
          >
            {statusLabel[project.status]}
          </span>

          {isOwner && (
            <div className="project-menu-wrap" ref={menuRef}>
              <button
                className="project-menu-btn"
                onClick={() => setMenuOpen((v) => !v)}
              >
                <MoreHorizontal size={16} />
              </button>
              {menuOpen && (
                <div className="project-menu-dropdown">
                  <button
                    onClick={() => {
                      onEdit(project);
                      setMenuOpen(false);
                    }}
                  >
                    <Pencil size={13} /> Edit
                  </button>
                  <button
                    className="danger"
                    onClick={() => {
                      onDelete(project._id);
                      setMenuOpen(false);
                    }}
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {project.description && (
          <p className="project-card-desc">{project.description}</p>
        )}

        {project.techStack?.length > 0 && (
          <div className="project-tech-list">
            {project.techStack.map((tech) => (
              <span key={tech} className="project-tech-chip">
                {tech}
              </span>
            ))}
          </div>
        )}

        <div className="project-card-links">
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noreferrer">
              <Link2 size={13} /> GitHub
            </a>
          )}
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noreferrer">
              <ExternalLink size={13} /> Live Demo
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
