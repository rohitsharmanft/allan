import React from "react";
import "./AboutSection.css";
import aboutImage from "../../../assets/images/aboutImage.jpg";
import b3 from "../../../assets/images/b3.jpg";
import GradientButton from "../../Common/GradientButton";
import star from "../../../assets/images/star.png"
import { useNavigate } from "react-router-dom";

const AboutSection = () => {
  const navigate = useNavigate();
  const handleLearn = () =>{
    navigate("/about-us")
  }
  return (
    <section className="about-section">
        <img src={star} alt="decoration" className="star-decor" />
      <div className="about-container">
        <div className="about-image-container">
          <img src={b3} alt="About" className="about-image" />
          <div className="floating-card">
            <h3>54</h3>
            <p>Countries</p>
            <div className="dividerr"></div>
          </div>    
        </div>

        <div className="about-content">
          <h2>About Our Company</h2>
          <p>
            Skills & Trades (Pvt) Ltd is a skills-focused business that connects
            clients and employers with freelancers, skilled professionals, SMEs,
            and trades companies. Our head office is located in Johannesburg,
            South Africa and our platform and business directory span all 54
            African countries.
          </p>
          <p>
            We market our website to a worldwide audience, creating a trusted
            digital marketplace that provides maximum visibility, global
            networking opportunities, and connections for our members.
          </p>
          <p>
            Why sign up with us? Our professionals, service providers, and trade
            companies are reviewed and rated by real clients who have completed
            projects through the platform. When you deliver quality work, you
            gain verified reviews, repeat projects, and ongoing business growth.
          </p>

          <GradientButton text={"Learn More"}className="learn-btn" onClick={handleLearn}></GradientButton>
        </div>

        
      </div>
    </section>
  );
};

export default AboutSection;
