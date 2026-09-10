import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { IconCompass, IconUser } from "./Icons";
import "../styles/Navbar.css";

function Navbar() {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState("hero");

  function handleLogout() {
    logout();
    navigate("/");
  }

  // Scroll listener taake user ke scroll karne par active section khud-b-khud update ho
  useEffect(() => {
    // Agar hum home page ("/") par nahi hain, toh scroll tracking ki zaroorat nahi
    if (location.pathname !== "/") return;

    const sections = ["hero", "destinations", "stays", "services", "deals"];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 250; // Offset taake thoda pehle hi active ho jaye

      sections.forEach((sectionId) => {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;

          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check on load

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location.pathname]);

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 150);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };
  const isDestinationActive =
    location.pathname === "/destinations" ||
    location.pathname.startsWith("/destination/");

  const isExploreActive =
    location.pathname === "/explore" ||
    location.pathname.startsWith("/property/");
  return (
    <header className="site-nav">
      <div className="site-nav-inner">
        <Link to="/" className="site-brand">
          <IconCompass /> GlideAway
        </Link>

        <nav className="site-nav-links">
          <button
            onClick={() => scrollToSection("hero")}
            className={`nav-link-btn ${activeSection === "hero" && location.pathname === "/" ? "active" : ""}`}
          >
            Home
          </button>

          <button
            onClick={() => scrollToSection("destinations")}
            className={`nav-link-btn ${
              (activeSection === "destinations" && location.pathname === "/") ||
              isDestinationActive
                ? "active"
                : ""
            }`}
          >
            Destinations
          </button>

          <button
            onClick={() => scrollToSection("stays")}
            className={`nav-link-btn ${
              (activeSection === "stays" && location.pathname === "/") ||
              isExploreActive
                ? "active"
                : ""
            }`}
          >
            Explore
          </button>

          <button
            onClick={() => scrollToSection("services")}
            className={`nav-link-btn ${activeSection === "services" && location.pathname === "/" ? "active" : ""}`}
          >
            Services
          </button>

          <button
            onClick={() => scrollToSection("deals")}
            className={`nav-link-btn ${activeSection === "deals" && location.pathname === "/" ? "active" : ""}`}
          >
            Deals
          </button>
        </nav>

        {isLoggedIn ? (
          <div className="site-nav-account">
            <Link to="/dashboard" className="site-signin">
              Hi, {user?.name ? user.name.split(" ")[0] : "User"}
            </Link>
            <button
              className="site-avatar"
              onClick={handleLogout}
              title="Log out"
            >
              <IconUser />
            </button>
          </div>
        ) : (
          <div className="site-nav-account">
            <Link to="/login" className="site-signin">
              Sign In
            </Link>
            <Link to="/signup" className="site-avatar" title="Sign up">
              <IconUser />
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
