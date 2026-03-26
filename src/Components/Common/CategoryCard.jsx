import React from "react";
import "./CategoryCard.css";
import { HiOutlineArrowLongRight } from "react-icons/hi2";
import wellbeingIcon from "../../assets/images/wellbeing.png";

const CategoryCard = ({ icon, title, description, onLearnMore }) => {
  return (
    <div className="category-card">
      <div className="card-header">
      
        <div className="icon-wrapper">
          <img
            src={icon || wellbeingIcon}
            alt="Category"
            className="icon-img"
          />
        </div>
      </div>

      <div className="card-body">
       
        <h3 className="card-title">
          {title
            ? title.charAt(0).toUpperCase() + title.slice(1).toLowerCase()
            : ""}
        </h3>

        
        <button className="learn-more" onClick={onLearnMore}>
          Explore Now <HiOutlineArrowLongRight className="btn-icon" />
        </button>
      </div>
    </div>
  );
};

export default CategoryCard;
