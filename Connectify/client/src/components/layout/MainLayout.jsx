import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import RightSidebar from "./RightSidebar";
import "../../styles/layout.css";

export default function MainLayout({ children, hideRightSidebar = false }) {
  return (
    <div className="app-shell">
      <Topbar />
      <div
        className={`app-content ${hideRightSidebar ? "no-right-sidebar" : ""}`}
      >
        <Sidebar />
        <main className="feed-main">{children}</main>
        {!hideRightSidebar && <RightSidebar />}
      </div>
    </div>
  );
}
