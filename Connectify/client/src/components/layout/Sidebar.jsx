import { NavLink } from "react-router-dom";
import "../../styles/layout.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">Connectify</div>

      <nav className="sidebar-nav">
        <NavLink to="/" className="sidebar-link">
          <span>⌂</span>
          Home
        </NavLink>

        <NavLink to="/explore" className="sidebar-link">
          <span>◉</span>
          Explore
        </NavLink>

        <NavLink to="/friends" className="sidebar-link">
          <span>♧</span>
          Friends
        </NavLink>

        <NavLink to="/messages" className="sidebar-link">
          <span>✉</span>
          Messages
        </NavLink>

        <NavLink to="/notifications" className="sidebar-link">
          <span>♡</span>
          Notifications
        </NavLink>

        <NavLink to="/settings" className="sidebar-link">
          <span>⚙</span>
          Settings
        </NavLink>
      </nav>
    </aside>
  );
}
