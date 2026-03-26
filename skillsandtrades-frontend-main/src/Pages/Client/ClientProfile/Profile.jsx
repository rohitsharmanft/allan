import React, { useEffect } from "react";
import "./Profile.css";
import GradientButton from "../../../Components/Common/GradientButton";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../../contexts/AppContexts";
import { useContext } from "react";
import Avatar from "../../../assets/images/user.png";

const Profile = () => {
  const navigate = useNavigate();
  const { user, loadingProfile, refreshProfile } = useContext(AppContext);
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    refreshProfile();
  }, []);
  return (
    <div className="profile-container">
      <h2 className="profile-title">Account Details</h2>
       
       <div className="client-info-card">
          <ul className="client-info-list">
            <p>On this page you can do the following:</p>
            <li>1. Post a Job and get applications.</li>
            <li>2. Post a Project and get quotations.</li>
            <li>3. Leave Review for a completed Project.</li>
            <li>4. Manage your Jobs and Projects.</li>
          </ul>
        </div>
      <div className="profile-wrapper">
        <div className="profile_card">
          <div className="profile-info">
            <img
              src={user?.image || Avatar}
              alt="Profile"
              className="profile_image"
            />
            <div className="details">
              <h3>{user?.fullName || "NA"}</h3>
              {/* <p className="job-title">{user?.jobTitle || "NA"}</p> */}
              <p className="email">{user?.email || "NA"}</p>
              <div className="mobile-div">
                <p className="mobile">Mobile : {user?.phoneNumber || "NA"}</p>
              </div>
            </div>
          </div>

          <GradientButton
            className="edit-btn"
            text={"Edit"}
            onClick={() => navigate("/client-edit-profile")}
          />
        </div>

        <div className="password-section">
          <span className="change-label">Change password</span>
          <GradientButton
            className="change-password-btn"
            text={"Change Password"}
            onClick={() => navigate("/client-change-password")}
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
