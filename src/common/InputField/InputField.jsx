import React from "react";
import "./InputField.css";

const InputField = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  name,
  disabled,
}) => {
  return (
    <div className="input-field">
      <label className="input-label">{label}</label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        className={`input-box ${error ? "input-error" : ""}`}
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

export default InputField;
