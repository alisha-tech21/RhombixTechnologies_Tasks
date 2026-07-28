import "./Hero.css";
import { useState, useEffect } from "react";

import HeroImage from "../../../assets/images/hero.png";
import resume from "../../../assets/resume/resume.pdf";
import { FaLinkedinIn, FaGithub, FaWhatsapp } from "react-icons/fa";

import { MdEmail } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
function Hero() {
  const titles = ["FULL STACK", "MERN STACK", "FRONTEND", "REACT", "WEB"];
  const [currentTitle, setCurrentTitle] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTitle((prev) => {
        console.log("Prev:", prev);
        return prev === titles.length - 1 ? 0 : prev + 1;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [titles.length]);

  return (
    <section className="hero" id="home">
      <div className="hero-container">
        {/* ---------- Left Content ---------- */}

        <motion.div
          className="hero-left"
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Top Row */}
          <div className="hero-top">
            <div className="hero-heading">
              <p className="hero-greeting">Hello, I'm</p>

              <h1 className="hero-name">
                ALISHA
                <br />
                ASMAT
              </h1>
              <p className="hero-description">
                Full Stack <span>MERN</span> Developer passionate about creating
                fast, scalable, and visually engaging web applications.
              </p>

              <div className="hero-buttons">
                <a href="#contact" className="btn btn-outline">
                  Let's Connect
                  <span>→</span>
                </a>

                <a
                  href={resume}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary"
                >
                  Resume
                </a>
              </div>
            </div>
            <div className="hero-mobile-image">
              <div className="hero-glow"></div>
              <img src={HeroImage} alt="Alisha Asmat" className="hero-image" />
            </div>
          </div>
        </motion.div>

        {/* ---------- Center Image ---------- */}

        <motion.div
          className="hero-center"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="hero-glow"></div>

          <img src={HeroImage} alt="Alisha Asmat" className="hero-image" />
        </motion.div>

        {/* ---------- Right Content ---------- */}

        <motion.div
          className="hero-right"
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="creative-text">Creative</p>

          <h2 className="hero-title">
            <div className="title-wrapper">
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentTitle}
                  className="animated-title"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                >
                  {titles[currentTitle]}
                </motion.span>
              </AnimatePresence>
            </div>

            <span className="developer-text">DEVELOPER</span>
          </h2>

          <p className="hero-tagline">
            Building the future, one line of code at a time.
          </p>
        </motion.div>

        {/* ---------- Social Icons ---------- */}

        <motion.div
          className="hero-social"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <a
            href="https://www.linkedin.com/in/alisha-asmat/"
            target="_blank"
            rel="noreferrer"
          >
            <FaLinkedinIn />
          </a>

          <a
            href="https://github.com/alisha-tech21"
            target="_blank"
            rel="noreferrer"
          >
            <FaGithub />
          </a>

          <a href="https://wa.me/" target="_blank" rel="noreferrer">
            <FaWhatsapp />
          </a>

          <a href="mailto:example@gmail.com">
            <MdEmail />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;
