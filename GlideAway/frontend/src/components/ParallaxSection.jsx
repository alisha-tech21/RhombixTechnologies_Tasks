import "../styles/ParallaxSection.css";

function ParallaxSection() {
  return (
    <section className="parallax-section">
      <div className="parallax-overlay">
        <div className="parallax-content">
          <span className="parallax-tag">READY FOR AN ADVENTURE?</span>
          <h2 className="parallax-title">Start Your Journey With Us Today</h2>
          <p className="parallax-desc">
            Explore breathtaking destinations, experience new cultures, and
            create memories that last a lifetime.
          </p>
          <button className="parallax-btn">
            Book Your Trip Now <span className="parallax-arrow">&rarr;</span>
          </button>
        </div>
      </div>
    </section>
  );
}

export default ParallaxSection;
