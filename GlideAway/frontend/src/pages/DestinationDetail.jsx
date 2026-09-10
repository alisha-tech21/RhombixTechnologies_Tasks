import { useParams, Link } from "react-router-dom";
import { MapPin, Star, Calendar, Users, ArrowLeft } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/DestinationDetail.css";

function DestinationDetail() {
  const { id } = useParams();

  // Sample data for Hunza Valley matching your screenshot
  const destination = {
    id: id || 1,
    title: "Hunza Valley",
    location: "Gilgit-Baltistan, Pakistan",
    rating: 4.9,
    reviews: 120,
    tags: ["Mountains", "Culture"],
    price: 1200,
    description:
      "Nestled in the majestic Karakoram Range, the Hunza Valley is a pristine paradise often referred to as 'Shangri-La'. Known for its breathtaking scenery, vibrant autumn colors, and the exceptional longevity of its people, this high-altitude valley offers a serene escape. Explore ancient forts, wander through terraced orchards, and experience the warm hospitality of the local communities against a backdrop of snow-capped peaks.",
    mainImage:
      "https://images.unsplash.com/photo-1586517178759-4d6d67b2d294?auto=format&fit=crop&w=1000&q=80",
    sideImages: [
      "https://images.unsplash.com/photo-1605648916361-9bc12ad6a566?auto=format&fit=crop&w=500&q=80",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=500&q=80",
    ],
    attractions: [
      {
        name: "Baltit Fort",
        desc: "A 700-year-old fort offering panoramic views of the valley, showcasing traditional architecture.",
        image:
          "https://images.unsplash.com/photo-1590073844006-33379778ae09?auto=format&fit=crop&w=500&q=80",
      },
      {
        name: "Attabad Lake",
        desc: "A stunning turquoise lake born from a landslide, perfect for boating and taking in the scenery.",
        image:
          "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=500&q=80",
      },
    ],
  };

  return (
    <div className="dest-detail-page">
      <Navbar />

      <div className="dest-detail-container">
        {/* Back Link */}
        <Link to="/destinations" className="back-link">
          <ArrowLeft size={16} /> Back to Destinations
        </Link>

        {/* Image Gallery Grid */}
        <div className="dest-gallery-grid">
          <div className="main-img-box">
            <img src={destination.mainImage} alt={destination.title} />
          </div>
          <div className="side-img-box">
            {destination.sideImages.map((img, index) => (
              <img key={index} src={img} alt={`Gallery ${index}`} />
            ))}
          </div>
        </div>

        {/* Content & Booking Section Grid */}
        <div className="dest-content-booking-grid">
          {/* Left Info Area */}
          <div className="dest-main-info">
            <div className="location-row">
              <MapPin size={15} color="#0e7c86" />
              <span>{destination.location}</span>
            </div>
            <h1 className="dest-main-title">{destination.title}</h1>

            <div className="dest-meta-row">
              <div className="dest-rating">
                <Star size={16} fill="#f59e0b" color="#f59e0b" />
                <strong>{destination.rating}</strong>
                <span>({destination.reviews} Reviews)</span>
              </div>
              <div className="dest-tags-list">
                {destination.tags.map((tag, idx) => (
                  <span key={idx} className="dest-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="dest-about-section">
              <h2>About {destination.title}</h2>
              <p>{destination.description}</p>
            </div>

            {/* Must-See Attractions */}
            <div className="attractions-section">
              <h2>Must-See Attractions</h2>
              <div className="attractions-grid">
                {destination.attractions.map((attr, idx) => (
                  <div key={idx} className="attraction-card">
                    <img src={attr.image} alt={attr.name} />
                    <div className="attr-info">
                      <h3>{attr.name}</h3>
                      <p>{attr.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Booking Card Sidebar */}
          <div className="dest-booking-sidebar">
            <div className="booking-card">
              <div className="booking-price-header">
                <strong>${destination.price}</strong> <span>/ person</span>
              </div>

              <div className="booking-inputs">
                <div className="input-group">
                  <label>CHECK-IN - CHECK-OUT</label>
                  <div className="input-field-mock">
                    <span>Select dates</span>
                    <Calendar size={18} color="#64748b" />
                  </div>
                </div>

                <div className="input-group">
                  <label>TRAVELERS</label>
                  <div className="input-field-mock">
                    <span>2 Travelers</span>
                    <Users size={18} color="#64748b" />
                  </div>
                </div>
              </div>

              <button className="book-journey-btn">
                Book Your Journey &rarr;
              </button>

              <p className="booking-note">You won't be charged yet</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default DestinationDetail;
