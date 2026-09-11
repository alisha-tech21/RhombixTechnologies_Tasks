import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { FaStar, FaHeart, FaChevronLeft, FaChevronRight } from "react-icons/fa";

import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import "../styles/FeaturedStays.css";

const FeaturedStays = () => {
  const [stays, setStays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedIds, setSavedIds] = useState([]);

  const scrollRef = useRef(null);

  const { isLoggedIn } = useAuth();

  // Fetch featured stays - public API
  useEffect(() => {
    const fetchStays = async () => {
      try {
        const response = await api.get("/properties");
        setStays(response.data);
      } catch (err) {
        console.error("Error fetching featured stays:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStays();
  }, []);

  // Fetch saved stays ONLY when user is logged in
  useEffect(() => {
    const fetchSavedStays = async () => {
      if (!isLoggedIn) {
        setSavedIds([]);
        return;
      }

      try {
        const response = await api.get("/users/me/saved-places");

        const savedPlaces = response.data.savedPlaces || [];

        setSavedIds(savedPlaces.map((place) => place._id));
      } catch (err) {
        console.error("Could not load saved stays:", err);
        setSavedIds([]);
      }
    };

    fetchSavedStays();
  }, [isLoggedIn]);

  const handleSave = async (propertyId) => {
    // Logged-out users must login before saving
    if (!isLoggedIn) {
      alert("Please login to save this stay.");
      return;
    }

    try {
      if (savedIds.includes(propertyId)) {
        await api.delete(`/users/me/saved-places/${propertyId}`);

        setSavedIds((prev) => prev.filter((id) => id !== propertyId));
      } else {
        await api.post(`/users/me/saved-places/${propertyId}`);

        setSavedIds((prev) => [...prev, propertyId]);
      }
    } catch (err) {
      console.error("Failed to update saved place:", err);

      alert(err.response?.data?.message || "Could not update saved stays.");
    }
  };

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
          {stays.map((stay) => {
            const isSaved = savedIds.includes(stay._id);

            return (
              <div className="stay-card" key={stay._id}>
                <div className="stay-image-container">
                  <span className="featured-badge">FEATURED</span>

                  <button
                    type="button"
                    className={`wishlist-btn ${isSaved ? "saved" : ""}`}
                    onClick={() => handleSave(stay._id)}
                    title={isSaved ? "Remove from saved" : "Save this stay"}
                  >
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
                      📍{" "}
                      {stay.destinationId?.name || stay.address || "Location"}
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

                    <Link to={`/property/${stay._id}`} className="book-now-btn">
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button className="scroll-btn right" onClick={() => scroll("right")}>
          <FaChevronRight />
        </button>
      </div>
    </section>
  );
};

export default FeaturedStays;
