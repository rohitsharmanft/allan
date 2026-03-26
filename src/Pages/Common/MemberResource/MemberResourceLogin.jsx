import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./MemberResourceLogin.css";
import Footer from "../../../Components/Common/Footer/Footer";
import MemberPricingCard from "../../../Components/Common/MemberPricingCard";
import Header from "../../../Components/Common/Header/Header";
import { AppContext } from "../../../contexts/AppContexts";
import { get_plan, upgrade_subscription } from "../../../api";
import { toast } from "react-toastify";


const freeBenefits = [
  "Create Company or Individual Profile",
  "Verified and Rated Reviews – you need to deliver what you promise and delight your clients for repeat work.",
  "Provide one quotation for a project per month",
];

const MemberResourceLogin = () => {
  const navigate = useNavigate();
  const { token, refreshProfile, subscriptionData, user } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState(null);
  const isfree = user?.membership === "Free"

  useEffect(() => { refreshProfile(); }, []);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await axios.get(get_plan);
        const paidPlans = res.data.data.filter(
          (p) => p.name.toLowerCase() !== "free"
        );
        setPlans(paidPlans);
      } catch (err) {
        console.error(err);
        setError("Failed to load plans. Please refresh the page.");
      }
    };
    fetchPlans();
  }, []);

  const handleSubscribe = async (planId) => {
    // setLoading(true);
    // setError(null);
    // console.log("planId:", planId);
    // console.log("token:", token);
    // try {
    //   const res = await axios.post(create_subscription, { planId });
    //   console.log("planId:", planId);
    //   console.log("token:", token);
    //   const { payfastUrl, payload } = res.data.data;
    //   console.log(res.data.data)
    //   console.log(JSON.stringify(payload, null, 2));

    //   const form = document.createElement("form");
    //   form.method = "POST";
    //   form.action = payfastUrl;

    //   Object.keys(payload).forEach((key) => {
    //     const input = document.createElement("input");
    //     input.type = "hidden";
    //     input.name = key;
    //     input.value = payload[key];
    //     form.appendChild(input);
    //   });

    //   document.body.appendChild(form);
    //   form.submit();
    // } catch (err) {
    //   console.log(err.response?.data);
    //   console.error(err);
    //   setError(err.response?.data?.message || 'Subscription failed. Please try again.');
    // } finally {
    //   setLoading(false);
    // }
    navigate('/signUp-member', { state: planId })
  };

  // const handleUpgrade = async (planId) => {
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     const res = await axios.post(upgrade_subscription, { planId }, { headers: { Authorization: `Bearer ${token}` } });
  //     const { payfastUrl, payload } = res.data.data;
  //     const form = document.createElement("form");
  //     form.method = "POST";
  //     form.action = payfastUrl;
  //     Object.keys(payload).forEach((key) => {
  //       const input = document.createElement("input");
  //       input.type = "hidden";
  //       input.name = key;
  //       input.value = payload[key];
  //       form.appendChild(input);
  //     });
  //     document.body.appendChild(form);
  //     form.submit();
  //   } catch (err) {
  //     console.log(err.response)
  //     toast.error(err.response?.data?.error_description || "Upgrade failed");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleUpgrade = async (planId) => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(upgrade_subscription, { planId }, { headers: { Authorization: `Bearer ${token}` } });
      const { payfastUrl, payload } = res.data.data;
      const form = document.createElement("form");
      form.method = "POST";
      form.action = payfastUrl;

      Object.keys(payload).forEach((key) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = payload[key];
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      setError(err.response?.data?.message || "Upgrade failed");
      toast.error(err.response?.data?.error_description)
    } finally {
      setLoading(false);
    }
  }

  const getBenefits = ({ quotationsPerMonth, canUseGallery, canAddSocialLinks }) => {
    const benefits = [
      "Create Company or Individual Profile",
      "Verified and Rated Reviews – you need to deliver what you promise and delight your clients for repeat work.",
    ];
    if (canUseGallery) benefits.push("Photo Gallery to Showcase your Work");
    if (quotationsPerMonth === 0) {
      benefits.push("Provide unlimited quotations for projects");
    } else {
      benefits.push(
        `Provide ${quotationsPerMonth === 1 ? "one quotation for a project" : `up to ${quotationsPerMonth} quotations`} per month`
      );
    }
    if (canAddSocialLinks) benefits.push("You can put links for all your Social Media accounts thereby giving you more visibility.");
    if (canUseGallery && canAddSocialLinks) benefits.push("Access to training material and downloads.");
    return benefits;
  };

  const currentPlanName = subscriptionData?.planName?.toLowerCase() || user?.membership?.toLowerCase() || null
  console.log(currentPlanName)

  const isFreeCurrent = currentPlanName === "Free";
  const hasSubscription = !!currentPlanName && currentPlanName !== "Free";

  console.log(hasSubscription)

  console.log(isFreeCurrent)

  return (
    <>
      <Header />
      <div className="member-resource">
        <div className="hero-section">
          <div className="overlay"></div>
          <h1>Member Resources - Login</h1>
        </div>

        <div className="member-resource-content">
          <h2 className="member">Membership Overview</h2>

          {plans.length === 0 && !error && (
            <p style={{ textAlign: "center", color: "#666" }}>Loading plans...</p>
          )}

          <div className="pricing-cards-container">

            {/* Dynamic paid plans (Basic, Premium) from API */}
            {plans.map((plan) => {
              const isCurrentPlan = subscriptionData?.planName?.toLowerCase() === plan.name.toLowerCase();
              return (
                <MemberPricingCard
                  key={plan._id}
                  plan={plan.name.charAt(0).toUpperCase() + plan.name.slice(1)}
                  price={String(plan.price)}
                  usdPrice={String(plan.price)}
                  benefits={getBenefits(plan.features)}
                  onClick={() => {
                    if (isCurrentPlan) return;
                    if (hasSubscription) {
                      handleUpgrade(plan._id);
                    } else {
                      handleSubscribe(plan._id);
                    }
                  }}
                  buttonText={
                    isCurrentPlan
                      ? "Current Plan"
                      : hasSubscription
                        ? "Upgrade Plan"
                        : "Select & Sign Up"
                  }
                  disabled={isCurrentPlan}
                />
              );
            })}
            {plans.length > 0 && (
              <MemberPricingCard
                plan="Free"
                price="0"
                usdPrice="0"
                benefits={freeBenefits}
                onClick={() => {
                  if (!isFreeCurrent) {
                    navigate("/signup-member", { state: { plan: "Free" } });
                  }
                }}
                buttonText={isFreeCurrent ? "Current Plan" : "Get Started Free"}
                disabled={isFreeCurrent}
              />
            )}

          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MemberResourceLogin;