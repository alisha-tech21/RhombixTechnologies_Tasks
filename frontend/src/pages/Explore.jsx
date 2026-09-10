import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  MapPin,
  Star,
  Heart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../api/axios";
import "../styles/Explore.css";

function Explore() {
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(2000);

  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  const [sortBy, setSortBy] = useState("Recommended");
  const [currentPage, setCurrentPage] = useState(1);

  const [exploreItems, setExploreItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 2;

  // =========================================================
  // FETCH PROPERTIES FROM DATABASE
  // =========================================================

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await api.get("/properties");

        const properties = response.data.map((property) => ({
          id: property._id,
          title: property.name,
          location:
            property.address || property.destinationId?.name || "Location",
          type: property.type,
          rating: property.rating || 0,
          price:
            property.price || property.pricePerNight || property.priceFrom || 0,
          image:
            property.images?.[0] ||
            "https://images.unsplash.com/photo-1590523278191-995cbcda646b?w=800&q=80",
          amenities: property.amenities || [],
        }));

        setExploreItems(properties);
      } catch (error) {
        console.error("Failed to load properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // =========================================================
  // PROPERTY TYPES
  // =========================================================

  const propertyTypes = ["Villa", "Resort", "Hotel", "Apartment"];

  // =========================================================
  // AMENITIES
  // =========================================================

  const allAmenities = [
    "Infinity Pool",
    "Spa",
    "Ocean View",
    "Butler Service",
    "Private Beach",
  ];

  // =========================================================
  // TYPE FILTER
  // =========================================================

  const handleTypeToggle = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );

    setCurrentPage(1);
  };

  // =========================================================
  // AMENITY FILTER
  // =========================================================

  const handleAmenityToggle = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity],
    );

    setCurrentPage(1);
  };

  // =========================================================
  // CLEAR FILTERS
  // =========================================================

  const handleClearAll = () => {
    setSearchTerm("");
    setMinPrice(0);
    setMaxPrice(2000);
    setSelectedTypes([]);
    setSelectedAmenities([]);
    setCurrentPage(1);
  };

  // =========================================================
  // FILTER DATA
  // =========================================================

  const filteredItems = exploreItems
    .filter((item) => {
      const search = searchTerm.toLowerCase().trim();

      const matchesSearch =
        item.title.toLowerCase().includes(search) ||
        item.location.toLowerCase().includes(search);

      const matchesType =
        selectedTypes.length === 0 || selectedTypes.includes(item.type);

      const matchesPrice = item.price >= minPrice && item.price <= maxPrice;

      const matchesAmenities =
        selectedAmenities.length === 0 ||
        selectedAmenities.every((amenity) => item.amenities.includes(amenity));

      return matchesSearch && matchesType && matchesPrice && matchesAmenities;
    })
    .sort((a, b) => {
      if (sortBy === "PriceLow") {
        return a.price - b.price;
      }

      if (sortBy === "PriceHigh") {
        return b.price - a.price;
      }

      if (sortBy === "Rating") {
        return b.rating - a.rating;
      }

      return 0;
    });

  // =========================================================
  // PAGINATION
  // =========================================================

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;

  const indexOfLastItem = currentPage * itemsPerPage;

  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="explore-page">
        <Navbar />

        <div
          style={{
            minHeight: "60vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h3>Loading properties...</h3>
        </div>

        <Footer />
      </div>
    );
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="explore-page">
      <Navbar />

      {/* TOP SEARCH BANNER */}

      <div className="explore-top-banner">
        <div className="explore-banner-content">
          <h1>Explore Stays & Destinations</h1>

          <p>Find your next dream getaway with exclusive places to stay.</p>

          <div className="explore-main-search">
            <Search size={20} className="banner-search-icon" />

            <input
              type="text"
              placeholder="Search by destination, city, or property name..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
      </div>

      <div className="explore-main-container">
        {/* =====================================================
            SIDEBAR
        ===================================================== */}

        <aside className="explore-sidebar">
          <div className="filter-header">
            <h3>Filters</h3>

            <button onClick={handleClearAll} className="clear-btn">
              Clear all
            </button>
          </div>

          {/* PRICE */}

          <div className="filter-section">
            <label className="filter-label">Price Range (per night)</label>

            <div className="price-inputs">
              <div className="price-box">
                <span>$</span>

                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => {
                    setMinPrice(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                />
              </div>

              <span className="price-dash">–</span>

              <div className="price-box">
                <span>$</span>

                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>

            <input
              type="range"
              min="0"
              max="2000"
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="price-slider"
            />
          </div>

          {/* PROPERTY TYPE */}

          <div className="filter-section">
            <label className="filter-label">Property Type</label>

            <div className="checkbox-list">
              {propertyTypes.map((type) => (
                <label key={type} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(type)}
                    onChange={() => handleTypeToggle(type)}
                  />

                  <span>{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* AMENITIES */}

          <div className="filter-section">
            <label className="filter-label">Amenities</label>

            <div className="amenities-pills">
              {allAmenities.map((amenity) => (
                <button
                  key={amenity}
                  className={`amenity-pill ${
                    selectedAmenities.includes(amenity) ? "active" : ""
                  }`}
                  onClick={() => handleAmenityToggle(amenity)}
                >
                  {amenity}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* =====================================================
            CONTENT
        ===================================================== */}

        <main className="explore-content">
          <div className="explore-top-bar">
            <div>
              <h2 className="explore-title">Available Properties</h2>

              <p className="explore-count">
                {filteredItems.length} luxurious properties found
              </p>
            </div>

            <div className="sort-wrapper">
              <label>Sort by:</label>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="Recommended">Recommended</option>

                <option value="PriceLow">Price: Low to High</option>

                <option value="PriceHigh">Price: High to Low</option>

                <option value="Rating">Top Rated</option>
              </select>
            </div>
          </div>

          {/* =====================================================
              CARDS
          ===================================================== */}

          <div className="explore-grid-layout">
            {currentItems.length > 0 ? (
              currentItems.map((item) => (
                <div key={item.id} className="stay-card">
                  <div className="stay-img-box">
                    <img src={item.image} alt={item.title} />

                    <span className="stay-badge">
                      {item.type.toUpperCase()}
                    </span>

                    <button
                      className="wishlist-btn"
                      aria-label="Save to wishlist"
                    >
                      <Heart size={18} />
                    </button>
                  </div>

                  <div className="stay-details">
                    <div className="stay-header-row">
                      <h3>{item.title}</h3>

                      <div className="stay-rating">
                        <Star size={14} fill="#f59e0b" color="#f59e0b" />

                        <span>{item.rating}</span>
                      </div>
                    </div>

                    <div className="stay-location">
                      <MapPin size={13} />

                      {item.location}
                    </div>

                    <div className="stay-tags">
                      {item.amenities.map((amenity, idx) => (
                        <span key={idx} className="tag">
                          {amenity}
                        </span>
                      ))}
                    </div>

                    <div className="stay-footer">
                      <div className="stay-price">
                        <strong>${item.price}</strong>

                        <span>/night</span>
                      </div>

                      {/* IMPORTANT:
                          MongoDB _id is used here
                      */}

                      <Link
                        to={`/property/${item.id}`}
                        className="view-details-btn"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div
                className="explore-no-results"
                style={{
                  gridColumn: "1 / -1",
                  textAlign: "center",
                  padding: "40px",
                }}
              >
                <p>No properties match your filter criteria.</p>
              </div>
            )}
          </div>

          {/* =====================================================
              PAGINATION
          ===================================================== */}

          {totalPages > 1 && (
            <div className="pagination-container">
              <button
                className="page-arrow"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  className={`page-num ${
                    currentPage === index + 1 ? "active" : ""
                  }`}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              ))}

              <button
                className="page-arrow"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default Explore;
