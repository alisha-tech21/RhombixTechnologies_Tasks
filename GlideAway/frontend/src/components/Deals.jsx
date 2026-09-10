import { useEffect, useState } from "react";
import "../styles/Deals.css";

import beachImg from "../assets/beach.png";
import baliImg from "../assets/bali riding.png";
import parisImg from "../assets/paris2.png";
import dubaiImg from "../assets/dubai.png";

import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../api/axios";

function Deals() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Static images map karne ke liye taake aapke original icons/images distrub na hon
  const dealImages = {
    "Summer Escape Getaway": beachImg,
    "Bali Tropical Escape": baliImg,
    "Romantic Paris Stay": parisImg,
    "Luxury Dubai Trip": dubaiImg,
  };

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const response = await api.get("/deals");
        setDeals(response.data.deals || []);
      } catch (error) {
        console.error("Failed to load deals:", error);
        setDeals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

  // Helper function to get property ID safely from a deal object
  const getPropId = (deal) => {
    return deal.propertyId?._id || deal.propertyId;
  };

  // Find specific deals by title for the fixed layout structure
  const summerDeal = deals.find((d) => d.title === "Summer Escape Getaway");
  const baliDeal = deals.find((d) => d.title === "Bali Tropical Escape");
  const parisDeal = deals.find((d) => d.title === "Romantic Paris Stay");
  const dubaiDeal = deals.find((d) => d.title === "Luxury Dubai Trip");

  return (
    <section className="exclusive-deals-section">
      {/* HEADER */}
      <div className="deals-header-row">
        <div>
          <h2 className="section-main-title">Exclusive Deals</h2>
          <p className="section-subtitle">
            Travel more, spend less with our handpicked offers
          </p>
        </div>

        <Link to="/explore" className="view-all-link">
          View all <ArrowRight size={16} />
        </Link>
      </div>

      {/* MAIN FEATURED DEAL (Summer Escape) */}
      <div className="main-deal-banner">
        <div className="main-deal-img-wrap">
          <img src={beachImg} alt="Summer Escape" className="main-deal-img" />
          <span className="main-deal-tag">
            <Sparkles size={14} />
            Limited Offer
          </span>
        </div>

        <div className="main-deal-content">
          <span className="main-deal-discount">Up to 25% OFF</span>
          <h3 className="main-deal-title">Summer Escape Getaway</h3>
          <p className="main-deal-desc">
            Enjoy an unforgettable coastal getaway at an exclusive member price.
            Includes resort perks and flexible booking.
          </p>

          {loading ? (
            <button className="btn-explore-deal" disabled>
              Loading...
            </button>
          ) : (
            <Link
              to={
                summerDeal && getPropId(summerDeal)
                  ? `/property/${getPropId(summerDeal)}`
                  : "/explore"
              }
              className="btn-explore-deal"
            >
              Explore Deal
            </Link>
          )}
        </div>
      </div>

      {/* BOTTOM 3 DEAL CARDS */}
      <div className="deals-bottom-grid">
        {/* ================= BALI ================= */}
        <Link
          to={
            baliDeal && getPropId(baliDeal)
              ? `/property/${getPropId(baliDeal)}`
              : "/explore"
          }
          className="deal-small-card"
        >
          <img src={baliImg} alt="Bali Escape" className="small-card-img" />
          <div className="small-card-overlay">
            <span className="small-card-discount">20% OFF</span>
            <h4 className="small-card-title">Bali Tropical Escape</h4>
          </div>
        </Link>

        {/* ================= PARIS ================= */}
        <Link
          to={
            parisDeal && getPropId(parisDeal)
              ? `/property/${getPropId(parisDeal)}`
              : "/explore"
          }
          className="deal-small-card"
        >
          <img src={parisImg} alt="Paris Stay" className="small-card-img" />
          <div className="small-card-overlay">
            <span className="small-card-discount">15% OFF</span>
            <h4 className="small-card-title">Romantic Paris Stay</h4>
          </div>
        </Link>

        {/* ================= DUBAI ================= */}
        <Link
          to={
            dubaiDeal && getPropId(dubaiDeal)
              ? `/property/${getPropId(dubaiDeal)}`
              : "/explore"
          }
          className="deal-small-card"
        >
          <img src={dubaiImg} alt="Dubai Trip" className="small-card-img" />
          <div className="small-card-overlay">
            <span className="small-card-discount">30% OFF</span>
            <h4 className="small-card-title">Luxury Dubai Trip</h4>
          </div>
        </Link>
      </div>
    </section>
  );
}

export default Deals;
