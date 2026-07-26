import "./Navbar.css";
import { useEffect, useState } from "react";
import { RiGeminiFill } from "react-icons/ri";
import { HiOutlinePhone } from "react-icons/hi";
import { BsSun } from "react-icons/bs";
import { FaMoon } from "react-icons/fa";
import { Link } from "react-scroll";
import { HiBars3, HiXMark } from "react-icons/hi2";
import { IoClose } from "react-icons/io5";
import logo from "../../../assets/icons/logo.png";
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [lightMode, setLightMode] = useState(false);
  useEffect(() => {
    document.body.classList.toggle("light-theme", lightMode);
  }, [lightMode]);
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
          {" "}
          <ul className="nav-links">
            <li>
              <Link
                to="home"
                smooth
                duration={500}
                onClick={() => setMenuOpen(false)}
              >
                {" "}
                Home
              </Link>
            </li>

            <li>
              <Link
                to="about"
                smooth
                duration={500}
                onClick={() => setMenuOpen(false)}
              >
                About
              </Link>
            </li>

            <li>
              <Link
                to="skills"
                smooth
                duration={500}
                onClick={() => setMenuOpen(false)}
              >
                Skills
              </Link>
            </li>

            <li>
              <Link
                to="projects"
                smooth
                duration={500}
                onClick={() => setMenuOpen(false)}
              >
                Projects
              </Link>
            </li>

            <li>
              <Link
                to="experience"
                smooth
                duration={500}
                onClick={() => setMenuOpen(false)}
              >
                Experience
              </Link>
            </li>
          </ul>
        </nav>

        {/* Right */}

        <div className="navbar-right">
          {" "}
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
            onClick={() => setMenuOpen(false)}
            className="contact-btn"
          >
            <HiOutlinePhone />
            Contact
          </Link>
        </div>
        <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <HiXMark /> : <HiBars3 />}
        </button>
      </div>
    </header>
  );
}

export default Navbar;
