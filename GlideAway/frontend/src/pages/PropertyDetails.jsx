import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/Booking.css";

function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const [property, setProperty] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError("");

    api
      .get(`/properties/${id}`)
      .then((res) => {
        const propData = res.data.property;
        const roomsData = res.data.rooms || [];
        setProperty(propData);
        setRooms(roomsData);
        setReviews(res.data.reviews || []);
        if (roomsData.length > 0) {
          setSelectedRoom(roomsData[0]);
        }
      })
      .catch((err) => {
        console.error("Failed to load property:", err);
        setProperty(null);
        setError(
          err.response?.data?.message || "Unable to load this property.",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  // Calculate total nights and price
  const calculateNights = () => {
    if (!checkIn || !checkOut) return 1;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const nights = calculateNights();
  const activePrice =
    selectedRoom?.pricePerNight || property?.pricePerNight || 150;
  const totalPrice = activePrice * nights;

  function handleBookingSubmit(e) {
    e.preventDefault();
    if (!checkIn || !checkOut) {
      alert("Please choose check-in and check-out dates first.");
      return;
    }

    if (new Date(checkOut) <= new Date(checkIn)) {
      alert("Check-out date must be after check-in date.");
      return;
    }

    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    navigate("/checkout", {
      state: {
        propertyId: property._id,
        propertyName: property.name,
        propertyImage: property.images?.[0],
        roomId: selectedRoom?._id,
        roomName: selectedRoom?.name || "Standard Room",
        pricePerNight: activePrice,
        checkIn,
        checkOut,
        guests,
        rooms: 1,
      },
    });
  }

  if (loading) {
    return (
      <div className="booking-page">
        <Navbar />
        <div className="booking-container">
          <p style={{ textAlign: "center", padding: "60px" }}>
            Loading luxury experience...
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="booking-page">
        <Navbar />
        <div className="booking-container">
          <Link to="/explore" className="booking-back">
            ← Back to search
          </Link>
          <h2>Property not found</h2>
          <p style={{ color: "#c0392b", marginTop: "10px" }}>
            {error || "This property does not exist."}
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="booking-page">
      <Navbar />

      <div className="booking-container">
        {/* PROPERTY HEADER */}
        <div className="property-header">
          <h1>{property.name}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span className="loc">{property.address || property.location}</span>
            <span className="rating-badge">
              ★ {property.rating} ({property.reviewsCount || reviews.length}{" "}
              reviews)
            </span>
          </div>
        </div>

        {/* GALLERY LAYOUT (Main big image + 2 side images matching screenshot) */}
        <div className="property-gallery-grid">
          <div className="gallery-main">
            <img
              src={
                property.images?.[0] ||
                "https://images.unsplash.com/photo-1582719508461-905c673771fd"
              }
              alt={property.name}
            />
          </div>
          <div className="gallery-side">
            <img
              src={
                property.images?.[1] ||
                property.images?.[0] ||
                "https://images.unsplash.com/photo-1540541338287-41700207dee6"
              }
              alt={`${property.name} 2`}
            />
            <img
              src={
                property.images?.[2] ||
                property.images?.[0] ||
                "https://images.unsplash.com/photo-1566073771259-6a8506099945"
              }
              alt={`${property.name} 3`}
            />
          </div>
        </div>

        {/* MAIN CONTENT LAYOUT (Left Details + Right Floating Booking Box) */}
        <div className="property-details-layout">
          {/* LEFT COLUMN: Description, Amenities, Rooms, Map, Reviews */}
          <div className="property-main-content">
            <div className="experience-section">
              <h3>The Experience</h3>
              <p className="description-text">
                {property.description ||
                  "Nestled in the heart of the Maldives, this exclusive resort offers an unparalleled sanctuary of luxury and tranquility. Designed with exquisite architecture and blending seamlessly with the natural beauty of the Indian Ocean, experience firsthand luxury with bespoke service, world-class dining, and panoramic views that redefine the art of travel."}
              </p>

              <div className="amenities-icons-row">
                {property.amenities?.map((amenity, idx) => (
                  <div className="amenity-item" key={idx}>
                    <span>✦</span>
                    <span>{amenity}</span>
                  </div>
                )) || (
                  <>
                    <div className="amenity-item">
                      <span>✦</span>
                      <span>Overwater Pool</span>
                    </div>
                    <div className="amenity-item">
                      <span>✦</span>
                      <span>Butler Service</span>
                    </div>
                    <div className="amenity-item">
                      <span>✦</span>
                      <span>Fine Dining</span>
                    </div>
                    <div className="amenity-item">
                      <span>✦</span>
                      <span>Private Access</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* ACCOMMODATIONS / ROOMS LIST */}
            <div className="accommodations-section">
              <h3>Accommodations</h3>
              <div className="rooms-list">
                {rooms.length > 0 ? (
                  rooms.map((room) => (
                    <div
                      className={`room-card-modern ${selectedRoom?._id === room._id ? "active-room" : ""}`}
                      key={room._id}
                      onClick={() => setSelectedRoom(room)}
                    >
                      <img
                        src={room.images?.[0] || property.images?.[0]}
                        alt={room.name}
                      />
                      <div className="room-card-info">
                        <h4>{room.name}</h4>
                        <p className="room-desc">
                          {room.description ||
                            "Spacious suite with direct beach access and private ocean views."}
                        </p>
                        <span className="meta">
                          🛏️ {room.guests || 2} Guests · 📐{" "}
                          {room.beds || "King Bed"}
                        </span>
                      </div>
                      <div className="room-card-price">
                        <span className="amount">${room.pricePerNight}</span>
                        <span className="unit">/ night</span>
                        <button
                          type="button"
                          className={`select-room-btn ${selectedRoom?._id === room._id ? "selected" : ""}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRoom(room);
                          }}
                        >
                          {selectedRoom?._id === room._id
                            ? "Selected"
                            : "Select"}
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="room-card-modern">
                    <div className="room-card-info">
                      <h4>Deluxe Ocean Room</h4>
                      <p className="room-desc">
                        Luxurious room with direct ocean access and premium
                        amenities.
                      </p>
                      <span className="meta">🛏️ 2 Guests · King Bed</span>
                    </div>
                    <div className="room-card-price">
                      <span className="amount">$180</span>
                      <span className="unit">/ night</span>
                      <button className="select-room-btn selected">
                        Selected
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* LOCATION / MAP SECTION */}
            <div className="location-section">
              <h3>Location</h3>
              <div className="map-container-mock">
                <div className="map-badge-pin">
                  📍 {property.name} <br />
                  <small>
                    {property.address || "North Male Atoll, Maldives"}
                  </small>
                </div>
              </div>
            </div>

            {/* GUEST PERSPECTIVES / REVIEWS */}
            <div className="reviews-section">
              <h3>Guest Perspectives</h3>
              <div className="reviews-grid">
                {reviews.length > 0 ? (
                  reviews.map((rev) => (
                    <div className="review-card-box" key={rev._id}>
                      <div className="stars">★★★★★</div>
                      <p>"{rev.comment}"</p>
                      <span className="reviewer">
                        — {rev.userId?.name || "Verified Guest"}
                      </span>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="review-card-box">
                      <div className="stars">★★★★★</div>
                      <p>
                        "An absolute dream. The attention to detail in the
                        architecture, to just the way the staff greets you, made
                        an extraordinary vacation. Five stars!"
                      </p>
                      <span className="reviewer">— Alisha A.</span>
                    </div>
                    <div className="review-card-box">
                      <div className="stars">★★★★★</div>
                      <p>
                        "The infinity pool villa exceeded expectations. Maldives
                        at its finest! Every single detail of the stay was
                        exceptional."
                      </p>
                      <span className="reviewer">— Daniel K.</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Floating Booking Sidebar Widget */}
          <div className="property-sidebar">
            <div className="booking-widget-card">
              <div className="widget-price-header">
                <span className="big-price">${activePrice}</span>
                <span className="unit-text">/ per night</span>
              </div>

              <form onSubmit={handleBookingSubmit}>
                <div className="widget-dates-grid">
                  <div className="w-field">
                    <label>CHECK-IN</label>
                    <input
                      type="date"
                      value={checkIn}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => setCheckIn(e.target.value)}
                      required
                    />
                  </div>
                  <div className="w-field">
                    <label>CHECK-OUT</label>
                    <input
                      type="date"
                      value={checkOut}
                      min={checkIn || new Date().toISOString().split("T")[0]}
                      onChange={(e) => setCheckOut(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div
                  className="w-field full-width"
                  style={{ marginTop: "12px" }}
                >
                  <label>GUESTS</label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                  >
                    <option value={1}>1 Guest</option>
                    <option value={2}>2 Guests</option>
                    <option value={3}>3 Guests</option>
                    <option value={4}>4+ Guests</option>
                  </select>
                </div>

                <button type="submit" className="reserve-gold-btn">
                  Reserve
                </button>
              </form>

              <p className="no-charge-note">You won't be charged yet</p>

              <div className="price-calc-breakdown">
                <div className="calc-row">
                  <span>
                    ${activePrice} x {nights} nights
                  </span>
                  <span>${activePrice * nights}</span>
                </div>
                <div className="calc-row">
                  <span>Cleaning fee</span>
                  <span>$50</span>
                </div>
                <div className="calc-row total-row">
                  <span>Total</span>
                  <span>${totalPrice + 50}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM CTA SECTION */}
        <div className="bottom-cta-banner">
          <h2>Ready to start your journey?</h2>
          <p>
            Immerse yourself in the pinnacle of luxury. Secure your reservation
            at {property.name} today.
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="reserve-gold-btn inline-btn"
          >
            RESERVE NOW
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default PropertyDetails;
