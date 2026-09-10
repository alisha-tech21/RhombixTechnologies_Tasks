import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  CalendarCheck,
  Bookmark,
  Settings,
  LogOut,
  Menu,
  X,
  Search,
  Bell,
  HelpCircle,
  Plus,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Dashboard.css";

function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const menuItems = [
    {
      path: "/dashboard",
      name: "Dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    {
      path: "/dashboard/profile",
      name: "My Profile",
      icon: <User size={18} />,
    },
    {
      path: "/dashboard/bookings",
      name: "My Bookings",
      icon: <CalendarCheck size={18} />,
    },
    {
      path: "/dashboard/wishlist",
      name: "Saved Places",
      icon: <Bookmark size={18} />,
    },
    {
      path: "/dashboard/settings",
      name: "Account Settings",
      icon: <Settings size={18} />,
    },
  ];

  const handleLogout = () => {
    logout(); // clears the saved token + user so protected routes redirect properly
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      <button
        className="mobile-menu-btn"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside className={`dashboard-sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div>
          <div className="sidebar-brand">
            <h2>GlideAway</h2>
            <span>Serene Exploration</span>
          </div>

          <nav className="sidebar-nav">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`sidebar-link ${isActive ? "active" : ""}`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="sidebar-footer">
          <button className="book-new-trip-btn" onClick={() => navigate("/")}>
            <Plus size={16} /> Book New Trip
          </button>
          <button className="logout-btn-sidebar" onClick={handleLogout}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <div className="topbar-search">
            <Search size={16} className="search-icon" />
            <input type="text" placeholder="Search destinations..." />
          </div>
          <div className="topbar-actions">
            <button className="icon-btn">
              <Bell size={18} />
            </button>
            <button className="icon-btn">
              <HelpCircle size={18} />
            </button>
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80"
              alt={user?.name || "Profile"}
              className="topbar-avatar"
              title={user?.name}
            />
          </div>
        </header>

        <div className="dashboard-content-body">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;
