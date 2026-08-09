import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import RightSidebar from "./RightSidebar";
import "../../styles/layout.css";

export default function MainLayout({ children }) {
  return (
    <div className="app-shell">
      <Topbar />
      <div className="app-content">
        <Sidebar />
        <main className="feed-main">{children}</main>
        <RightSidebar />
      </div>
    </div>
  );
}
