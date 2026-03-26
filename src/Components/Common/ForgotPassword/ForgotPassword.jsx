import React, { useState, useEffect } from "react";
import { Input, Spin } from "antd";           // ← added Spin
import "./ForgotPassword.css";
import logo from "../../../assets/images/logo.png";
import { Link, useLocation } from "react-router-dom";
import { validateEmail } from "../../../utils/validators/validateEmail";
import { forgot_password_client, forgot_password_member } from "../../../api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import GradientButton from "../GradientButton";

const ForgotPassword = () => {
  const [activeTab, setActiveTab] = useState("client");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);   // ← new state

  const location = useLocation();
  const data = location.state;

  useEffect(() => {
    if (data?.email) {
      setEmail(data.email);
    }
    if (data?.activeTab) {
      setActiveTab(data.activeTab);
    }
  }, [data]);

  useEffect(() => {
    setEmail("");
    setErrors({});
  }, [activeTab]);

  const handleChange = (name, value) => {
    if (name === "email") setEmail(value);

    const fieldError = name === "email" ? validateEmail(value) : "";
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  };

  const validateForm = () => {
    const emailError = validateEmail(email);

    const newErrors = {
      ...(emailError && { email: emailError }),
    };

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const apiUrl =
      activeTab === "member"
        ? forgot_password_member
        : forgot_password_client;

    setLoading(true);   // ← start loading

    try {
      const response = await axios.post(apiUrl, { email });

      if (response.data.code === 200 && response.data.status) {
        toast.success(
          "Forgot password link has been sent to your registered email address."
        );
      } else {
        toast.error("Failed to send link");
        console.log("API error response:", response.data);
      }
    } catch (error) {
      console.log("Forgot password error:", error);
      toast.error(error.response?.data?.error_description || "Something went wrong");
    } finally {
      setLoading(false);   // ← always stop loading
    }
  };

  return (
    <div className="FPWrapper">
      <div className="FPBox">
        <img src={logo} alt="Logo" className="logo_" />

        <div className="tabContainer">
          <button
            className={`tabButton ${activeTab === "client" ? "active" : ""}`}
            onClick={() => setActiveTab("client")}
            disabled={loading}   // optional: prevent tab switch during request
          >
            Client Login
          </button>
          <button
            className={`tabButton ${activeTab === "member" ? "active" : ""}`}
            onClick={() => setActiveTab("member")}
            disabled={loading}
          >
            Member Login
          </button>
        </div>

        <h2 className="heading">Forgot Password</h2>

        <Spin spinning={loading} tip="Sending reset link...">
          <form className="form" onSubmit={handleSubmit}>
            <label>Email address</label>
            <Input
              type="email"
              placeholder="Enter your email"
              className={`input ${errors.email ? "error" : ""}`}
              value={email}
              onChange={(e) => handleChange("email", e.target.value)}
              disabled={loading}   // optional: prevent typing while loading
            />
            {errors.email && (
              <p className="error-text">{errors.email}</p>
            )}

            <GradientButton
              text="Send Link"
              onClick={handleSubmit}
              type="submit"
              className="SendLinkBtn"
              disabled={loading}   // prevent multiple clicks
            />

            <p className="signupText">
              Back to login? <Link to="/login">Log in</Link>
            </p>
          </form>
        </Spin>
      </div>
    </div>
  );
};

export default ForgotPassword;