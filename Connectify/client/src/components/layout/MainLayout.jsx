import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "../../styles/layout.css";

export default function MainLayout({ children }) {
  return (
    <div className="app-layout">
      <Topbar />

      <div className="app-body">
        <Sidebar />

        <main className="main-content">{children}</main>
      </div>
    </div>
  );
}
