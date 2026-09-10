import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaStar, FaHeart, FaChevronLeft, FaChevronRight } from "react-icons/fa";

import "../styles/FeaturedStays.css";

const FeaturedStays = () => {
  const [stays, setStays] = useState([]);
  const [loading, setLoading] = useState(true);

  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchStays = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/properties",
        );

        setStays(response.data);
      } catch (err) {
        console.error("Error fetching featured stays:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStays();
  }, []);

  const scroll = (direction) => {
    if (!scrollRef.current) return;

    const { scrollLeft, clientWidth } = scrollRef.current;

    const scrollAmount = clientWidth / 3;

    scrollRef.current.scrollTo({
      left:
        direction === "left"
          ? scrollLeft - scrollAmount
          : scrollLeft + scrollAmount,
      behavior: "smooth",
    });
  };

  if (loading) {
    return <div className="featured-loading">Loading featured stays...</div>;
  }

  return (
    <section className="featured-stays-section">
      <div className="featured-header">
        <div>
          <h2>Featured Stays</h2>

          <p>Handpicked stays for your perfect getaway</p>
        </div>

        <Link to="/explore" className="view-all-link">
          View all →
        </Link>
      </div>

      <div className="stays-container-wrapper">
        <button className="scroll-btn left" onClick={() => scroll("left")}>
          <FaChevronLeft />
        </button>

        <div className="stays-grid" ref={scrollRef}>
          {stays.map((stay) => (
            <div className="stay-card" key={stay._id}>
              <div className="stay-image-container">
                <span className="featured-badge">FEATURED</span>

                <button className="wishlist-btn">
                  <FaHeart />
                </button>

                <img
                  src={
                    stay.images && stay.images.length > 0
                      ? stay.images[0]
                      : "https://images.unsplash.com/photo-1590523278191-995cbcda646b?w=800&q=80"
                  }
                  alt={stay.name}
                  className="stay-image"
                />
              </div>

              <div className="stay-content">
                <div className="stay-location">
                  <span>
                    📍 {stay.destinationId?.name || stay.address || "Location"}
                  </span>
                </div>

                <h3 className="stay-name">{stay.name}</h3>

                <div className="stay-rating">
                  <FaStar className="star-icon" />

                  <span className="rating-num">{stay.rating || "4.8"}</span>

                  <span className="reviews-count">
                    ({stay.reviewsCount || 0} reviews)
                  </span>
                </div>

                <div className="stay-footer">
                  <div className="price-box">
                    <span className="price-amount">
                      ${stay.priceFrom || stay.price || 150}
                    </span>

                    <span className="price-unit">/ night</span>
                  </div>

                  {/* FIXED ROUTE */}

                  <Link to={`/property/${stay._id}`} className="book-now-btn">
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="scroll-btn right" onClick={() => scroll("right")}>
          <FaChevronRight />
        </button>
      </div>
    </section>
  );
};

export default FeaturedStays;
