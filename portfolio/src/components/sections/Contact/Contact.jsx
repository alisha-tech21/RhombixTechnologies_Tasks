import "./Contact.css";
import { motion } from "framer-motion";

import {
  FaEnvelope,
  FaLinkedinIn,
  FaGithub,
  FaTwitter,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Contact = () => {
  return (
    <section className="contact" id="contact">
      <div className="contact-grid"></div>

      <div className="contact-container">
        {/* =========================
              HEADING
        ========================= */}
        <motion.div
          className="contact-heading"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span>GET IN TOUCH</span>

          <h2>
            LET'S <span>CONNECT</span>
          </h2>

          <p>
            Have a project in mind or want to discuss an opportunity? I'd love
            to hear from you.
          </p>
        </motion.div>

        {/* =========================
              CONTACT CONTENT
        ========================= */}
        <div className="contact-content">
          {/* LEFT SIDE */}
          <motion.div
            className="contact-info"
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h3>Get In Touch</h3>

            <p className="contact-description">
              I'm always open to discussing new projects, creative ideas, or
              opportunities to be part of your vision.
            </p>

            <div className="contact-details">
              <a href="mailto:your-email@gmail.com" className="contact-item">
                <div className="contact-icon">
                  <FaEnvelope />
                </div>

                <div>
                  <span>Email</span>
                  <p>ialishay03@gmail.com</p>
                </div>
              </a>

              <div className="contact-item">
                <div className="contact-icon">
                  <FaMapMarkerAlt />
                </div>

                <div>
                  <span>Location</span>
                  <p>Pakistan</p>
                </div>
              </div>
            </div>

            <div className="social-section">
              <span>Find Me On</span>

              <div className="social-links">
                <a
                  href="https://github.com/alisha-tech21"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                >
                  <FaGithub />
                </a>

                <a
                  href="https://www.linkedin.com/in/alisha-asmat/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <FaLinkedinIn />
                </a>
                <a
                  href="https://x.com/Alishay190486"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                >
                  <FaTwitter />
                </a>
              </div>
            </div>
          </motion.div>

          {/* RIGHT SIDE */}
          <motion.div
            className="contact-form-wrapper"
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <form className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Your Name</label>

                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Your Email</label>

                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>

                <textarea
                  id="message"
                  name="message"
                  rows="6"
                  placeholder="Tell me about your project..."
                ></textarea>
              </div>

              <motion.button
                type="submit"
                className="contact-submit"
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 0 25px rgba(168, 85, 247, 0.5)",
                }}
                whileTap={{ scale: 0.97 }}
              >
                SEND MESSAGE
                <span>→</span>
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
