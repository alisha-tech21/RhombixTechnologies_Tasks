import React from "react";
import "./About.css";
import aboutImage from "../../../assets/images/about.png";
import { motion } from "framer-motion";
import { Link } from "react-scroll";

const About = () => {
  return (
    <section className="about" id="about">
      <div className="about-container">
        {/* Image Side */}
        <motion.div
          className="about-image"
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.6 }}
        >
          <div className="about-glow"></div>

          <img src={aboutImage} alt="Alisha Developer" />
        </motion.div>

        {/* Content Side */}
        <motion.div
          className="about-content"
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true, amount: 0.6 }}
        >
          <h2>
            ABOUT <span>ME</span>
          </h2>
          <p>
            I'm a <span>Full Stack MERN Developer</span> passionate about
            creating modern web applications that combine beautiful user
            interfaces with powerful backend functionality.
          </p>
          <p>
            I enjoy building scalable solutions, writing clean code, and
            continuously learning new technologies to improve my skills.
          </p>
          <motion.div
            className="about-stats"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.2,
                },
              },
            }}
          >
            {" "}
            <motion.div
              className="stat-box"
              variants={{
                hidden: {
                  opacity: 0,
                  y: 40,
                },
                visible: {
                  opacity: 1,
                  y: 0,
                },
              }}
              transition={{ duration: 0.5 }}
            >
              {" "}
              <h3>10+</h3>
              <p>Technologies</p>
            </motion.div>
            <motion.div
              className="stat-box"
              variants={{
                hidden: {
                  opacity: 0,
                  y: 40,
                },
                visible: {
                  opacity: 1,
                  y: 0,
                },
              }}
              transition={{ duration: 0.5 }}
            >
              {" "}
              <h3>5+</h3>
              <p>Projects</p>
            </motion.div>
            <motion.div
              className="stat-box"
              variants={{
                hidden: {
                  opacity: 0,
                  y: 40,
                },
                visible: {
                  opacity: 1,
                  y: 0,
                },
              }}
              transition={{ duration: 0.5 }}
            >
              {" "}
              <h3>1+</h3>
              <p>Years Learning</p>
            </motion.div>
          </motion.div>
          <motion.div
            whileHover={{
              scale: 1.05,
            }}
            whileTap={{ scale: 0.95 }}
            className="project-btn-wrapper"
          >
            <Link
              to="projects"
              smooth={true}
              duration={600}
              className="project-btn"
            >
              Explore My Projects →
            </Link>
          </motion.div>{" "}
        </motion.div>
      </div>
    </section>
  );
};

export default About;
