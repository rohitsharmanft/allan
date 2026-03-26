import React from "react";
import "./GradientButton.css";
import { HiOutlineArrowLongRight } from "react-icons/hi2";

const GradientButton = ({ text, onClick, type = "button", className = "" ,loading}) => {
  return (
    <button
      className={`gradient-btn ${className}`}
      type={type}
      onClick={onClick}
      disabled={loading}
    >
      {text}<HiOutlineArrowLongRight size={20} className="right-arrow" />

    </button>
  );
};

export default GradientButton;
