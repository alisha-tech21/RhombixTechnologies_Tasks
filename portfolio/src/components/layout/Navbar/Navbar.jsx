import "./Navbar.css";
import { useEffect, useState } from "react";
import { HiOutlinePhone } from "react-icons/hi";
import { BsSun } from "react-icons/bs";
import { FaMoon } from "react-icons/fa";
import { Link } from "react-scroll";
import { HiBars3, HiXMark } from "react-icons/hi2";
import logo from "../../../assets/icons/logo.png";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [lightMode, setLightMode] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    document.body.classList.toggle("light-theme", lightMode);
  }, [lightMode]);

  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleSection) {
          setActiveSection(visibleSection.target.id);
        }
      },
      {
        root: null,
        rootMargin: "-80px 0px -45% 0px",
        threshold: [0.1, 0.25, 0.5, 0.75],
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "skills", label: "Skills" },
    { id: "projects", label: "Projects" },
    { id: "education", label: "Education" },
    { id: "experience", label: "Experience" },
  ];

  return (
    <header className="navbar">
      <div className="container navbar-container">
        {/* Logo */}
        <div className="navbar-logo">
          <img src={logo} alt="Alisha Logo" />
          <span>Alisha Asmat</span>
        </div>

        {/* Navigation */}
        <nav className={menuOpen ? "nav active" : "nav"}>
          <ul className="nav-links">
            {navItems.map((item) => (
              <li key={item.id}>
                <Link
                  to={item.id}
                  smooth={true}
                  duration={500}
                  offset={-72}
                  onClick={() => setMenuOpen(false)}
                  className={activeSection === item.id ? "active" : ""}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right */}
        <div className="navbar-right">
          <button
            className={`theme-toggle ${lightMode ? "light" : ""}`}
            onClick={() => setLightMode(!lightMode)}
            aria-label="Toggle theme"
          >
            <div className="toggle-circle">
              {lightMode ? <BsSun /> : <FaMoon />}
            </div>
          </button>

          <Link
            to="contact"
            smooth={true}
            duration={500}
            offset={-72}
            onClick={() => setMenuOpen(false)}
            className="contact-btn"
          >
            <HiOutlinePhone />
            Contact
          </Link>
        </div>

        {/* Mobile Menu */}
        <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <HiXMark /> : <HiBars3 />}
        </button>
      </div>
    </header>
  );
}

export default Navbar;
