// ChangePassword.js
import React, { useContext, useState } from "react";
import "./ChangePassword.css";
import DashboardHeader from "../../components/DashboardHeader/DashboardHeader";
import Sidebar from "../../components/SideBar/Sidebar";
import PasswordField from "../../common/InputField/PasswordField";
import GradientButton from "../../common/GradientButton/GradientButton";
import { toast } from "react-toastify";
import axios from "axios";
import { admin_change_password } from "../../api";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { Breadcrumb } from "antd";
import { FiChevronRight } from "react-icons/fi";

const ChangePassword = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const validateField = (name, value) => {
    if (name === "oldPassword") {
      return value.trim() ? "" : "Please enter current password.";
    }

    if (name === "newPassword") {
      if (!value) return "Please enter new password.";
      if (!strongPasswordRegex.test(value))
        return "New password must be 8+ characters with uppercase, lowercase, number & special character.";
      return "";
    }

    if (name === "confirmPassword") {
      if (!value) return "Please enter confirm new password.";
      if (value !== formData.newPassword)
        return "New password and confirm new password does not match.";
      return "";
    }
    return "";
  };

  const handleChange = (e, field) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));

    const error = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field]: error }));

    if (field === "newPassword") {
      if (formData.confirmPassword) {
        const confirmError =
          formData.confirmPassword !== value
            ? "New password and confirm new password does not match."
            : "";
        setErrors((prev) => ({ ...prev, confirmPassword: confirmError }));
      }
      if (
        formData.oldPassword &&
        value !== formData.oldPassword &&
        strongPasswordRegex.test(value)
      ) {
        setErrors((prev) => ({
          ...prev,
          newPassword:
            formData.confirmPassword && formData.confirmPassword !== value
              ? prev.newPassword
              : "",
        }));
      }
    }

    if (field === "oldPassword" && formData.newPassword === value && value) {
      setErrors((prev) => ({
        ...prev,
        newPassword: "New password cannot be the same as current password.",
      }));
    }

    if (field === "confirmPassword") {
      const confirmError =
        value !== formData.newPassword
          ? "New password and confirm new password does not match."
          : "";
      setErrors((prev) => ({ ...prev, confirmPassword: confirmError }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      oldPassword: validateField("oldPassword", formData.oldPassword),
      newPassword: validateField("newPassword", formData.newPassword),
      confirmPassword: validateField(
        "confirmPassword",
        formData.confirmPassword
      ),
    };

    setErrors(newErrors);
    return (
      !newErrors.oldPassword &&
      !newErrors.newPassword &&
      !newErrors.confirmPassword
    );
  };

  const handleUpdatePassword = async () => {
    if (!validateForm()) return;
    setLoading(true)
    try {
      const resp = await axios.put(
        admin_change_password,
        {
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (resp.data.code === 200) {
        toast.success(resp.data.message || "Password changed successfully!");
        navigate("/profile");
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.error_description ||
        error.response?.data?.error ||
        "Failed to change password. Please try again.";
      toast.error(errorMsg);
    }finally{
      setLoading(false)
    }
  };

  return (
    <>
      <DashboardHeader />

      <div className="dashboard-main">
        <div className="dashboard-left">
          <Sidebar />
        </div>

        <div className="dashboard-right">
          <div className="change-password-container">
            <div className="bread-crumb_">
              <Breadcrumb
                separator={<FiChevronRight size={14} className="ss" />}
                items={[
                  {
                    title: <Link to="/profile">My Profile</Link>,
                  },

                  {
                    title: "Change Password",
                  },
                ]}
              />
            </div>
            <div className="form-grid-">
              <PasswordField
                label="Current password"
                placeholder="Enter current password"
                value={formData.oldPassword}
                onChange={(e) => handleChange(e, "oldPassword")}
                error={errors.oldPassword}
              />

              <PasswordField
                label="New password"
                placeholder="Enter new password"
                value={formData.newPassword}
                onChange={(e) => handleChange(e, "newPassword")}
                error={errors.newPassword}
              />

              <PasswordField
                label="Confirm new password"
                placeholder="Re-enter new password"
                value={formData.confirmPassword}
                onChange={(e) => handleChange(e, "confirmPassword")}
                error={errors.confirmPassword}
              />
            </div>

            <div className="button_group">
              <GradientButton
                className="update-btn"
                text={loading?"Submitting...":"Change Password"}
                onClick={handleUpdatePassword}
                loading={loading}
              />
              <GradientButton
                className="discard-btn"
                text="Discard"
                onClick={() => navigate("/profile")}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
