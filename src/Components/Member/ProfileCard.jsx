import React from "react";
import "./ProfileCard.css";
import GradientButton from "../Common/GradientButton";
// import GradientButton from "../GradientButton";

const ProfileCard = ({
  name,
  reviews,
  rating,
  description,
  location,
  image,
  onEdit,
  onView,
  buttonText1,
  buttonText2,
  showButton2 = false,
}) => {

  const renderStars = () => {
    const maxStars = 5;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <>
        {[...Array(fullStars)].map((_, i) => (
          <span key={`full-${i}`} className="star full">★</span>
        ))}
        {hasHalfStar && <span className="star half">★</span>}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} className="star empty">☆</span>
        ))}
      </>
    );
  };

  const displayRating = rating > 0 ? rating.toFixed(1) : "No ratings yet";
  return (
    <div className="profile-card">
      <div className="profile-card-body">
        <div className="profile-inner">
          <div>
            {" "}
            <h3>{name}</h3>
            <p>
              {reviews} reviews /{displayRating}{renderStars()}
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
        <GradientButton className="edit-btn" onClick={onEdit} text={buttonText1}>
        </GradientButton>
        {showButton2 && (
          <GradientButton
            text={buttonText2}
            className="change-password-btn "
            onClick={onView}
          // add className or other props as needed
          />
        )}
      </div>
    </div >
  );
};

export default ProfileCard;
