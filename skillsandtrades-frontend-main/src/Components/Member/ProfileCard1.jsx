import React from "react";
import "./ProfileCard.css";
import GradientButton from "../Common/GradientButton";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";

const ProfileCard1 = ({ name, reviews, rating, description, location, image, onClicked, buttonText, userName, childern }) => {
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <FaStar key={`full-${i}`} style={{ color: "#ffc107" }} />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <FaStarHalfAlt key="half" style={{ color: "#ffc107" }} />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <FaStar key={`empty-${i}`} style={{ color: "#e0e0e0" }} />
      );
    }
    return stars;
  };

  return (
    <div className="profile-card">
      <div className="profile-card-body">
        <div className="profile-inner">
          <div>
            {" "}
            <h3>{name}</h3>
            <p>{childern}: {userName}</p>
            <p>
              {reviews} reviews / {rating} {renderStars(rating)}
            </p>
            <p>{description}</p>
            <p>
              <strong>Location:</strong> {location}
            </p>
          </div>
          <div>
            {" "}
            <div className="profile-card-header">
              <img src={image} alt={name} className="profile-logo" />
            </div>
          </div>
        </div>
      </div>
      <div className="profile-card-footer">
        {name && <GradientButton className="edit-btn" onClick={onClicked} text={buttonText} />}

      </div>
    </div>
  );
};

export default ProfileCard1;
