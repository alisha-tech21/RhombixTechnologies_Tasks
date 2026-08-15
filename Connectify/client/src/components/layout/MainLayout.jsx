import { useState } from "react";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import RightSidebar from "./RightSidebar";
import "../../styles/layout.css";

export default function MainLayout({ children, hideRightSidebar = false }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="app-shell">
      <Topbar onMenuClick={() => setSidebarOpen((prev) => !prev)} />

      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar} />
      )}

      <div
        className={`app-content ${hideRightSidebar ? "no-right-sidebar" : ""}`}
      >
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

        <main className="feed-main">{children}</main>

        {!hideRightSidebar && <RightSidebar />}
      </div>
    </div>
  );
}
