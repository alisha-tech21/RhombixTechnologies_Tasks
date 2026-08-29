import "./Experience.css";
import { motion } from "framer-motion";
import { FaBriefcase, FaLaptopCode } from "react-icons/fa";

const experienceData = [
  {
    year: "22 JUL 2026 — PRESENT",
    title: "Web Development Intern",
    subtitle: "Rhombix Technologies · Remote",
    icon: <FaBriefcase />,
    points: [
      "Developing responsive and interactive web applications using React.js, JavaScript, HTML5, and CSS3.",
      "Built Connectify, a social networking platform with user profiles, posts, comments, likes, friend requests, and multimedia content sharing.",
      "Created a professional portfolio website to showcase projects, technical skills, experience, and achievements.",
      "Implemented reusable React components and responsive layouts for different screen sizes.",
      "Working on practical web development tasks while strengthening frontend and full-stack development skills.",
    ],
  },

  {
    year: "05 AUG 2026 — 05 SEP 2026",
    title: "Frontend Development Intern",
    subtitle: "Progree · Internship",
    icon: <FaBriefcase />,
    points: [
      "Developed a semantic and mobile-responsive marketing landing page using HTML5 and custom CSS.",
      "Built an asynchronous weather application using React.js, Fetch API, async/await, and OpenWeatherMap API.",
      "Developed an analytical administration portal using React.js and frontend routing.",
      "Implemented responsive charts, searching, filtering, multi-column sorting, and dark-mode functionality.",
      "Focused on responsive design, API integration, reusable components, loading states, error handling, and cross-browser compatibility.",
    ],
  },

  {
    year: "2026",
    title: "TrendMesh",
    subtitle: "Smart Social Media Scheduling Platform · Final Year Project",
    icon: <FaLaptopCode />,
    points: [
      "Developed a full-stack social media scheduling platform using React.js, Node.js, Express.js, and MongoDB.",
      "Integrated Facebook and Instagram Graph APIs for social media management.",
      "Implemented automated post scheduling and background jobs using Node-Cron.",
      "Integrated AI-powered caption and hashtag generation for content creation.",
      "Designed responsive interfaces and RESTful APIs for frontend-backend communication.",
    ],
  },
];

const Experience = () => {
  return (
    <section className="experience" id="experience">
      <div className="experience-container">
        <motion.div
          className="experience-heading"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2>
            MY <span>EXPERIENCE</span>
          </h2>

          <p>
            My professional journey through internships, practical web
            development, and hands-on software projects.
          </p>
        </motion.div>

        <div className="experience-timeline">
          <div className="timeline-line"></div>

          {experienceData.map((item, index) => (
            <motion.div
              className={`timeline-item ${
                index % 2 === 0 ? "timeline-left" : "timeline-right"
              }`}
              key={`${item.title}-${index}`}
              initial={{
                opacity: 0,
                x: index % 2 === 0 ? -60 : 60,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
                amount: 0.2,
              }}
              transition={{
                duration: 0.7,
                delay: 0.1,
              }}
            >
              {index % 2 === 0 && (
                <div className="timeline-content">
                  <ExperienceCard item={item} />
                </div>
              )}

              <div className="timeline-node">{item.icon}</div>

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
