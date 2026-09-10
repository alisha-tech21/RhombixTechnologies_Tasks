import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import Destinations from "../components/PopularDestinations";
import FeaturedStays from "../components/FeaturedStays";
import Deals from "../components/Deals";
import Services from "../components/Services";
import CTA from "../components/CTA";
import ParallaxSection from "../components/ParallaxSection";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";

function Home() {
  return (
    <div>
      <Navbar />
      <div id="hero">
        <Hero />
      </div>
      <div id="destinations">
        <Destinations />
      </div>
      <div id="stays">
        <FeaturedStays />
      </div>
      <div id="deals">
        <Deals />
      </div>
      <div id="services">
        <Services />
      </div>
      <CTA />

      <ParallaxSection />
      <div id="testimonials">
        <Testimonials />
      </div>
      <Footer />
    </div>
  );
}

export default Home;
