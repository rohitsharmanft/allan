import React from "react";
import "./LeaveReviewCard.css";

const LeaveReviewCard = ({ icon, iconAlt, title, description, buttonText }) => {
  return (
    <div className="review_card_">
      {typeof icon === "string" ? (
        <img src={icon} alt={iconAlt || title} className="review-card-img" />
      ) : (
        <div className="review-card-icon">{icon}</div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
      <button className="review_btn">{buttonText}</button>
    </div>
  );
};

export default LeaveReviewCard;     
