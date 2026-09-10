import { useNavigate } from "react-router-dom";
import "../styles/Hero.css";
import hero from "../assets/3bg.png";
import tokyoImg from "../assets/tokyo.png";
import parisImg from "../assets/paris.png";
import parkImg from "../assets/park.png";

const cards = [
  {
    location: "ASIA · JAPAN",
    name: "TOKYO CHERRY BLOSSOM",
    image: tokyoImg,
  },
  {
    location: "EUROPE · FRANCE",
    name: "PARIS RIVIERA ESCAPE",
    image: parisImg,
  },
  {
    location: "NORTH AMERICA · USA",
    name: "YOSEMITE NATIONAL PARK",
    image: parkImg,
  },
];

function Hero() {
  const navigate = useNavigate(); // React Router navigation hook
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  // Smooth scroll function
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // "Get Started" button click handler
  const handleGetStarted = () => {
    if (isLoggedIn) {
      scrollToSection("destinations");
    } else {
      navigate("/login"); // Aapki App.jsx ke mutabiq route "/login" hai
    }
  };

  return (
    <>
      <section
        className="hero"
        style={{
          backgroundImage: `url(${hero})`,
        }}
      >
        <div className="hero-overlay" />

        <div className="hero-inner">
          <div className="hero-copy">
            <span className="hero-tag">EXPLORE WORLD-CLASS DESTINATIONS</span>
            <h1 className="hero-title">
              DISCOVER <br />
              YOUR NEXT <br />
              <span className="hero-highlight">ADVENTURE</span>
            </h1>
            <p className="hero-desc">
              Explore breathtaking destinations, find amazing stays, and book
              your perfect getaway seamlessly with GlideAway.
            </p>
            <div className="hero-actions">
              <button
                className="btn-discover-location"
                onClick={() => scrollToSection("destinations")}
              >
                <span className="play-circle">
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
                DISCOVER LOCATION
              </button>

              {/* Get Started Button - Sirf tab show hoga jab user logged in na ho */}
              {!isLoggedIn && (
                <button className="btn-how-works" onClick={handleGetStarted}>
                  GET STARTED
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              )}
            </div>
          </div>

          <div className="hero-thumbs">
            {cards.map((card, idx) => (
              <div
                key={idx}
                className="hero-thumb"
                style={{ backgroundImage: `url(${card.image})` }}
              >
                <div className="hero-thumb-gradient" />
                <div className="hero-thumb-content">
                  <span className="hero-thumb-tag">{card.location}</span>
                  <h4 className="hero-thumb-title">{card.name}</h4>
                </div>
                <div className="hero-pin-icon">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="hero-search-wrapper">
        <div className="hero-search-box">
          <div className="search-input-group">
            <label>DESTINATION</label>
            <div className="input-with-icon">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <input type="text" placeholder="Where to go?" />
            </div>
          </div>

          <div className="search-input-group">
            <label>DATES</label>
            <div className="input-with-icon">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <input type="text" placeholder="Select Dates" />
            </div>
          </div>

          <div className="search-input-group">
            <label>GUESTS</label>
            <div className="input-with-icon">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <input type="text" placeholder="Add Guests" />
            </div>
          </div>

          <button className="btn-search-submit">
            Search
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </div>

        <div className="hero-features-strip">
          <div className="feature-box">
            <div className="feature-ico-wrap">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#0e7c86"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
            <div>
              <strong>Best Price Guarantee</strong>
              <p>Find the best deals</p>
            </div>
          </div>

          <div className="feature-box">
            <div className="feature-ico-wrap">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#0e7c86"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <div>
              <strong>24/7 Customer Support</strong>
              <p>We are here to help</p>
            </div>
          </div>

          <div className="feature-box">
            <div className="feature-ico-wrap">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#0e7c86"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <div>
              <strong>Secure Payments</strong>
              <p>Book with confidence</p>
            </div>
          </div>

          <div className="feature-box">
            <div className="feature-ico-wrap">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#0e7c86"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            </div>
            <div>
              <strong>Trusted by Travelers</strong>
              <p>4.8/5 from 10K+ reviews</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Hero;
