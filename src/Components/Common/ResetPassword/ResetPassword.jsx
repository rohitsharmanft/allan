import React, { useState, useEffect } from "react";
import { Input, Spin, Button } from "antd";           // ← added Spin
import "./ResetPassword.css";
import logo from "../../../assets/images/logo.png";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  reset_password_member,
  reset_password_client,
  valid_reset_token_client,
  valid_reset_token_member,
} from "../../../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import LoadingCard from "../LoadingCard/LoadingCard";   // ← can be removed if using Spin

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);        // initial token check
  const [submitting, setSubmitting] = useState(false);
  const [validToken, setValidToken] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      setLoading(true);

      const pathSegment = location.pathname.split("/")[1];
      const resetToken = new URLSearchParams(location.search).get("reset_token");

      if (!resetToken) {
        setValidToken(false);
        setLoading(false);
        return;
      }

      const url =
        pathSegment === "member" ? valid_reset_token_member : valid_reset_token_client;

      try {
        const response = await axios.post(url, { resetToken });
        if (response.status === 200 && response.data.status) {
          setValidToken(true);
        } else {
          setValidToken(false);
        }
      } catch (error) {
        setValidToken(false);
      } finally {
        setLoading(false);
      }
    };

    checkToken();
  }, [location]);

  const validateForm = () => {
    const newErrors = {};

    if (!password.trim()) {
      newErrors.password = "Please enter new password.";
    } else {
      const hasUpper = /[A-Z]/.test(password);
      const hasLower = /[a-z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
      const noSpaces = !/\s/.test(password);

      if (
        password.length < 8 ||
        !hasUpper ||
        !hasLower ||
        !hasNumber ||
        !hasSpecial ||
        !noSpaces
      ) {
        newErrors.password =
          "New password must be at least 8 characters long with uppercase, lowercase, number, special character, and no spaces.";
      }
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Please enter confirm new password.";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "New password and confirm new password does not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);

    const pathSegment = location.pathname.split("/")[1];
    const resetToken = new URLSearchParams(location.search).get("reset_token");
    const url =
      pathSegment === "member" ? reset_password_member : reset_password_client;

    try {
      const response = await axios.post(url, { resetToken, password });

      if (response.data.code === 200) {
        toast.success("Password reset successfully.");
        setTimeout(() => navigate("/login"), 1200);
      } else {
        toast.error(response.data?.error_description || "Something went wrong");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.error_description ||
          error.message ||
          "Something went wrong"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="signup-wrapper">
        <div className="signup-container center-loading">
          <Spin size="large" tip="Verifying reset link..." />
        </div>
      </div>
    );
  }


  if (!validToken) {
    return (
      <div className="signup-wrapper">
        <div className="signup-container">
          <img src={logo} alt="Logo" className="signup-logo" />
          <h2 className="signup-title">Token Expired</h2>
          <p>Please request a new reset link.</p>
          <p className="login-text">
            Back to Login? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="signup-wrapper">
      <div className="signup-container">
        <img src={logo} alt="Logo" className="signup-logo" />
        <h2 className="signup-title">Reset Password</h2>

        <Spin spinning={submitting} tip="Resetting password...">
          <form className="signup-form" onSubmit={handleSubmit} noValidate>
            <div className="form-field">
              <label>New Password</label>
              <Input.Password
                placeholder="Enter Your New Password"
                className={`signup-input ${errors.password ? "error" : ""}`}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((prev) => ({ ...prev, password: "" }));
                }}
                onBlur={validateForm}
                disabled={submitting}
              />
              {errors.password && <p className="error-text">{errors.password}</p>}
            </div>

            <div className="form-field">
              <label>Confirm New Password</label>
              <Input.Password
                placeholder="Enter Your Confirm New Password"
                className={`signup-input ${errors.confirmPassword ? "error" : ""}`}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                }}
                onBlur={validateForm}
                disabled={submitting}
              />
              {errors.confirmPassword && (
                <p className="error-text">{errors.confirmPassword}</p>
              )}
            </div>

            <Button
              type="primary"
              block
              className="signup-btn"
              htmlType="submit"
              loading={submitting}
              disabled={submitting}
            >
              Reset →
            </Button>

            <p className="login-text">
              Back to Login? <Link to="/login">Log in</Link>
            </p>
          </form>
        </Spin>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ResetPassword;