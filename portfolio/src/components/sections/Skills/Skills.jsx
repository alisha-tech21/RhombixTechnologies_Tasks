import "./Skills.css";
import { motion } from "framer-motion";

import {
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaReact,
  FaNodeJs,
  FaGitAlt,
  FaGithub,
} from "react-icons/fa";

import {
  SiTailwindcss,
  SiExpress,
  SiMongodb,
  SiPostman,
  SiVercel,
} from "react-icons/si";

import { VscVscode } from "react-icons/vsc";

const skills = [
  { name: "VS Code", icon: <VscVscode />, color: "#3b82f6" },
  { name: "HTML5", icon: <FaHtml5 />, color: "#ff6b35" },
  { name: "CSS3", icon: <FaCss3Alt />, color: "#3b82f6" },
  { name: "JavaScript", icon: <FaJs />, color: "#f7df1e" },
  { name: "Tailwind CSS", icon: <SiTailwindcss />, color: "#38bdf8" },

  { name: "React.js", icon: <FaReact />, color: "#61dafb" },
  { name: "Node.js", icon: <FaNodeJs />, color: "#4ade80" },
  { name: "Express.js", icon: <SiExpress />, color: "#ffffff" },
  { name: "MongoDB", icon: <SiMongodb />, color: "#22c55e" },
  { name: "REST API", icon: <>{"</>"}</>, color: "#60a5fa" },

  { name: "Postman", icon: <SiPostman />, color: "#ff7849" },
  { name: "Git", icon: <FaGitAlt />, color: "#f34f29" },
  { name: "GitHub", icon: <FaGithub />, color: "#ffffff" },
  { name: "Vercel", icon: <SiVercel />, color: "#ffffff" },
];

const Skills = () => {
  return (
    <section className="skills" id="skills">
      <motion.div
        className="skills-heading"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <h2>
          MY <span>TECHNOLOGY STACK</span>
        </h2>

        <p>
          Modern tools and frameworks I use to build responsive, scalable web
          applications.
        </p>
      </motion.div>

      <motion.div
        className="skills-grid"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.08,
            },
          },
        }}
      >
        {skills.map((skill, index) => (
          <motion.div
            className="skill-card"
            key={index}
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
            whileHover={{
              y: -10,
              scale: 1.05,
            }}
          >
            <div
              className="skill-icon"
              style={{
                color:
                  skill.name === "GitHub" ||
                  skill.name === "Vercel" ||
                  skill.name === "Express.js"
                    ? "var(--skill-icon-dark)"
                    : skill.color,
              }}
            >
              {skill.icon}
            </div>

            <span>{skill.name}</span>
          </motion.div>
        ))}
      </motion.div>

      <div className="section-divider"></div>
    </section>
  );
};

export default Skills;
