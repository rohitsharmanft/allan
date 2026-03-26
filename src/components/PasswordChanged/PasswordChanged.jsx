import React, { useState } from "react";
import { Spin } from "antd";                          // ← add this
import "./PasswordChanged.css";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import GradientButton from "../../common/GradientButton/GradientButton";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PasswordChanged = () => {
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleGoToLogin = () => {
    setIsRedirecting(true);
    // Small delay is optional – mostly for visual feedback
    setTimeout(() => {
      navigate("/");
    }, 400); // or remove timeout if instant is fine
  };

  return (
    <div className="checkinbox-container">
      <div className="checkinbox-card">
        <Spin
          spinning={isRedirecting}
          tip="Redirecting to login..."
          size="large"
        >
          <img src={logo} alt="Logo" className="checkinbox-logo" />

          <h2 className="checkinbox-title">Password Changed!</h2>

          <p className="checkinbox-desc">
            Your password has been successfully updated.<br />
            Please log in again with your new password.
          </p>

          <GradientButton
            text={isRedirecting ? "Redirecting..." : "Go To Login"}
            className="checkinbox-btn"
            onClick={handleGoToLogin}
            disabled={isRedirecting}
            loading={isRedirecting} 
          />
        </Spin>
      </div>
    </div>
  );
};

export default PasswordChanged;