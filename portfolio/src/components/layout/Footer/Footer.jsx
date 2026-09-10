import "./Footer.css";

import {
  FaLinkedinIn,
  FaGithub,
  FaTwitter,
  FaEnvelope,
  FaMapMarkerAlt,
  FaArrowUp,
} from "react-icons/fa";

import logo from "../../../assets/icons/logo.png";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="footer">
      <div className="footer-glow footer-glow-one"></div>
      <div className="footer-glow footer-glow-two"></div>

      <div className="footer-container">
        {/* ================= BRAND ================= */}
        <div className="footer-brand">
          <div className="footer-logo">
            <img src={logo} alt="Alisha Asmat Logo" />

            <h3>
              Alisha <span>Asmat</span>
            </h3>
          </div>

          <p className="footer-description">
            Full Stack MERN Developer passionate about building modern,
            responsive, and user-friendly web applications with clean code and
            creative design.
          </p>

          {/* SOCIAL LINKS */}
          <div className="footer-social-section">
            <h4>Follow Me</h4>

            <div className="footer-socials">
              <a
                href="https://www.linkedin.com/in/alisha-asmat/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn />
              </a>

              <a
                href="hhttps://github.com/alisha-tech21"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <FaGithub />
              </a>

              <a
                href="https://x.com/Alishay190486"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                <FaTwitter />
              </a>

              <a href="mailto:your-email@example.com" aria-label="Email">
                <FaEnvelope />
              </a>
            </div>
          </div>
        </div>

        {/* ================= QUICK LINKS ================= */}
        <div className="footer-column">
          <h3>Quick Links</h3>

          <ul>
            <li>
              <a href="#home">Home</a>
            </li>

            <li>
              <a href="#about">About</a>
            </li>

            <li>
              <a href="#skills">Skills</a>
            </li>

            <li>
              <a href="#projects">Projects</a>
            </li>

            <li>
              <a href="#education">Education</a>
            </li>

            <li>
              <a href="#experience">Experience</a>
            </li>

            <li>
              <a href="#contact">Contact</a>
            </li>
          </ul>
        </div>

        {/* ================= SERVICES ================= */}
        <div className="footer-column">
          <h3>My Services</h3>

          <ul>
            <li>
              <a href="#projects">Frontend Development</a>
            </li>

            <li>
              <a href="#projects">Full Stack Development</a>
            </li>

            <li>
              <a href="#projects">React Development</a>
            </li>

            <li>
              <a href="#projects">Responsive Web Design</a>
            </li>
            <li>
              <a href="#projects">UI/UX Design</a>
            </li>
          </ul>
        </div>

        {/* ================= CONTACT ================= */}
        <div className="footer-column footer-contact">
          <h3>Contact Info</h3>

          <div className="contact-item">
            <div className="contact-icon">
              <FaEnvelope />
            </div>

            <a href="mailto:your-email@example.com">ialishay03@gmail.com</a>
          </div>

          <div className="contact-item">
            <div className="contact-icon">
              <FaMapMarkerAlt />
            </div>

            <span>Pakistan</span>
          </div>

          <div className="footer-availability">
            <h4>Available For</h4>

            <p>
              Freelance Projects
              <br />
              Internship Opportunities
              <br />
              Web Development Work
            </p>
          </div>
        </div>
      </div>

      {/* ================= BOTTOM BAR ================= */}
      <div className="footer-bottom">
        <p>
          © 2026 <span>Alisha Asmat</span>. All rights reserved.
        </p>

        <p className="footer-made">
          Made with <span>♥</span> using React
        </p>

        <button
          className="scroll-top"
          onClick={scrollToTop}
          aria-label="Scroll to top"
        >
          <FaArrowUp />
        </button>
      </div>
    </footer>
  );
};

export default Footer;
