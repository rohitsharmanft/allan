import React, { useContext, useEffect } from "react";
import "./SubscriptionCard.css";
import Footer from "../../../Components/Common/Footer/Footer";
import Sidebar from "../../../Components/Member/Sidebar";
import Header from "../../../Components/Common/Header/Header";
import { AppContext } from "../../../contexts/AppContexts";
import GradientButton from "../../../Components/Common/GradientButton";
import { Upgrade } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const SubscriptionCard = () => {
  const { user, refreshProfile } = useContext(AppContext)
  const navigate = useNavigate()
  useEffect(() => { refreshProfile() }, [])
  const subscriptionData = user?.subscriptionsData
  const isfree = user?.membership === "Free"
  console.log(subscriptionData)
  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getDaysRemaining = (endDate) => {
    if (!endDate) return 0;

    const today = new Date();
    const end = new Date(endDate);
    today.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const diffInMs = end - today;
    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

    return diffInDays > 0 ? diffInDays : 0;
  };

  const daysRemaining = getDaysRemaining(subscriptionData?.end_date);


  return (
    <>
      <Header />
      <div className="hero-section">
        <div className="overlay"></div>
        <h1>Member</h1>
      </div>
      <div className="dashboard">
        <Sidebar />


        <div className="j">
          <h2 className="reviewwww">Manage Subscription</h2>
          <div className="subscription-card">
            <h4>Manage {user?.membership}  Plan Subscription</h4>

            <p>
              Current Plan: {subscriptionData?.planName || user?.membership}
            </p>
            {/* <p>
                Profiles Allowed: 0
              </p>
              <p>
                Profiles Created: 4
              </p> */}
            {!isfree &&
              <>
                <p>
                  Subscription Start: {formatDate(subscriptionData?.start_date)}
                </p>
                <p>
                  Subscription End: {formatDate(subscriptionData?.end_date)}
                </p>
              </>
            }
            <div className="days-box">
              {isfree ? 'You have a free plan' : `Days Remaining: ${daysRemaining} Days`}
            </div>
            <div className="upgrade-renew-btn" >
              <GradientButton text={"Upgrade Now"} onClick={() => navigate("/member-resource-login")} />
              <GradientButton
                text="Renew Subscription"
                className=""
                disabled={daysRemaining !== 0}
                onClick={() => navigate("/member-resource-login")}
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default SubscriptionCard;
