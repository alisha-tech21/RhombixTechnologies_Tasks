import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, Compass, ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/Destinations.css";

function Destinations() {
  const [searchTerm, setSearchTerm] = useState("");

  const destinationsList = [
    {
      id: 1,
      name: "Bali, Indonesia",
      propertiesCount: "42 Properties",
      description: "Tropical beaches, volcanic mountains, and iconic temples.",
      image:
        "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 2,
      name: "Swiss Alps, Switzerland",
      propertiesCount: "28 Properties",
      description:
        "Breathtaking snowy peaks, luxury chalets, and skiing tracks.",
      image:
        "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 3,
      name: "Santorini, Greece",
      propertiesCount: "35 Properties",
      description:
        "White-washed buildings, magnificent sunsets, and blue domes.",
      image:
        "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 4,
      name: "Kyoto, Japan",
      propertiesCount: "19 Properties",
      description:
        "Traditional bamboo forests, historical temples, and serene gardens.",
      image:
        "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 5,
      name: "Maldives",
      propertiesCount: "22 Properties",
      description:
        "Crystal clear turquoise lagoons and overwater luxury villas.",
      image:
        "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 6,
      name: "Paris, France",
      propertiesCount: "50 Properties",
      description:
        "The city of love, art, fashion, and world-class architecture.",
      image:
        "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80",
    },
  ];

  const filteredDestinations = destinationsList.filter(
    (dest) =>
      dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dest.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="destinations-page">
      <Navbar />

      {/* Hero Banner */}
      <div className="destinations-hero">
        <div className="destinations-hero-content">
          <h1>Top Destinations Around The World</h1>
          <p>
            Discover your dream locations and start planning your next great
            adventure.
          </p>
          <div className="destinations-search-box">
            <Search size={20} className="dest-search-icon" />
            <input
              type="text"
              placeholder="Search countries, cities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="destinations-container">
        <div className="destinations-grid">
          {filteredDestinations.length > 0 ? (
            filteredDestinations.map((dest) => (
              <div key={dest.id} className="destination-card">
                <div className="dest-img-wrapper">
                  <img src={dest.image} alt={dest.name} />
                  <span className="dest-badge">{dest.propertiesCount}</span>
                </div>
                <div className="dest-info">
                  <div className="dest-location-title">
                    <MapPin size={16} color="#0e7c86" />
                    <h3>{dest.name}</h3>
                  </div>
                  <p>{dest.description}</p>
                  <Link to="/explore" className="explore-dest-btn">
                    Explore Stays <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="dest-no-results">
              <p>No destinations found matching your search.</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Destinations;
