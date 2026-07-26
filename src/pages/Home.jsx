import Navbar from "../components/layout/Navbar/Navbar";
import Hero from "../components/sections/Hero/Hero";
import About from "../components/sections/About/About";
import Skills from "../components/sections/Skills/Skills";
import Projects from "../components/sections/Projects/Projects";
import Education from "../components/sections/Education/Education";
import Experience from "../components/sections/Experience/Experience";
import Contact from "../components/sections/Contact/Contact";
import Footer from "../components/layout/Footer/Footer";
import SectionSeparator from "../components/sections/SectionSeparator/separator";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <SectionSeparator />
      <About />
      <SectionSeparator />
      <Skills />
      <SectionSeparator />
      <Projects />
      <SectionSeparator />
      <Education />
      <SectionSeparator />
      <Experience />
      <SectionSeparator />
      <Contact />
      <Footer />
    </>
  );
}

export default Home;
