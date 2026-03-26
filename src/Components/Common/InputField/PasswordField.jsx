import React, { useState } from "react";
import "./PasswordField.css";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const PasswordField = ({ label, placeholder, value, onChange, disabled, error }) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleVisibility = () => { setShowPassword(!showPassword) };

  return (
    <div className="password-field">
      <label className="password-label">{label}</label>
      <div className="password-input-wrapper">
        <input
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`password-input ${error ? "input-error" : ""}`}
          disabled={disabled}
        />
        <span className="eye-icon" onClick={toggleVisibility}>
          {showPassword ? <AiOutlineEyeInvisible  /> : <AiOutlineEye  />}
        </span>
      </div>
      {error && <span className="error">{error}</span>}
    </div>
  );
};

export default PasswordField;