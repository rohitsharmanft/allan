import React from "react";
import "./ReviewCard.css";

const ReviewCard = ({ name, reviewedBy, comment, rating }) => {
  return (
    <div className="review-card">
      <h3 className="review-title">{name}</h3>
      <p className="review-detail">
        {reviewedBy}
      </p>
      <p className="review-detail">
         {comment}
      </p>
      <p className="review-detail">
         {rating}
      </p>
    </div>
  );
};

export default ReviewCard;
