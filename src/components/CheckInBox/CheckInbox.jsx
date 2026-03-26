import React, { useState, useEffect } from "react";
import "./CheckInbox.css";
import logo from "../../assets/logo.png";
import { useLocation, useNavigate } from "react-router-dom";
import GradientButton from "../../common/GradientButton/GradientButton";
import { admin_forgot_password } from "../../api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Spin } from "antd";

const CheckInbox = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    setEmail(location.state?.email || "");
  }, [location.state]);

  // Countdown timer logic
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setResendDisabled(false);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const ResendLink = async () => {
    if (!email) {
      toast.error("Email address is missing");
      return;
    }

    if (resendDisabled) return;

    setLoading(true);
    setResendDisabled(true);
    setCountdown(30); // start 30-second countdown

    try {
      const res = await axios.post(admin_forgot_password, { email });

      if (res.data.code === 200) {
        toast.success("Forgot password link has been resent to your registered email address.");
      } else {
        toast.error(res.data.error || "Something went wrong");
        setResendDisabled(false); // allow retry if failed
        setCountdown(0);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.error_description ||
        "Failed to resend reset link. Please try again."
      );
      setResendDisabled(false);
      setCountdown(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkinbox-container">
      <div className="checkinbox-card">
        <img src={logo} alt="Logo" className="checkinbox-logo" />

        <h2 className="checkinbox-title">Check your inbox, please!</h2>

        <p className="checkinbox-desc">
          We have sent a verification link to your email address. Please check your inbox
          (and spam or junk folder if you don’t see it) and click on the link to confirm your email address.
        </p>

        <p className="checkinbox-resend">
          Didn’t get the link?{" "}
          <span
            onClick={ResendLink}
            style={{
              color: resendDisabled ? "#aaa" : "#134a45",
              cursor: resendDisabled ? "not-allowed" : "pointer",
              pointerEvents: resendDisabled ? "none" : "auto",
              fontWeight: "600",
            }}
          >
            {resendDisabled ? (
              <>
                Resend in {countdown}s
              </>
            ) : (
              "Resend It"
            )}
          </span>
        </p>

        <GradientButton
          text="Go To Login"
          className="checkinbox-btn"
          onClick={() => navigate("/")}
        />
      </div>
    </div>
  );
};

export default CheckInbox;