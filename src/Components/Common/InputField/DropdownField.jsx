import React, { useEffect, useRef, useState } from "react";
import "./DropdownField.css";
import { DownOutlined } from "@ant-design/icons";

const DropdownField = ({
  label,
  value,             
  onChange,
  options = [],
  disabled,
  error,
  placeholder,
  multiple = false,   
  loading = false,
}) => {
  const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);
useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggleOption = (optionValue) => {
    if (multiple) {
      const newValue = Array.isArray(value) ? [...value] : [];
      if (newValue.includes(optionValue)) {
        // Remove if already selected
        onChange(newValue.filter((v) => v !== optionValue));
      } else {
        // Add if not selected
        onChange([...newValue, optionValue]);
      }
    } else {
      // Single select
      onChange(optionValue);
      setOpen(false);
    }
  };

  const isSelected = (optValue) => {
    if (multiple) {
      return Array.isArray(value) && value.includes(optValue);
    }
    return value === optValue;
  };

  const getDisplayText = () => {
    if (multiple) {
      if (!value || value.length === 0) {
        return placeholder || `Select ${label.toLowerCase()}...`;
      }
      if (value.length === 1) {
        const selected = options.find((opt) => getOptionValue(opt) === value[0]);
        return selected ? getOptionLabel(selected) : "1 selected";
      }
      return `${value.length} selected`;
    }

    // Single select
    if (!value) return placeholder || `Select ${label.toLowerCase()}`;

    const selected = options.find((opt) => getOptionValue(opt) === value);
    return selected ? getOptionLabel(selected) : placeholder || `Select ${label.toLowerCase()}`;
  };

  const getOptionValue = (opt) => (typeof opt === "object" ? opt.value : opt);
  const getOptionLabel = (opt) => (typeof opt === "object" ? opt.label : opt);

  // Remove selected item (for chips)
  const removeChip = (e, valToRemove) => {
    e.stopPropagation();
    onChange(value.filter((v) => v !== valToRemove));
  };

  return (
<div className="dropdown-card-container" ref={dropdownRef}>
      <label className="dropdown-card-label">{label}</label>

      <div
        className={`dropdown-card-selected ${open ? "active" : ""} ${error ? "input-error" : ""} ${disabled || loading ? "disabled" : ""}`}
        onClick={() => !(disabled || loading) && setOpen(!open)}
      >
        {multiple && value && value.length > 0 ? (
          <div className="chips-container">
            {value.map((val) => {
              const option = options.find((opt) => getOptionValue(opt) === val);
              const label = option ? getOptionLabel(option) : val;
              return (
                <span key={val} className="chip">
                  {label}
                  <span
                    className="chip-remove"
                    onClick={(e) => removeChip(e, val)}
                  >
                    ×
                  </span>
                </span>
              );
            })}
            <span className="chips-placeholder">{value.length === 0 && getDisplayText()}</span>
          </div>
        ) : (
          <span className={multiple && value?.length > 0 ? "has-chips" : ""}>
            {loading ? "Loading..." : getDisplayText()}
          </span>
        )}
        {!loading && <DownOutlined className={`dropdown-icon ${open ? "rotate" : ""}`} />}
      </div>

      {open && !loading && (
        <div className="dropdown-card-list">
          {options.length === 0 ? (
            <div className="dropdown-card-option disabled">No options available</div>
          ) : (
            options.map((opt, index) => {
              const optValue = getOptionValue(opt);
              const optLabel = getOptionLabel(opt);

              return (
                <div
                  key={index}
                  className={`dropdown-card-option ${isSelected(optValue) ? "selected" : ""}`}
                  onClick={() => handleToggleOption(optValue)}
                >
                  {multiple && (
                    <span className={`checkbox ${isSelected(optValue) ? "checked" : ""}`}>
                      {isSelected(optValue) && "✓"}
                    </span>
                  )}
                  {optLabel}
                </div>
              );
            })
          )}
        </div>
      )}

      {error && <span className="error">{error}</span>}
    </div>
  );
};

export default DropdownField;