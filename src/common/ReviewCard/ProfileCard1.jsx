import React from "react";
import "./ProfileCard.css";
import GradientButton from "../GradientButton/GradientButton";
import defaultImg from "../../assets/logo.png";

const ProfileCard1 = ({
  title,
  description,
  rating,
  fullName,
  totalReviews,
  memberAvgRating,
  skills,
  country,
  image,
  onButtonClick,
  onEdit,
  buttonText,
  buttonText2
}) => {
  console.log(country)
  const handleClick = onButtonClick || onEdit || (() => { });
  const renderStars = (value) => {
    if (!value && value !== 0) return "";
    const maxStars = 5;
    const rounded = Math.round(value);
    return "★".repeat(rounded) + "☆".repeat(maxStars - rounded);
  };

  return (
    <div className="profile-card">
      <div className="profile-card-body">
        <div className="profile-inner">
          <div>
            {fullName && <h3>{fullName}</h3>}
            {title && <h4>{title}</h4>}
            {description && <p>{description}</p>}

            {totalReviews !== undefined && memberAvgRating !== undefined && (
              <p>{totalReviews} reviews / {renderStars(memberAvgRating)}</p>
            )}

            {rating !== undefined && <p>{renderStars(rating)}</p>}

            {skills && (
              <p>
                <strong>Skills:</strong>{" "}

                {Array.isArray(skills) ? skills.join(", ") : skills}
              </p>
            )}
            {country && <p><strong>Location:</strong> {country}</p>}
          </div>

          <div className="profile-card-header">
            <img
              src={image || defaultImg}
              alt={fullName || title}
              className="profile-logo"
            />
          </div>
        </div>
      </div>

      <div className="profile-card-footer">
        {buttonText && (
          <GradientButton
            className="edit-btn"
            text={buttonText}
            onClick={handleClick}
          />
        )}

        {buttonText2 && (
          <GradientButton
            className="edit-btn"
            text={buttonText2}
            onClick={onEdit}
          />
        )}
      </div>
    </div>
  );
};

export default ProfileCard1;
