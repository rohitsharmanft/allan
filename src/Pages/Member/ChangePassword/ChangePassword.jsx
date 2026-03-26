import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Spin, Breadcrumb } from "antd";
import { FiChevronRight } from "react-icons/fi";
import PasswordField from "../../../Components/Common/InputField/PasswordField";
import GradientButton from "../../../Components/Common/GradientButton";
import "./ChangePassword.css";
import Footer from "../../../Components/Common/Footer/Footer";
import Sidebar from "../../../Components/Member/Sidebar";
import Header from "../../../Components/Common/Header/Header";
import axios from "axios";
import { change_password_member } from "../../../api";
import { AppContext } from "../../../contexts/AppContexts";
import { toast } from "react-toastify";

const ChangePassword = () => {
  const { token } = useContext(AppContext);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate()
  const rules = {
    currentPassword: [{ type: "required", message: "Please enter current password." }],
    newPassword: [
      { type: "required", message: "Please enter new password." },
      { type: "min", value: 8, message: "New password must be at least 8 characters long with uppercase, lowercase, number, special character, and no spaces.", },
      {
        type: "passwordStrong",
        message:
          "New password must be at least 8 characters long with uppercase, lowercase, number, special character, and no spaces.",
      },
    ],
    confirmPassword: [
      { type: "required", message: "Please enter confirm new password." },
      { type: "match", message: "New password and confirm new password does not match." },
    ],
  };

  const validateField = (fieldName, formData, rules) => {
    const fieldRules = rules[fieldName] || [];
    const value = formData[fieldName];
    let error = null;

    for (const rule of fieldRules) {
      if (rule.type === "required" && (!value || value.trim() === "")) {
        error = rule.message;
        break;
      }

      if (rule.type === "min" && value?.length < rule.value) {
        error = rule.message;
        break;
      }

      if (rule.type === "match") {
        if (value !== formData.newPassword) {
          error = rule.message;
        }
      }

      if (rule.type === "passwordStrong") {
        const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!strongRegex.test(value) || value?.includes(" ")) {
          error = rule.message;
          break;
        }
      }
    }

    return error ? { [fieldName]: error } : {};
  };

  const handleChange = (e, field) => {
    const value = e.target.value;
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);

    let newErrors = { ...errors };
    if (newErrors[field]) delete newErrors[field];

    const fieldError = validateField(field, updatedData, rules);
    if (Object.keys(fieldError).length > 0) {
      newErrors = { ...newErrors, ...fieldError };
    }

    if (field === "newPassword" || field === "confirmPassword") {
      const confirmError = validateField("confirmPassword", updatedData, rules);
      if (Object.keys(confirmError).length > 0) {
        newErrors = { ...newErrors, ...confirmError };
      } else {
        delete newErrors.confirmPassword;
      }
    }

    setErrors(newErrors);
  };

  const handleSubmit = async () => {
    let validationErrors = {};

    Object.keys(rules).forEach((field) => {
      const fieldErr = validateField(field, formData, rules);
      if (Object.keys(fieldErr).length > 0) {
        validationErrors = { ...validationErrors, ...fieldErr };
      }
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      if (!token) {
        setErrors({ submit: "Session expired. Please log in again." });
        return;
      }

      await axios.post(
        change_password_member,
        {
          old_password: formData.currentPassword,
          new_password: formData.newPassword,
          language: "en",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Password changed successfully!");
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setErrors({});
      navigate(-1)
    } catch (error) {
      const errMsg =
        error.response?.data?.message ||
        error.response?.data?.error_description ||
        error.response?.data?.error ||
        "Current password is incorrect";
      setErrors({ submit: errMsg });
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDiscard = () => {
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setErrors({}); navigate(-1)
  };

  return (
    <>
      <Header />

      <div className="hero-section">
        <div className="overlay"></div>
        <h1>Member</h1>
      </div>

      <div className="dashboard">
        <Sidebar />

        <div className="j">
          <div className="change-password-container">
            <div className="breadcrumb">
              <Breadcrumb
                separator={<FiChevronRight size={14} className="ss" />}
                items={[
                  { title: <Link to="/profile">My Profile</Link> },
                  { title: "Change Password" },
                ]}
              />
            </div>

            <Spin spinning={loading} tip="Updating password...">
              <div className="form-grid">
                <PasswordField
                  label="Current password"
                  placeholder="Enter current password"
                  value={formData.currentPassword}
                  onChange={(e) => handleChange(e, "currentPassword")}
                  autoComplete="current-password"
                  disabled={loading}
                  error={errors.currentPassword}
                />
                <PasswordField
                  label="New password"
                  placeholder="Enter new password"
                  value={formData.newPassword}
                  onChange={(e) => handleChange(e, "newPassword")}
                  autoComplete="new-password"
                  disabled={loading}
                  error={errors.newPassword}
                />
                <PasswordField
                  label="Confirm new password"
                  placeholder="Confirm new password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange(e, "confirmPassword")}
                  autoComplete="new-password"
                  disabled={loading}
                  error={errors.confirmPassword}
                />
              </div>

              <div className="button-group">
                <GradientButton
                  text={loading ? "Changing..." : "Change Password"}
                  onClick={handleSubmit}
                  disabled={loading}
                  className="update-btn"
                />

                <GradientButton
                  text="Discard"
                  onClick={() => navigate("/profile")}
                  disabled={loading}
                  className="bt"
                />
              </div>

              {errors.submit && (
                <div
                  className={
                    errors.submit.includes("successfully")
                      ? "success-msg"
                      : "error-msg"
                  }
                >
                  {errors.submit}
                </div>
              )}
            </Spin>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ChangePassword;