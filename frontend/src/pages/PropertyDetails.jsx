import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
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

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError("");

    api
      .get(`/properties/${id}`)
      .then((res) => {
        setProperty(res.data.property);
        setRooms(res.data.rooms || []);
        setReviews(res.data.reviews || []);
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

  function handleSelectRoom(room) {
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
        roomId: room._id,
        roomName: room.name,
        pricePerNight: room.pricePerNight,
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
        <div className="booking-container">
          <p>Loading property...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="booking-page">
        <div className="booking-container">
          <Link to="/explore" className="booking-back">
            ← Back to search
          </Link>

          <h2>Property not found</h2>

          <p style={{ color: "#c0392b", marginTop: "10px" }}>
            {error || "This property does not exist."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page">
      <div className="booking-container">
        <Link to="/explore" className="booking-back">
          ← Back to search
        </Link>

        {/* PROPERTY HEADER */}
        <div className="property-header">
          <h1>
            {property.name}

            <span className="rating-badge">
              ★ {property.rating} ({property.reviewsCount})
            </span>
          </h1>

          <span className="loc">{property.address}</span>
        </div>

        {/* GALLERY */}
        <div className="property-gallery">
          {property.images?.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${property.name} ${index + 1}`}
            />
          ))}
        </div>

        {/* AMENITIES */}
        <div className="property-amenities">
          {property.amenities?.map((amenity) => (
            <span key={amenity}>{amenity}</span>
          ))}
        </div>

        {/* DESCRIPTION */}
        <p
          style={{
            color: "#4a6079",
            fontSize: "14px",
            lineHeight: 1.6,
            marginBottom: "28px",
            maxWidth: "700px",
          }}
        >
          {property.description}
        </p>

        {/* BOOKING DATES */}
        <div className="booking-dates-bar">
          <div>
            <label>Check-in</label>

            <input
              type="date"
              value={checkIn}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setCheckIn(e.target.value)}
            />
          </div>

          <div>
            <label>Check-out</label>

            <input
              type="date"
              value={checkOut}
              min={checkIn || new Date().toISOString().split("T")[0]}
              onChange={(e) => setCheckOut(e.target.value)}
            />
          </div>

          <div>
            <label>Guests</label>

            <input
              type="number"
              min="1"
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
            />
          </div>
        </div>

        {/* ROOMS */}
        <h3
          style={{
            fontSize: "17px",
            marginBottom: "14px",
          }}
        >
          Available rooms
        </h3>

        <div className="rooms-list">
          {rooms.length > 0 ? (
            rooms.map((room) => (
              <div className="room-card" key={room._id}>
                <img
                  src={room.images?.[0] || property.images?.[0]}
                  alt={room.name}
                />

                <div className="room-card-info">
                  <h4>{room.name}</h4>

                  <span className="meta">
                    {room.guests} Guests · {room.beds}
                  </span>
                </div>

                <div className="room-card-price">
                  <span className="amount">${room.pricePerNight}</span>

                  <span className="unit">per night</span>

                  <button onClick={() => handleSelectRoom(room)}>
                    Select Room
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No rooms are currently available for this property.</p>
          )}
        </div>

        {/* REVIEWS */}
        {reviews.length > 0 && (
          <div style={{ marginTop: "40px" }}>
            <h3>Guest Reviews</h3>

            {reviews.map((review) => (
              <div
                key={review._id}
                style={{
                  padding: "15px 0",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                <strong>{review.userId?.name || "Guest"}</strong>

                {review.rating && (
                  <span style={{ marginLeft: "10px" }}>★ {review.rating}</span>
                )}

                <p>{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PropertyDetails;
