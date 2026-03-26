import React, { useContext, useEffect, useState } from "react";
import { Checkbox, Spin } from "antd";                    // ← added Spin
import InputField from "../../common/InputField/InputField";
import PasswordField from "../../common/InputField/PasswordField";
import GradientButton from "../../common/GradientButton/GradientButton";
import "./Login.css";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { admin_login_url } from "../../api";
import axios from "axios";
import LoadingCard from "../LoadingCard/LoadingCard";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../../contexts/AuthContext";

const REMEMBER_ME_KEY = "rememberMeEmail";
const REMEMBER_ME_PASSWORD_KEY = "rememberMePassword";
const REMEMBER_ME_CHECKED = "rememberMeChecked";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [touched, setTouched] = useState({ email: false, password: false });
  const { setToken } = useContext(AuthContext);

  useEffect(() => {
    const savedEmail = localStorage.getItem(REMEMBER_ME_KEY);
    const savedPassword = localStorage.getItem(REMEMBER_ME_PASSWORD_KEY);
    const wasRemembered = localStorage.getItem(REMEMBER_ME_CHECKED) === "true";

    if (savedEmail && savedPassword && wasRemembered) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const validateEmail = (value) => {
    if (!value.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return "Please enter a valid email address";
    return "";
  };

  const validatePassword = (value) => {
    if (!value) return "Password is required";
    if (value.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (touched.email) {
      setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
    }
  };

  const handleEmailBlur = () => {
    setTouched((prev) => ({ ...prev, email: true }));
    setErrors((prev) => ({ ...prev, email: validateEmail(email) }));
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (touched.password) {
      setErrors((prev) => ({ ...prev, password: validatePassword(value) }));
    }
  };

  const handlePasswordBlur = () => {
    setTouched((prev) => ({ ...prev, password: true }));
    setErrors((prev) => ({ ...prev, password: validatePassword(password) }));
  };

  const handleRememberMeChange = (e) => {
    const isChecked = e.target.checked;
    setRememberMe(isChecked);

    if (isChecked) {
      localStorage.setItem(REMEMBER_ME_KEY, email);
      localStorage.setItem(REMEMBER_ME_PASSWORD_KEY, password);
      localStorage.setItem(REMEMBER_ME_CHECKED, "true");
    } else {
      localStorage.removeItem(REMEMBER_ME_KEY);
      localStorage.removeItem(REMEMBER_ME_PASSWORD_KEY);
      localStorage.removeItem(REMEMBER_ME_CHECKED);
    }
  };

  const validateForm = () => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    setErrors({ email: emailError, password: passwordError });
    setTouched({ email: true, password: true });

    return !emailError && !passwordError;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await axios.post(admin_login_url, { email, password });
      const newToken = res.data?.data?.user_details?.access_token;

      if (newToken) {
        localStorage.setItem("accessToken", newToken);
        setToken(newToken);

        if (rememberMe) {
          localStorage.setItem(REMEMBER_ME_KEY, email);
          localStorage.setItem(REMEMBER_ME_PASSWORD_KEY, password);
          localStorage.setItem(REMEMBER_ME_CHECKED, "true");
        } else {
          localStorage.removeItem(REMEMBER_ME_KEY);
          localStorage.removeItem(REMEMBER_ME_PASSWORD_KEY);
          localStorage.removeItem(REMEMBER_ME_CHECKED);
        }

        toast.success("Login successful!");
        navigate("/profile");
      }
    } catch (error) {
      console.error("Login error:", error.response?.data?.error_description);
      toast.error(error.response?.data?.error_description || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Removed: if (loading) return <LoadingCard />;
  // Now using Spin overlay instead

  return (
    <div className="login-container">
      <div className="login-box">
        <Spin 
          spinning={loading} 
          tip="Logging in..." 
          size="large"
        >
          <div className="login-header">
            <img src={logo} alt="Logo" className="login-logo-img" />
          </div>

          <h3 className="login-title">Login to your account</h3>

          <form className="login-form" onSubmit={handleLogin}>
            <InputField
              label="Email address"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
              error={touched.email ? errors.email : ""}
              disabled={loading}                    // ← prevent changes during login
            />

            <PasswordField
              label="Password"
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={handlePasswordChange}
              onBlur={handlePasswordBlur}
              error={touched.password ? errors.password : ""}
              disabled={loading}
            />

            <div className="login-options">
              <Checkbox
                checked={rememberMe}
                onChange={handleRememberMeChange}
                className="login-checkbox"
                disabled={loading}
              >
                Remember me
              </Checkbox>

              <p
                className="forgot-link"
                onClick={() => navigate("/forget-password", { state: { email } })}
                style={{ pointerEvents: loading ? 'none' : 'auto', opacity: loading ? 0.5 : 1 }}
              >
                Forgot password?
              </p>
            </div>

            <GradientButton 
              text={loading ? "Logging in..." : "Login"} 
              className="btn-login" 
              type="submit"
              loading={loading}                     // ← if your button supports loading prop
              disabled={loading}
            />
          </form>
        </Spin>
      </div>
    </div>
  );
};

export default Login;