import "../styles/CTA.css";
import parkImg from "../assets/park.png";
import tokyoImg from "../assets/tokyo.png";
import parisImg from "../assets/paris.png";
import beachImg from "../assets/beach.png";
import dubaiImg from "../assets/dubai.png";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Compass } from "lucide-react";

function CTA() {
  const navigate = useNavigate();
  return (
    <section className="cta-banner-section">
      <div className="cta-container">
        {/* Background Decorative Glow */}
        <div className="cta-bg-glow"></div>

        {/* Left Content */}
        <div className="cta-left">
          <span className="cta-tag">
            <Compass size={14} /> YOUR JOURNEY AWAITS
          </span>
          <h2 className="cta-title">
            Where will you <br /> go next?
          </h2>
          <p className="cta-desc">
            Discover amazing places and create unforgettable memories with our
            curated travel experiences, exclusive fares, and custom guides.
          </p>
          <button className="cta-btn" onClick={() => navigate("/explore")}>
            Explore Destinations <ArrowRight size={16} className="cta-arrow" />
          </button>
        </div>

        {/* Right Stacked Image Cards with Balanced Gap & Alignment */}
        <div className="cta-right-images">
          <div className="cta-card-item cta-img-1">
            <img src={parkImg} alt="Destination 1" />
          </div>
          <div className="cta-card-item cta-img-2">
            <img src={tokyoImg} alt="Destination 2" />
          </div>
          <div className="cta-card-item cta-img-3">
            <img src={parisImg} alt="Featured Center Destination" />
          </div>
          <div className="cta-card-item cta-img-4">
            <img src={beachImg} alt="Destination 4" />
          </div>
          <div className="cta-card-item cta-img-5">
            <img src={dubaiImg} alt="Destination 5" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTA;
