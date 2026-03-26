import React from "react";
import "./JobCard.css";
import { useNavigate } from "react-router-dom";

const JobCard = ({ category, title, date, description, image, link ,jobDescription ,id}) => {
  const navigate = useNavigate();
  return (
    <div className="job-card">
      <img src={image} alt={title} className="job-image" />
      <div className="job-content">
        <span className="job-category">{category}</span>
        <h3>{title}</h3>
        <p className="job-date">{date}</p>
        <p className="job-desc">{description}</p>
        <a href={link} className="view-link" onClick={() => navigate(link, { state: { category, title, date, description, image, link,jobDescription,id } })}>
          View Details <span className="arrow">↗</span>
        </a>
      </div>
    </div>
  );
};

export default JobCard;
