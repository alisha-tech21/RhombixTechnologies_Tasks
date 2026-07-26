import "./Experience.css";
import { motion } from "framer-motion";

import { FaGlobe, FaLaptopCode, FaCode } from "react-icons/fa";

const experienceData = [
  {
    year: "2026 — PRESENT",
    title: "Personal MERN Stack Projects",
    subtitle: "Self Learning & Development",
    icon: <FaGlobe />,
    points: [
      "Developed full-stack web applications using React.js, Node.js, Express.js, and MongoDB.",
      "Built responsive and user-friendly interfaces with a focus on performance and clean design.",
      "Implemented REST APIs, authentication, and database integration.",
      "Continuously improving development skills through real-world projects.",
    ],
  },
  {
    year: "2026",
    title: "TrendMesh – Smart Social Media Scheduling Platform",
    subtitle: "Final Year Project",
    icon: <FaLaptopCode />,
    points: [
      "Developed a Smart Social Media Scheduling Platform using the MERN Stack.",
      "Integrated Facebook and Instagram APIs for social media management.",
      "Implemented automated post scheduling using Node-Cron.",
      "Added AI-powered caption and hashtag generation features.",
    ],
  },
  {
    year: "2026",
    title: "DevHub – Developer Portfolio Platform",
    subtitle: "Personal Project",
    icon: <FaCode />,
    points: [
      "Built a modern MERN-based portfolio and blogging platform.",
      "Integrated the GitHub API to display repositories and developer statistics.",
      "Developed secure authentication and blog management features.",
      "Deployed the application using modern cloud platforms.",
    ],
  },
];

const Experience = () => {
  return (
    <section className="experience" id="experience">
      <div className="experience-container">
        {/* =========================
              HEADING
        ========================= */}
        <motion.div
          className="experience-heading"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2>
            PROJECT <span>EXPERIENCE</span>
          </h2>

          <p>
            A showcase of my hands-on development experience through full-stack
            projects and continuous learning.
          </p>
        </motion.div>

        {/* =========================
              TIMELINE
        ========================= */}
        <div className="experience-timeline">
          <div className="timeline-line"></div>

          {experienceData.map((item, index) => (
            <motion.div
              className={`timeline-item ${
                index % 2 === 0 ? "timeline-left" : "timeline-right"
              }`}
              key={item.title}
              initial={{
                opacity: 0,
                x: index % 2 === 0 ? -60 : 60,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.7,
                delay: 0.1,
              }}
            >
              {/* LEFT CARD */}
              {index % 2 === 0 && (
                <div className="timeline-content">
                  <ExperienceCard item={item} />
                </div>
              )}

              {/* NODE */}
              <div className="timeline-node">{item.icon}</div>

              {/* RIGHT CARD */}
              {index % 2 !== 0 && (
                <div className="timeline-content">
                  <ExperienceCard item={item} />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* =========================
      EXPERIENCE CARD
========================= */

const ExperienceCard = ({ item }) => {
  return (
    <article className="experience-card">
      <span className="experience-year">{item.year}</span>

      <h3>{item.title}</h3>

      <h4>{item.subtitle}</h4>

      <ul>
        {item.points.map((point, index) => (
          <li key={index}>{point}</li>
        ))}
      </ul>
    </article>
  );
};

export default Experience;
