import "../styles/Testimonials.css";

function Testimonials() {
  const reviews = [
    {
      id: 1,
      name: "Sarah Jenkins",
      role: "Adventure Traveler",
      comment:
        "The trip to Bali was seamlessly organized. Every single detail exceeded my expectations. Highly recommended!",
      rating: 5,
      location: "Bali Tour",
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Solo Explorer",
      comment:
        "Booking through this platform saved me time and money. The curated itineraries are absolute gold standard.",
      rating: 5,
      location: "Paris Getaway",
    },
    {
      id: 3,
      name: "Ayesha Malik",
      role: "Family Vacationer",
      comment:
        "Our Dubai family trip was unforgettable. Great customer support and wonderful hotel partnerships!",
      rating: 5,
      location: "Dubai Trip",
    },
  ];

  return (
    <section className="testimonials-section">
      <div className="testimonials-container">
        {/* Section Header */}
        <div className="testimonials-header">
          <span className="testimonials-tag">USER EXPERIENCES</span>
          <h2 className="testimonials-title">What Our Travelers Say</h2>
          <p className="testimonials-subtitle">
            Real stories and heartfelt feedback from explorers who journeyed
            with us.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="testimonials-grid">
          {reviews.map((item) => (
            <div className="testimonial-card" key={item.id}>
              {/* Rating Stars */}
              <div className="testimonial-stars">
                {[...Array(item.rating)].map((_, i) => (
                  <span key={i} className="star">
                    ★
                  </span>
                ))}
              </div>

              {/* Comment */}
              <p className="testimonial-comment">"{item.comment}"</p>

              {/* User Info */}
              <div className="testimonial-user-info">
                <div className="user-avatar">{item.name.charAt(0)}</div>
                <div>
                  <h4 className="user-name">{item.name}</h4>
                  <p className="user-role">
                    {item.role} •{" "}
                    <span className="user-loc">{item.location}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
