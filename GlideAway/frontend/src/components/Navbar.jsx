import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { IconCompass, IconUser } from "./Icons";
import { Menu, X } from "lucide-react";
import "../styles/Navbar.css";

function Navbar() {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeSection, setActiveSection] = useState("hero");
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    setMenuOpen(false);
    navigate("/");
  }

  // Close mobile menu whenever route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Scroll tracking only for Home page
  useEffect(() => {
    if (location.pathname !== "/") return;

    const sections = ["hero", "destinations", "stays", "services", "deals"];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 250;

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
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location.pathname]);

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    setMenuOpen(false);

    if (location.pathname !== "/") {
      navigate("/");

      setTimeout(() => {
        const el = document.getElementById(sectionId);

        if (el) {
          el.scrollIntoView({
            behavior: "smooth",
          });
        }
      }, 150);
    } else {
      const el = document.getElementById(sectionId);

      if (el) {
        el.scrollIntoView({
          behavior: "smooth",
        });
      }
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
        {/* Logo */}
        <Link to="/" className="site-brand" onClick={() => setMenuOpen(false)}>
          <IconCompass />
          GlideAway
        </Link>

        {/* Desktop Navigation */}
        <nav className="site-nav-links">
          <button
            onClick={() => scrollToSection("hero")}
            className={`nav-link-btn ${
              activeSection === "hero" && location.pathname === "/"
                ? "active"
                : ""
            }`}
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
            className={`nav-link-btn ${
              activeSection === "services" && location.pathname === "/"
                ? "active"
                : ""
            }`}
          >
            Services
          </button>

          <button
            onClick={() => scrollToSection("deals")}
            className={`nav-link-btn ${
              activeSection === "deals" && location.pathname === "/"
                ? "active"
                : ""
            }`}
          >
            Deals
          </button>
        </nav>

        {/* Desktop Account */}
        <div className="site-nav-account desktop-account">
          {isLoggedIn ? (
            <>
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
            </>
          ) : (
            <>
              <Link to="/login" className="site-signin">
                Sign In
              </Link>

              <Link to="/signup" className="site-avatar" title="Sign up">
                <IconUser />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <button
            onClick={() => scrollToSection("hero")}
            className={`mobile-nav-link ${
              activeSection === "hero" && location.pathname === "/"
                ? "active"
                : ""
            }`}
          >
            Home
          </button>

          <button
            onClick={() => scrollToSection("destinations")}
            className={`mobile-nav-link ${
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
            className={`mobile-nav-link ${
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
            className={`mobile-nav-link ${
              activeSection === "services" && location.pathname === "/"
                ? "active"
                : ""
            }`}
          >
            Services
          </button>

          <button
            onClick={() => scrollToSection("deals")}
            className={`mobile-nav-link ${
              activeSection === "deals" && location.pathname === "/"
                ? "active"
                : ""
            }`}
          >
            Deals
          </button>

          <div className="mobile-menu-divider"></div>

          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="mobile-account-link">
                <IconUser />
                Hi, {user?.name ? user.name.split(" ")[0] : "User"}
              </Link>

              <button className="mobile-logout-btn" onClick={handleLogout}>
                Log Out
              </button>
            </>
          ) : (
            <div className="mobile-auth-links">
              <Link to="/login" className="mobile-signin-btn">
                Sign In
              </Link>

              <Link to="/signup" className="mobile-signup-btn">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;
