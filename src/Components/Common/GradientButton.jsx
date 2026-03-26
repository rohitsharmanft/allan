import React from "react";
import "./GradientButton.css";
import { FiArrowRight } from "react-icons/fi"; // Add this import
import { HiOutlineArrowLongRight } from "react-icons/hi2";

const GradientButton = ({
  text,
  htmlType = "button",
  loading = false,
  disabled = false,
  className = "",
  onClick,     
  ...rest 
}) => {
  return (
    <button
      className={`gradient-btn ${className}`}
      type={htmlType}           
      onClick={onClick}
      disabled={disabled || loading}
      {...rest}
    >
      <span className="btn-content">
        {loading ? "Submitting..." : text}
        {!loading && <HiOutlineArrowLongRight className="btn-arrow" />}
      </span>
    </button>
  );
};

export default GradientButton;