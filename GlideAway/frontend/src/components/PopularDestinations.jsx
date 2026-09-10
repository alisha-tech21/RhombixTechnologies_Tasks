import "../styles/PopularDestinations.css";

import { Link } from "react-router-dom";
import turkey from "../assets/turkey.png";
import baliImg from "../assets/bali.png";
import maldivesImg from "../assets/maldives.png";
import parisImg from "../assets/paris1.png";

function Destinations() {
  return (
    <section className="destinations-grid-section">
      {/* Header */}
      <div className="destinations-header-row">
        <div>
          <h2 className="section-main-title">POPULAR DESTINATIONS</h2>
          <p className="section-subtitle">
            Explore the places everyone is talking about
          </p>
        </div>
        <Link to="/destinations" className="view-all-link">
          View all &rarr;
        </Link>
      </div>

      {/* Main Bento Grid: 1 Big Left Card + 3 Right Cards */}
      <div className="destinations-bento-grid">
        {/* Left Big Card (Istanbul) */}
        <div className="bento-card card-istanbul">
          <div
            className="bento-card-bg"
            style={{ backgroundImage: `url(${turkey})` }}
          />
          <div className="bento-gradient-overlay" />
          <div className="bento-content">
            <span className="bento-price">$1,249</span>
            <div className="bento-text-block">
              <h3 className="bento-title">Istanbul</h3>
              <span className="bento-country">Turkey</span>
              <p className="bento-desc">
                Where rich history, vibrant culture, and two continents meet.
              </p>
            </div>
          </div>
        </div>

        {/* Right Top-Left Card (Bali) */}
        <div className="bento-card card-bali">
          <div
            className="bento-card-bg"
            style={{ backgroundImage: `url(${baliImg})` }}
          />
          <div className="bento-gradient-overlay" />
          <div className="bento-content">
            <span className="bento-price">$1,249</span>
            <div className="bento-text-block">
              <h3 className="bento-title">Bali</h3>
              <span className="bento-country">Indonesia</span>
              <p className="bento-desc">A tropical dream...</p>
            </div>
          </div>
        </div>

        {/* Right Top-Right Card (Maldives) */}
        <div className="bento-card card-maldives">
          <div
            className="bento-card-bg"
            style={{ backgroundImage: `url(${maldivesImg})` }}
          />
          <div className="bento-gradient-overlay" />
          <div className="bento-content">
            <span className="bento-price">$1,249</span>
            <div className="bento-text-block">
              <h3 className="bento-title">Maldives</h3>
              <p className="bento-desc">Crystal clear waters...</p>
            </div>
          </div>
        </div>

        {/* Right Bottom Wide Card (Paris) */}
        <div className="bento-card card-paris">
          <div
            className="bento-card-bg"
            style={{ backgroundImage: `url(${parisImg})` }}
          />
          <div className="bento-gradient-overlay" />
          <div className="bento-content">
            <span className="bento-price">$1,249</span>
            <div className="bento-text-block">
              <h3 className="bento-title">Paris</h3>
              <span className="bento-country">France</span>
              <p className="bento-desc">
                The city of timeless charm, iconic landmarks...
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Destinations;
