import React from "react";
import "./Footer.css";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaWhatsapp,
  FaYoutube,
  FaTiktok,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Mastercard from "../../../assets/images/Mastercard.png";
import Visa from "../../../assets/images/Visa.png";
import MasterCard1 from "../../../assets/images/MasterCard1.png";
import Payfast from "../../../assets/images/Payfast.png";
import Verified from "../../../assets/images/Verified.jpg";
import { CiLocationOn } from "react-icons/ci";

import { MdOutlineEmail } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import FooterLogo from "../../../assets/images/FooterLogo.png";
const Footer = () => {
  const navigate = useNavigate();

  const handleWhatsapp = () => {
    window.open(
      `https://wa.me/27785759101?text=${encodeURIComponent("I am interested in your services as advertised on Skills and Trades Africa website")}`,
      "_blank",
    );
  };
  return (
    <>
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-left">
            <img
              src={FooterLogo}
              alt="Skills & Trades Africa"
              className="footer-logo-img"
            />

            <p className="footer-desc">
              We connect clients and employers with the best African skills for
              any assignment, job, project or task.
            </p>

            <div className="social-icons">
              <a
                href="https://www.facebook.com/skillsandtradesafrica"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebookF fontSize={18} />
              </a>
              <a
                href="https://www.instagram.com/skillsandtradesafrica"
                target="_blank"
              >
                <FaInstagram fontSize={18} />
              </a>
              <a
                href="https://www.linkedin.com/company/skillsandtrades/?originalSubdomain=za"
                target="_blank"
              >
                <FaLinkedinIn fontSize={18} />
              </a>
              <a
                href={`https://wa.me/27785759101?text=${encodeURIComponent("I am interested in your services as advertised on Skills and Trades Africa website")}`}
                target="_blank"
              >
                <FaWhatsapp fontSize={18} />
              </a>
              <a
                href="https://www.youtube.com/@SkillsTradesAfrica"
                target="_blank"
              >
                <FaYoutube fontSize={18} />
              </a>
              <a href="https://x.com/Skillsandtrades" target="_blank">
                <FaXTwitter fontSize={18} />
              </a>
              <a
                href="https://www.tiktok.com/@skillsandtradesafrica"
                target="_blank"
              >
                <FaTiktok fontSize={18} />
              </a>
            </div>
          </div>

          <div className="footer-links">
            <h3>Link</h3>
            <div className="link-columns">
              <ul>
                <li onClick={() => navigate("")}>What We Do</li>
                <li onClick={() => navigate("/how-it-works")}>How It Works</li>
                {/* <li onClick={() => navigate("/faqs-member")}>Member FAQs</li> */}
                <li onClick={() => navigate("/faqs-client")}>FAQs</li>
                <li onClick={() => navigate("/contact-us")}>Contact Us</li>
                <li onClick={() => navigate("/terms-&-conditions")}>
                  Terms & Conditions
                </li>
                <li onClick={() => navigate("/page-policy")}>
                  {" "}
                  Privacy Policy
                </li>
              </ul>
              <ul>
                <li onClick={() => navigate("/cookies-policy")}>Cookies</li>
                <li onClick={() => navigate("/about-us#disclaimer")}>
                  Disclaimer
                </li>
                <li
                  onClick={() => navigate("/skills-and-trades-code-of-ethics")}
                >
                  Code of ethics
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-contact">
            <h3>Contact</h3>
            <div
              className="iconss"
            >
              <FaWhatsapp className="icons" fontSize={20} />
              <p onClick={handleWhatsapp} style={{ cursor: "pointer" }} >+27 78 575 9101</p>
            </div>
            <div className="iconss">
              <CiLocationOn className="icons" fontSize={22} />{" "}
              <span className="l">
                158 Jan Smuts Ave, <br /> Rosebank, Johannesburg South Africa
              </span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <hr />
          <div className="footer-bottom-content">
            <div className="payment-icons-container">
              <img src={Visa} alt="Visa" className="payment-icon" />
              <img src={Mastercard} alt="MasterCard" className="payment-icon" />

              <img src={Payfast} alt="Payfast" className="payment-icon" />
              <img
                src={MasterCard1}
                alt="MasterCard"
                className="payment-icon"
              />
              <img
                src={Verified}
                alt="Verified"
                className="payment-icon verified-icon"
              />
            </div>
            <p>© Copyright 2025. All Rights Reserved</p>
          </div>
        </div>
      </footer>
    </>
  );
};
export default Footer;
