import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Spin } from "antd"; 
import PasswordField from "../../../Components/Common/InputField/PasswordField";
import "./ClientChangePassword.css";
import GradientButton from "../../../Components/Common/GradientButton";
import axios from "axios";
import { change_password_client } from "../../../api";
import ClientSideBar from "../../../Components/Client/ClientPannel/ClientSideBar";
import Footer from "../../../Components/Common/Footer/Footer";
import Header from "../../../Components/Common/Header/Header";
import { Breadcrumb } from "antd";
import { FiChevronRight } from "react-icons/fi";
import { toast } from "react-toastify";

const ClientChangePassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 8000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const validateForm = (data) => {
    const newErrors = {};

    if (!data.currentPassword || data.currentPassword.trim() === "") {
      newErrors.currentPassword = "Please enter current password.";
    }

    if (!data.newPassword || data.newPassword.trim() === "") {
      newErrors.newPassword = "Please enter new password.";
    } else if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])(?!.*\s)/.test(
        data.newPassword,
      )
    ) {
      newErrors.newPassword =
        "New password must be at least 8 characters long with uppercase, lowercase, number, special character, and no spaces.";
    }

    if (!data.confirmPassword || data.confirmPassword.trim() === "") {
      newErrors.confirmPassword = "Please enter confirm new password.";
    } else if (data.confirmPassword !== data.newPassword) {
      newErrors.confirmPassword =
        "New password and confirm new password does not match.";
    }

    return newErrors;
  };

  const handleChange = (e, field) => {
    const value = e.target.value;
    const updatedFormData = { ...formData, [field]: value };
    setFormData(updatedFormData);

    const newErrors = validateForm(updatedFormData);
    setErrors(newErrors);
  };

  const handleSubmit = async () => {
    const newErrors = validateForm(formData);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);

    try {
      const token =
        localStorage.getItem("accessToken") ||
        sessionStorage.getItem("accessToken");
      const response = await axios.put(
        change_password_client,
        {
          old_password: formData.currentPassword,
          new_password: formData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data.code === 200) {
        toast.success("Password changed successfully!");
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setErrors({});
        // window.scrollTo(0, 0);
        // navigate(-1);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.error_description ||
          "Current password is incorrect",
      );
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
    setErrors({});
    // window.scrollTo(0, 0);
    navigate("/client-profile");

  };
  // useEffect(() => {
  //   window.scrollTo(0, 0);
  // }, []);
  return (
    <>
      <Header />
      <div className="hero-section">
        <div className="overlay"></div>
        <h1>Client</h1>
      </div>

      <div className="dashboard">
        <ClientSideBar />
        <div className="j">
          <div className="change-password-container">
            <div className="breadcrumb">
              <Breadcrumb
                separator={<FiChevronRight size={14} className="ss" />}
                items={[
                  {
                    title: <Link to="/client-profile">My Profile</Link>,
                  },
                  {
                    title: "Change Password",
                  },
                ]}
              />
            </div>

            <Spin spinning={loading} tip="Updating password...">
              <div className="form_grid">
                <div className="form-group">
                  <PasswordField
                    label="Current Password"
                    placeholder="Enter current password"
                    value={formData.currentPassword}
                    onChange={(e) => handleChange(e, "currentPassword")}
                    error={errors.currentPassword}
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <PasswordField
                    label="New Password"
                    placeholder="Enter new password"
                    value={formData.newPassword}
                    onChange={(e) => handleChange(e, "newPassword")}
                    error={errors.newPassword}
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <PasswordField
                    label="Confirm New Password"
                    placeholder="Enter confirm new password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange(e, "confirmPassword")}
                    error={errors.confirmPassword}
                    disabled={loading}
                  />
                </div>
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
                onClick={handleDiscard}
                  disabled={loading}
                  className="bt"
                />
              </div>
            </Spin>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ClientChangePassword;
