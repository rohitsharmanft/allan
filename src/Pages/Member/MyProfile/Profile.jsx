// src/pages/Profile.jsx
import React, { useContext, useEffect } from "react";
import "./Profile.css";
import GradientButton from "../../../Components/Common/GradientButton";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../../contexts/AppContexts";
import LoadingCard from "../../../Components/Common/LoadingCard/LoadingCard";
import Avatar from "../../../assets/images/user.png"
const Profile = () => {
  const navigate = useNavigate();
  const { user, loadingProfile, refreshProfile } = useContext(AppContext);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }, []);

  // if (loadingProfile) {
  //   return <div><LoadingCard /></div>;
  // } 
  return (
    <div className="profile-container">
      <h2 className="profile-title">Account Details- Welcome {user?.fullName || "NA"}!</h2>
      <div className="client-info-card">
          <ul className="client-info-list">
            <p>On this page you can do the following:</p>
            <li>1. Complete your profile on the My Profile tab.</li>
            <li>2. Upload your personal or business logo or profile photo on the Account Details tab.</li>
            <li>3. Manage the Job applications that you have submitted.</li>
            <li>4. Manage the Project quotations that you have submitted.</li>
            <li>5. Renew your annual subscription.</li>
            <li>6. Upgrade  your subscription to get more benefits if you have Free or Basic membership.</li>
          </ul>
        </div>

      <div className="profile-wrapper">
        <div className="profile_card">
          <div className="profile-info">
            <img
              src={user?.image || Avatar}
              alt={user?.fullName || "profile"}
              className="profile-avatar"
            />
            <div className="details">
              <h3>{user?.fullName || "NA"}</h3>
              {/* <p className="job-title">{user?.jobTitle || "NA"}</p> */}
              <p className="email">{user?.email || "NA"}</p>
              <p className="mobile">Mobile : {user?.phoneNumber || "NA"}</p>
            </div>
          </div>

          <GradientButton className="edit-btn" text={"Edit"} onClick={() => navigate("/edit-profile", { state: user })} />
        </div>

        <div className="password-section">
          <span className="change-label">Change password</span>
          <GradientButton
            className="change-password-btn"
            text={"Change Password"}
            onClick={() => navigate("/change-password")}
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
