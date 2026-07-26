import "./Education.css";
import { motion } from "framer-motion";

import {
  FaGraduationCap,
  FaMapMarkerAlt,
  FaCode,
  FaDatabase,
  FaLaptopCode,
  FaCogs,
  FaProjectDiagram,
  FaServer,
} from "react-icons/fa";

const Education = () => {
  const coursework = [
    {
      name: "Web Development",
      icon: <FaLaptopCode />,
    },
    {
      name: "React.js",
      icon: <FaCode />,
    },
    {
      name: "Database Systems",
      icon: <FaDatabase />,
    },
    {
      name: "Software Engineering",
      icon: <FaCogs />,
    },
    {
      name: "Data Structures",
      icon: <FaProjectDiagram />,
    },
    {
      name: "Operating Systems",
      icon: <FaServer />,
    },
    {
      name: "Visual Programming",
      icon: <FaCode />,
    },
  ];

  return (
    <section className="education" id="education">
      {/* Background Glow */}
      <div className="section-divider"></div>
      <div className="education-glow"></div>

      {/* Section Header */}
      <motion.div
        className="education-heading"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="education-icon">
          <FaGraduationCap />
        </div>

        <span>ACADEMIC JOURNEY</span>

        <h2>EDUCATION</h2>

        <p>
          {" "}
          My educational journey has equipped me with the knowledge and skills
          to build modern web applications.
        </p>
      </motion.div>

      {/* Education Card */}
      <motion.div
        className="education-card-wrapper"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="education-card">
          {/* Top Badges */}
          <div className="education-badges">
            <span className="education-year">2022 – 2026</span>

            <span className="education-cgpa">CGPA: 3.69 / 4.00</span>
          </div>

          {/* Degree Icon */}
          <div className="degree-icon">
            <FaGraduationCap />
          </div>

          {/* Main Content */}
          <div className="education-content">
            <div className="degree-info">
              <h3>Bachelor of Science in Information Technology</h3>

              <div className="university">
                <FaMapMarkerAlt />
                <p>Government College University Faisalabad (GCUF)</p>
              </div>
            </div>

            {/* Coursework */}
            <div className="coursework">
              <div className="coursework-title">
                <FaCode />
                <h4>RELEVANT COURSEWORK</h4>
              </div>

              <div className="coursework-list">
                {coursework.map((course, index) => (
                  <span key={index} className="course-chip">
                    {course.icon}
                    {course.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Education;
