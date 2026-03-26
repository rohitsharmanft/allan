import React from "react";
import "./CompanyCard.css";
import { StarFilled } from "@ant-design/icons";
import { FaFacebook, FaGlobe, FaLinkedin, FaTiktok } from "react-icons/fa";
import { AiFillInstagram } from "react-icons/ai";
import { FaXTwitter } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import GradientButton from "./GradientButton";
import { Rate } from "antd";


const CompanyCard = ({
  businessTradingName,
  clientCount,
  profileAvgRating,
  skills,
  socialLinks,
  workLocation,
  phoneIcon,
  mailIcon,
  whatsappIcon,
  webIcon,
  logo,
  profileData,
  companyData,
  locationName,
  categoryData
}) => {
  const navigate = useNavigate();

  const allLinks = {
    facebook: <FaFacebook />,
    instagram: <AiFillInstagram />,
    linkedin: <FaLinkedin />,
    tiktok: <FaTiktok />,
    twitter: <FaXTwitter />,
    website: <FaGlobe />
  }

  console.log("socialLinks: ", socialLinks[0])
  return (
    <div className="company-card">
      <div className="card-left">
        <h3 className="company-name">{skills.join(", ")}</h3>

        <div className="company-rating">
          {clientCount > 0 ? (
            <>
              {clientCount} reviews /{" "}
              <span className="rating-value">{profileAvgRating}</span>
            </>
          ) : (
            "No Rating"
          )}
          {/* {[...Array(5)].map((_, i) => (
            <StarFilled
              key={i}
              style={{
                color: i < Math.round(profileAvgRating) ? "#f4b400" : "#d9d9d9",
                fontSize: "14px",
              }}
            />
          ))} */}
          <span><Rate disabled value={parseFloat(profileAvgRating) || 0} allowHalf /></span>        
        </div>

        <p className="company-desc">Online skills platforskm in {workLocation || "N/A"}</p>
        <p className="company-location">
          <strong>Location:</strong> {workLocation || "N/A"}
        </p>

        <GradientButton
          text={"View Profile"}
          className="change-password-btn "
          onClick={() => navigate('/skill-trades', { state: { companyData, profileData, categoryData, locationName } })}
        />
        {/* <div className="company-icons">
          <img src={phoneIcon} alt="phone" />
          <img src={mailIcon} alt="mail" />
          <img src={whatsappIcon} alt="whatsapp" />
          <img src={webIcon} alt="web" />
        </div> */}

        {/* <div
          className="social-links-container"
        >
          {
            Object.keys(socialLinks)?.map((link, i) => (
              socialLinks[link] !== "" &&
              <div
                className="company-icons"
                key={i}
                onClick={() => window.open(socialLinks[link], '_blank')}
                style={{ cursor: "pointer" }}>
                {allLinks[link]}
              </div>
            ))
          }
        </div> */}
      </div>

      <div className="card-right">
        <img src={logo} alt={businessTradingName} />
      </div>
    </div>
  );
};

export default CompanyCard;
