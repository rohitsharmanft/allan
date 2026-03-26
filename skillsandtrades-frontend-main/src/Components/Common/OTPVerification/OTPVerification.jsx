import React, { useState, useEffect } from "react";
import { Button, Input, message, Spin } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import "./OTPVerification.css";
import logo from "../../../assets/images/logo.png";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  verify_otp_url_member,
  resend_otp_url_member,
  verify_otp_url_client,
  resend_otp_url_client
} from "../../../api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GradientButton from "../GradientButton";

const OTPVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { email, activeTab, id, planId } = location.state || {};
  console.log(id);
  console.log(planId)

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [initialSending, setInitialSending] = useState(false);

  const verifyUrl =
    activeTab === "member" ? verify_otp_url_member : verify_otp_url_client;

  const resendUrl =
    activeTab === "member" ? resend_otp_url_member : resend_otp_url_client;

  const maskEmail = (email) => {
    if (!email) return "";

    const [name, domain] = email.split("@");

    if (name.length === 1) {
      return `${name}@${domain}`;
    }
    const visible = name.slice(0, 1);
    const hidden = "*".repeat(name.length - 1);

    return `${visible}${hidden}@${domain}`;
  };


  useEffect(() => {
    if (email || activeTab) return;

    const sendOTP = async () => {
      setInitialSending(true);
      try {
        const response = await axios.post(resendUrl, { email });
        if (response.status === 200 && response.data.status) {
          toast.success("OTP sent to your email!");
        } else {
          toast.error(response.data?.message || "Failed to send OTP.");
        }
      } catch (error) {
        toast.error("Failed to send OTP. Try again.");
      } finally {
        setInitialSending(false);
      }
    };

    sendOTP();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (otp.trim() === "") {
      toast.error("Please enter OTP!");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(verifyUrl, { email, otp });

      if (response.data.code === 200 && response.data.status) {
        toast.success("OTP Verified Successfully 🎉");
        navigate(
          activeTab === "member" ? "/send-id" : "/login",
          {
            replace: true,
            state: { email, id, planId }
          }
        );
      } else {
        toast.error(response.data?.message || "Invalid OTP, please try again.");
      }
    } catch (error) {
      toast.error("OTP verification failed. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (initialSending) {
    return (
      <div className="otpWrapper" style={{ textAlign: "center", paddingTop: "100px" }}>
        <Spin size="large" />
        <p style={{ marginTop: "20px", fontSize: "16px" }}>
          Sending OTP to {maskEmail(email)}...
        </p>
      </div>
    );
  }

  return (
    <div className="otpWrapper">
      <div className="otpBox">
        <img src={logo} alt="Logo" className="otpLogo" />

        <h2 className="otpHeading">OTP Verification</h2>

        <p className="otpText">
          We sent a verification code to your register email address
          <br />
          <span className="otpEmail">{maskEmail(email)}</span>
        </p>

        <form className="otpForm" onSubmit={handleSubmit}>
          <label>Enter OTP</label>
          <Input
            className="otpInput"
            placeholder="Enter Your OTP"
            value={otp}
            onChange={(e) => {
              const val = e.target.value;
              if (/^\d*$/.test(val)) {
                setOtp(val);
              }
            }}
            maxLength={6}
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="one-time-code"
            disabled={loading}
          />

          <GradientButton
            className="otpBtn"
            htmlType="Submit"
            text="Submit"
            loading={loading}
            disabled={loading}
          />
        </form>

        <div className="resendContainer">
          {/* Resend OTP intentionally disabled */}
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
