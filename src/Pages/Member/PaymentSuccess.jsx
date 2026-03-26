import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import "./PaymentPages.css";

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const [counter, setCounter] = useState(10);

    useEffect(() => {
        const timer = setInterval(() => {
            setCounter((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    navigate("/");
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [navigate]);

    return (
        <div className="payment-page success-page">
            {/* Background blobs */}
            <div className="blob blob-1" />
            <div className="blob blob-2" />

            <div className="payment-card">
                <div className="payment-logo-wrap">
                    <img src={logo} alt="Site Logo" className="payment-logo" />
                </div>

                <div className="icon-wrap success-icon-wrap">
                    <svg className="checkmark" viewBox="0 0 52 52">
                        <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
                        <path className="checkmark-check" fill="none" d="M14 27l7 7 17-17" />
                    </svg>
                </div>

                <h1 className="payment-title success-title">Payment Successful!</h1>
                <p className="payment-subtitle">
                    Your subscription has been activated. Welcome aboard — your account is
                    now ready to use.
                </p>

                {/* <div className="payment-details">
                    <div className="detail-row">
                        <span className="detail-label">Status</span>
                        <span className="detail-value success-badge">Confirmed</span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">Redirecting in</span>
                        <span className="detail-value">{counter}s</span>
                    </div>
                </div> */}

                <button className="payment-btn success-btn" onClick={() => navigate("/")}>
                    Go to Dashboard
                </button>

                <p className="payment-note">
                    A confirmation email has been sent to your registered address.
                </p>
            </div>
        </div>
    );
};

export default PaymentSuccess;