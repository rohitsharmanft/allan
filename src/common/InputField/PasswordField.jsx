import React, { useState } from "react";
import "./PasswordField.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const PasswordField = ({ label, placeholder, value, onChange, error }) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="password-field">
      <label className="password-label">{label}</label>
      <div className="password-input-wrapper">
        <input
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          value={value}  
          onChange={onChange}
          className="password-input"
        />
        <span className="eye-icon" onClick={toggleVisibility}>
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>
        {error && <span className="error-text">{error}</span>}
    </div>
  );
};

export default PasswordField;

