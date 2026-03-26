import React, { useState, useEffect } from 'react';
import { Spin } from 'antd';                           // ← added
import GradientButton from "../../common/GradientButton/GradientButton";
import "./ForgetPassword.css";
import logo from "../../assets/logo.png";
import { useLocation, useNavigate } from 'react-router-dom';
import InputField from '../../common/InputField/InputField';
import { admin_forgot_password } from '../../api';
import axios from 'axios';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);       // ← added

  useEffect(() => {
    setEmail(location.state?.email || "");
  }, [location.state?.email]);

  const validateEmail = (value) => {
    if (!value.trim()) {
      return "Email is required";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value.trim())) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (touched) {
      setError(validateEmail(value));
    }
  };

  const handleEmailBlur = () => {
    setTouched(true);
    setError(validateEmail(email));
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    const emailError = validateEmail(email);
    setError(emailError);
    setTouched(true);

    if (emailError) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(admin_forgot_password, { email });

      if (res.data.status && res.data.code === 200) {
        toast.success(res.data.message || "Forgot password link has been sent to your registered email address. ");
        navigate("/check-in-box", { state: { email } });
      } else {
        toast.error(res.data.error || "Something went wrong");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.error_description ||
        error?.message ||
        "Something went wrong"
      );
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="forget-container">
      <div className="forget-box">
        <Spin
          spinning={loading}
          tip="Sending reset link..."
          size="large"
        >
          <div className="forget-header">
            <img src={logo} alt="Logo" className="forget-logo-img" />
          </div>

          <h3 className="forget-title">Forgot Password</h3>
          <p>Enter your email address and we will send you a link.</p>

          <form onSubmit={handleForgotPassword}>
            <div className="form_group">
              <InputField
                label="Email address"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={email}
                onChange={handleEmailChange}
                onBlur={handleEmailBlur}
                error={error}
                disabled={loading}
              />
            </div>

            <GradientButton
              text={loading ? "Sending..." : "Reset Password"}
              className="btn-login"
              type="submit"
              loading={loading}
              disabled={loading}
            />
          </form>
        </Spin>
      </div>
    </div>
  );
};

export default ForgetPassword;