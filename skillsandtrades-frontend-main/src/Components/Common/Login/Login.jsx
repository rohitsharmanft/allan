import React, { useState, useEffect, useContext } from "react";
import { Input, Spin } from "antd";
import "./Login.css";
import logo from "../../../assets/images/logo.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { validateEmail } from "../../../utils/validators/validateEmail";
import { validatePassword } from "../../../utils/validators/validatePassword";
import axios from "axios";
import { client_login_url, member_login_url } from "../../../api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppContext } from "../../../contexts/AppContexts";
import GradientButton from "../GradientButton";
import Header from "../Header/Header";

const Login = () => {
  const [activeTab, setActiveTab] = useState("client");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const { refreshProfile, setUserType } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();

  const STORAGE_KEY = `remember_${activeTab}`;
  const job = location.state?.job;
  const type = location.state?.type;

  useEffect(() => {
    const remembered = localStorage.getItem(STORAGE_KEY);
    if (remembered) {
      try {
        const data = JSON.parse(remembered);
        setEmail(data.email || "");
        setPassword(data.password || "");
        setRememberMe(true);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    } else {
      setEmail("");
      setPassword("");
      setRememberMe(false);
    }

    setErrors({});
  }, [activeTab]);

  const validateAll = (emailValue, passwordValue) => {
    return {
      email: validateEmail(emailValue),
      password: !passwordValue ? "Please enter password." : "",
    };
  };

  const handleChange = (name, value) => {
    const updatedEmail = name === "email" ? value : email;
    const updatedPassword = name === "password" ? value : password;
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
    setErrors(validateAll(updatedEmail, updatedPassword));
  };

  const validateForm = () => {
    const newErrors = validateAll(email, password);
    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleRememberMeChange = (checked) => {
    setRememberMe(checked);
    if (checked && email && password) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ email, password }));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    const apiUrl = activeTab === "member" ? member_login_url : client_login_url;

    try {
      const response = await axios.post(apiUrl, { email, password });
      if (response.data.code === 200 && response.data.status) {
        toast.success("Login successful!");
        const details = response.data.data;
        const newUserType =
          activeTab === "member" ? "member" : "client";
        const accessToken =
          activeTab === "member"
            ? details?.user_details?.access_token
            : details?.client_details?.access_token;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("userType", newUserType);
        setUserType(newUserType);
        if (rememberMe) {
          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ email, password })
          );
        }
        await refreshProfile();
        if (job) {
          navigate(`/${type}-detail`, { state: { job, type } });
        } else {
          navigate(activeTab === "member" ? "/profile" : "/client-profile");
        }
      }
    } catch (error) {
      if (error.response?.data?.error === "OTP_NOT_VERIFIED") {
        toast.success("OTP has been sent. Please verify your email.");
        navigate("/verify", {
          replace: true,
          state: { email, activeTab },
        });
      } else {
        toast.error(
          error.response?.data?.error_description || "Login failed"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="loginWrapper">
        <div className="loginBox">
          <img src={logo} alt="Logo" className="logo_" />
          <div className="tabContainer">
            <button
              className={`tabButton ${activeTab === "client" ? "active" : ""}`}
              onClick={() => setActiveTab("client")}
              disabled={loading}
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
          <h2 className="heading">Login to your account</h2>
          <Spin spinning={loading} tip="Logging in...">
            <form className="form" onSubmit={handleSubmit}>
              <label>Email address</label>
              <Input
                type="email"
                placeholder="Enter Your Email"
                className={`input ${errors.email ? "error" : ""}`}
                value={email}
                onChange={(e) =>
                  handleChange("email", e.target.value)
                }
                disabled={loading}
              />
              {errors.email && (<p className="error">{errors.email}</p>)}

              <label>Password</label>
              <Input.Password
                placeholder="Enter Your Password"
                className={`input ${errors.password ? "error" : ""}`}
                value={password}
                onChange={(e) =>
                  handleChange("password", e.target.value)
                }
                disabled={loading}
              />
              {errors.password && (<p className="error">{errors.password}</p>)}

              <div className="options">
                <label>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) =>
                      handleRememberMeChange(e.target.checked)
                    }
                    disabled={loading}
                  />
                  <p className="rememberText">
                    Remember me
                  </p>
                </label>

                <Link
                  className="forgotLink"
                  to="/forgot-password"
                  state={{ email, activeTab }}
                >
                  Forgot password?
                </Link>
              </div>
              <GradientButton
                text="Login"
                type="submit"
                className="loginBtn"
                disabled={loading}
              />
            </form>
          </Spin>

          <p className="signupText">
            Don’t have an account?{" "}
            <Link to={activeTab === "member" ? "/member-resource-login" : "/signup"}>Sign up</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;