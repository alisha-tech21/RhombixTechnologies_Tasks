import { ShieldCheck, Headphones, Map, Award } from "lucide-react";
import "../styles/Services.css";

function Services() {
  const serviceList = [
    {
      icon: <Map size={28} color="#0e7c86" />,
      title: "Custom Itineraries",
      desc: "Tailored travel plans designed specifically to match your dream destinations, schedule, and preferences.",
    },
    {
      icon: <ShieldCheck size={28} color="#0e7c86" />,
      title: "Secure Booking",
      desc: "Book your stays and trips with confidence using our safe, encrypted, and reliable payment systems.",
    },
    {
      icon: <Headphones size={28} color="#0e7c86" />,
      title: "24/7 Support",
      desc: "Our dedicated travel experts are available around the clock to assist you anywhere in the world.",
    },
    {
      icon: <Award size={28} color="#0e7c86" />,
      title: "Best Price Guarantee",
      desc: "Enjoy exclusive deals, premium discounts, and unbeatable rates across all our listed destinations.",
    },
  ];

  return (
    <section className="services-section">
      <div className="services-container">
        <div className="services-header">
          <span className="services-tag">WHAT WE OFFER</span>
          <h2 className="services-title">Our Premium Services</h2>
          <p className="services-subtitle">
            We go above and exceptional lengths to ensure your journey is
            seamless, comfortable, and unforgettable.
          </p>
        </div>

        <div className="services-grid">
          {serviceList.map((item, index) => (
            <div key={index} className="service-card">
              <div className="service-icon-box">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;
