import React from "react";
import "./ReviewCard.css";

const ReviewCard = ({ name, reviewedBy, comment, rating }) => {
  return (
    <div className="review-card">
      <h3 className="review-title">{name}</h3>
      <p className="review_detail">
        Reviewed By: {reviewedBy}
      </p>
      <p className="review_detail">
        comment: {comment}
      </p>
      <p className="review_detail">
       Rating: {rating}
      </p>
    </div>
  );
};

export default ReviewCard;
