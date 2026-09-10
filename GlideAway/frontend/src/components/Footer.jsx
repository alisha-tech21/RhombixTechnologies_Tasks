import { Link } from "react-router-dom";
import { IconCompass } from "./Icons";
import "../styles/Footer.css";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-col footer-brand-col">
          <span className="footer-brand">
            <IconCompass /> GlideAway
          </span>
          <p>
            Your trusted partner for premium travel experiences. We make
            exploring the world easy, secure, and affordable.
          </p>
          <div className="footer-social">
            <a href="#" aria-label="Facebook">
              f
            </a>
            <a href="#" aria-label="Instagram">
              ◎
            </a>
            <a href="#" aria-label="Twitter">
              𝕏
            </a>
          </div>
        </div>

        <div className="footer-col">
          <h5>Company</h5>
          <ul>
            <li>
              <a href="#">About Us</a>
            </li>
            <li>
              <a href="#">Careers</a>
            </li>
            <li>
              <a href="#">Travel Blog</a>
            </li>
            <li>
              <a href="#">Press</a>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h5>Support</h5>
          <ul>
            <li>
              <a href="#">Help Center</a>
            </li>
            <li>
              <a href="#">Safety Information</a>
            </li>
            <li>
              <a href="#">Cancellation Options</a>
            </li>
            <li>
              <a href="#">Contact Us</a>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h5>Newsletter</h5>
          <p>Subscribe for the latest travel news and deals.</p>
          <form
            className="footer-newsletter"
            onSubmit={(e) => e.preventDefault()}
          >
            <input type="email" placeholder="Your email address" required />
            <button type="submit">&rarr;</button>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 GlideAway Travel. All rights reserved.</span>
        <div>
          <Link to="#">Privacy Policy</Link>
          <Link to="#">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
