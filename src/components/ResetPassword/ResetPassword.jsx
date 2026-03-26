import React, { useState, useEffect } from "react";
import { Input, Button, Spin } from "antd";
import "./ResetPassword.css";
import logo from "../../assets/logo.png";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingCard from "../LoadingCard/LoadingCard";
import {
  admin_set_new_password,
  admin_check_reset_token,
} from "../../api";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [validToken, setValidToken] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      setLoading(true);
      const resetToken = new URLSearchParams(location.search).get("reset_token");

      if (!resetToken) {
        setValidToken(false);
        setLoading(false);
        return;
      }

      try {
        const response = await axios.post(admin_check_reset_token, { resetToken });
        setValidToken(response.status === 200 && response.data.status);
      } catch (error) {
        setValidToken(false);
      } finally {
        setLoading(false);
      }
    };

    checkToken();
  }, [location.search]);

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

    if (!password2.trim()) {
      newErrors.password2 = "Please confirm your new password.";
    } else if (password !== password2) {
      newErrors.password2 = "New password and confirm new password does not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (name, value) => {
    if (name === "password") {
      setPassword(value);
    } else if (name === "password2") {
      setPassword2(value);
    }

    const newErrors = { ...errors };

    if (name === "password") {
      if (!value.trim()) {
        newErrors.password = "Please enter new password.";
      } else if (
        value.length < 8 ||
        !/[A-Z]/.test(value) ||
        !/[a-z]/.test(value) ||
        !/[0-9]/.test(value) ||
        !/[!@#$%^&*(),.?":{}|<>]/.test(value) ||
        /\s/.test(value)
      ) {
        newErrors.password =
          "New password must be at least 8 characters long with uppercase, lowercase, number, special character, and no spaces.";
      } else {
        delete newErrors.password;
      }

      if (password2) {
        if (value !== password2) {
          newErrors.password2 = "New password and confirm new password does not match.";
        } else {
          delete newErrors.password2;
        }
      }
    }

    if (name === "password2") {
      if (!value.trim()) {
        newErrors.password2 = "Please confirm your new password.";
      } else if (password && value !== password) {
        newErrors.password2 = "New password and confirm new password does not match.";
      } else {
        delete newErrors.password2;
      }
    }

    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const resetToken = new URLSearchParams(location.search).get("reset_token");

    if (!resetToken) {
      toast.error("Reset token is missing");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(admin_set_new_password, {
        password,
        resetToken,
      });

      if (response.data.code === 200) {
        toast.success("Password reset successfully");
        setTimeout(() => { navigate("/"); }, 900);
      } else {
        toast.error(response.data?.error_description || "Failed to reset password");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.error_description ||
        error.message ||
        "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading && !validToken) {
    return <LoadingCard />;
  }

  if (!validToken) {
    return (
      <div className="signup-wrapper">
        <div className="signup-container">
          <img src={logo} alt="Logo" className="signup-logo" />
          <h2 className="signup-title">Link Expired</h2>
          <p>Please request a new reset link.</p>
          <p className="login-text">
            Back to Login? <Link to="/">Log in</Link>
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

        <Spin spinning={loading} tip="Resetting password..." size="large">
          <form className="signup-form" onSubmit={handleSubmit} noValidate>
            <div className="form-field">
              <label>New Password</label>
              <Input.Password
                placeholder="Enter Your New Password"
                className={`signup-input ${errors.password ? "error" : ""}`}
                value={password}
                onChange={(e) => handleChange("password", e.target.value)}
                disabled={loading}
              />
              {errors.password && <p className="error-text">{errors.password}</p>}
            </div>

            <div className="form-field">
              <label>Confirm New Password</label>
              <Input.Password
                placeholder="Confirm Your New Password"
                className={`signup-input ${errors.password2 ? "error" : ""}`}
                value={password2}
                onChange={(e) => handleChange("password2", e.target.value)}
                disabled={loading}
              />
              {errors.password2 && <p className="error-text">{errors.password2}</p>}
            </div>

            <Button
              type="primary"
              block
              className="signup-btn"
              htmlType="submit"
              loading={loading}
              disabled={loading}
            >
              Reset →
            </Button>

            <p className="login-text">
              Back to Login? <Link to="/">Log in</Link>
            </p>
          </form>
        </Spin>
      </div>

    </div>
  );
};

export default ResetPassword;