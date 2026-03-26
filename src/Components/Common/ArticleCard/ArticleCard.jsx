import React from "react";
import "./ArticleCard.css";
import { useNavigate } from "react-router-dom";

const ArticleCard = ({ tag, image, title, description, link }) => {
  const navigate = useNavigate();

  // Handle if image is an array or single string
  const displayImage = Array.isArray(image) ? image[0] : image;

  // Function to strip HTML tags for the short description in card
  const stripHtml = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]*>?/gm, "").replace(/&nbsp;/g, " ");
  };

  const plainDescription = stripHtml(description);

  const handleNavigate = (e) => {
    if (e) e.preventDefault();
    navigate(link, {
      state: { tag, image: displayImage, title, description, link },
    });
  };

  return (
    <div className="article-card" onClick={handleNavigate}>
      <div className="article-card-image-container">
        <img src={displayImage} alt={title} className="article-card-image" />
      </div>
      <div className="article-card-content">
        <span className="article-tag">{tag}</span>
        <h3 className="article-title">{title}</h3>
        <p className="article-description">{plainDescription}</p>
        <div className="article-link" onClick={handleNavigate}>
          Read More <span className="arrow">↗</span>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
