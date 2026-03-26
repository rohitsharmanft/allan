import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import "./PaymentPages.css";
import { AppContext } from "../../contexts/AppContexts";

const PaymentFailed = () => {
  const navigate = useNavigate();
  const { token } = useContext(AppContext);

  const handleClick = () => {
    if (token) {
      navigate("/login"); 
    } else {
      navigate("/member-resource-login");
    }
  };

  return (
    <div className="payment-page failed-page">
      <div className="blob blob-1" />
      <div className="blob blob-2" />

      <div className="payment-card">
        <div className="payment-logo-wrap">
          <img src={logo} alt="Site Logo" className="payment-logo" />
        </div>

        <div className="icon-wrap failed-icon-wrap">
          <svg className="crossmark" viewBox="0 0 52 52">
            <circle className="crossmark-circle" cx="26" cy="26" r="25" fill="none" />
            <path
              className="crossmark-cross"
              fill="none"
              d="M16 16 36 36 M36 16 16 36"
            />
          </svg>
        </div>

        <h1 className="payment-title failed-title">Payment Failed</h1>
        <p className="payment-subtitle">
          Something went wrong while processing your payment. No charges have
          been made to your account.
        </p>

        <div className="failed-actions">
          <button
            className="payment-btn failed-btn"
            onClick={handleClick}
          >
            {token ? "Try Again" : "Go to Login"}
          </button>
        </div>

        <p className="payment-note">
          Need help? Contact us at{" "}
          <a href="mailto:support@yoursite.com" className="support-link">
            support@yoursite.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default PaymentFailed;