import React from "react";
import "./MemberCard.css";
import { FiArrowUpRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const MemberCard = ({ id, image, tag, title, description, link, content,categoryId, categoryTitle, type  }) => {
  const navigate = useNavigate();
  return (
    <div className="modern-card">
      <div className="image"> <img src={image} alt={title} className="modern-card-image" /></div>


      <div className="member-card-body">
        <span className="modern-card-tag">{tag}</span>
        <h3 className="modern-card-title">{title}</h3>
        <p className="modern-card-description">{description}</p>

        <a href={link} className="modern-card-link" onClick={() => { navigate("/advisory-detail", { state: { id, image, tag, title, content, link, categoryId, categoryTitle, type } }); }}>
          Read More <FiArrowUpRight />
        </a>
      </div>
    </div>
  );
};

export default MemberCard;
