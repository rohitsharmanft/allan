import React from "react";
import "./InputField.css";

const InputField = ({ label, type = "text", placeholder, value, onChange, disabled, error, inputRef , maxLength,}) => {
  return (
    <div className="input-field">
      <label className="input-label">{label}</label>
      <input
        ref={inputRef}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`input-box ${error ? "input-error" : ""}`}
        disabled={disabled}
        maxLength={maxLength}
      />
      {error && <span className="error">{error}</span>}
    </div>
  );
};

export default InputField;