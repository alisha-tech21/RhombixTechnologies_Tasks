import "./Projects.css";
import projectData from "./projectData";
import { useRef } from "react";
import { motion } from "framer-motion";

import { FaGithub } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Projects = () => {
  const swiperRef = useRef(null);

  return (
    <section className="projects" id="projects">
      <motion.div
        className="projects-heading"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2>
          WHAT I'VE <span>BUILT</span>
        </h2>

        <p>
          Explore some of the projects I've built using modern web technologies.
        </p>
      </motion.div>

      <div className="projects-slider-wrapper">
        {/* LEFT ARROW */}
        <button
          className="projects-arrow projects-arrow-left"
          onClick={() => swiperRef.current?.slidePrev()}
          aria-label="Previous project"
        >
          ‹
        </button>

        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          modules={[Autoplay, Pagination]}
          pagination={{ clickable: true }}
          loop={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          spaceBetween={20}
          breakpoints={{
            0: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
            1200: {
              slidesPerView: 3,
            },
          }}
          className="projects-slider"
        >
          {projectData.map((project) => (
            <SwiperSlide key={project.id}>
              <motion.div
                className="project-card"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -10 }}
              >
                <span className="project-number">{project.number}</span>

                <h3>{project.title}</h3>

                <p className="project-description">{project.description}</p>

                <div className="tech-stack">
                  {project.tech.map((tech, index) => (
                    <span key={index}>{tech}</span>
                  ))}
                </div>

                <div className="project-image">
                  <img src={project.image} alt={project.title} />

                  <div className="project-overlay">
                    <a href={project.github} target="_blank" rel="noreferrer">
                      <FaGithub />
                      GitHub
                    </a>

                    <a href={project.live} target="_blank" rel="noreferrer">
                      <FiExternalLink />
                      Live Demo
                    </a>
                  </div>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* RIGHT ARROW */}
        <button
          className="projects-arrow projects-arrow-right"
          onClick={() => swiperRef.current?.slideNext()}
          aria-label="Next project"
        >
          ›
        </button>
      </div>
    </section>
  );
};

export default Projects;
