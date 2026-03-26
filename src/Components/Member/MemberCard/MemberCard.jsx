import React from "react";
import "./MemberCard.css";
import { FiArrowUpRight } from "react-icons/fi";

const MemberCard = ({ image, tag, title, description, link }) => {
  return (
    <div className="modern-card">
      <img src={image} alt={title} className="modern-card-image" />

      <div className="member-card-body">
        <span className="modern-card-tag">{tag}</span>
        <h3 className="modern-card-title">{title}</h3>
        <p className="modern-card-description">{description}</p>

        <a href={link} className="modern-card-link">
          Read More <FiArrowUpRight />
        </a>
      </div>
    </div>
  );
};

export default MemberCard;
