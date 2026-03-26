import React from "react";
import "./MemberCard.css";
import { FiArrowUpRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const MemberCard = ({ id, image, tag, title, description, link, content, categoryId }) => {
  const navigate = useNavigate();
  return (
    <div className="modern-card" onClick={() => { navigate("/blog-detail", { state: { id, image, tag, title, content, link, categoryId } }); }} >
      <div className="image"> <img src={image} alt={title} className="modern-card-image" /></div>


      <div className="member-card-body">
        <span className="modern-card-tag">{tag}</span>
        <h3 className="modern-card-title">{title.length>50?title.slice(0,45)+"...":title}</h3>
        <p className="modern-card-description">{description}</p>

        <a href={link} className="modern-card-link" onClick={() => { navigate("/blog-detail", { state: { id, image, tag, title, content, link, categoryId } }); }}>
          Read More <FiArrowUpRight />
        </a>
      </div>
    </div>
  );
};

export default MemberCard;
