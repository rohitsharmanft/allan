import React from "react";
import "./SectionCard.css";
import { HiOutlineArrowLongRight } from "react-icons/hi2";

const SectionCard = ({
  title,
  description,   
  highlight,
  buttonText,
  imageSrc,
  reverse = false,
  onClick,
  className = ""
}) => {
  return (
    <section className={`section-card ${reverse ? "reverse-layout" : ""} ${className}`}>
      <div className="section-content">
        <h1>{title}</h1>
        <p className="desc">{description}</p>
        {highlight && <p className="highlight">{highlight}</p>}
       {buttonText && (
  <button className="signup_btn" onClick={onClick}>
    {/* <span className="arrow left-arrow"></span>  */}
    {buttonText}
    <span className="arroww"><HiOutlineArrowLongRight />
</span> 
  </button>
)}
      </div>

      <div className="section-image">
        <img src={imageSrc} alt="section visual" />
      </div>
    </section>
  );
};

export default SectionCard;
