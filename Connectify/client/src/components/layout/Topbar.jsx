import { Link } from "react-router-dom";
import "../../styles/layout.css";

export default function Topbar() {
  return (
    <header className="topbar">
      <Link to="/" className="topbar-logo">
        Connectify
      </Link>

      <div className="topbar-search">
        <input type="text" placeholder="Search developers, projects..." />
      </div>

      <div className="topbar-actions">
        <button className="create-post-btn">+ Create Post</button>

        <Link to="/notifications" className="topbar-icon">
          ♡
        </Link>

        <Link to="/messages" className="topbar-icon">
          ✉
        </Link>

        <Link to="/profile" className="profile-avatar">
          U
        </Link>
      </div>
    </header>
  );
}
